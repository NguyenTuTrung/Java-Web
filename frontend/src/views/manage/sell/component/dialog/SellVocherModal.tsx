import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import CloseButton from '@/components/ui/CloseButton'
import instance from '@/axios/CustomAxios'
import { OrderResponseDTO } from '@/@types/order'
import { useLoadingContext } from '@/context/LoadingContext'
import axios from 'axios'
import { useToastContext } from '@/context/ToastContext'
import { Select } from '@/components/ui'

type VoucherDTO = {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
    customerId: number | null;
    customerName: string | null;
    customerEmail: string | null;
};

const SellVoucherModal = ({
                              setIsOpenVoucherModal,
                              selectOrder,
                              fetchData
                          }: {
    setIsOpenVoucherModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectOrder: OrderResponseDTO;
    fetchData: () => Promise<void>;
}) => {
    const { sleep } = useLoadingContext()
    const { openNotification } = useToastContext()
    const inputRef = useRef(null)

    const [data, setData] = useState<VoucherDTO[]>([])
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 5,
        query: '',
        typeTicket: '',
        sort: { order: '', key: '' }
    })

    const typeOptions = [
        { value: 'Individual', label: 'Cá nhân' },
        { value: 'Everybody', label: 'Mọi người' }
    ]

    const columns = [
        { header: '#', cell: (props: any) => props.row.index + 1 },
        { header: 'Mã', accessorKey: 'code' },
        { header: 'Tên', accessorKey: 'name' },
        { header: 'Ngày bắt đầu', accessorKey: 'startDate' },
        { header: 'Ngày kết thúc', accessorKey: 'endDate' },
        { header: 'Số lượng', accessorKey: 'quantity' },
        {
            header: 'Loại',
            accessorKey: 'typeTicket',
            cell: (props: any) => (
                <p>{props.row.original.typeTicket === 'Everybody' ? 'Mọi người' : 'Cá nhân'}</p>
            )
        },
        { header: '% tối đa', accessorKey: 'maxPercent' },
        {
            accessorKey: 'minAmount',
            header: 'Hóa đơn tối thiểu',
            cell: (props: any) => (
                <p>{`${props.row.original.minAmount.toLocaleString('vi')}đ`}</p>
            )
        },
        {
            header: 'Giảm',
            cell: (props: any) => (
                <p className={'text-red-600'}>{Math.round(props.row.original.maxPercent / 100 * selectOrder.subTotal).toLocaleString('vi') + 'đ'}</p>
            )
        },
        {
            header: 'Loại',
            cell: (props: any) => (
                <div>
                    <p
                        className={`${selectOrder.subTotal >= props.row.original.minAmount ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {selectOrder.subTotal >= props.row.original.minAmount ? 'Có thể áp dụng' : 'Không đủ điều kiện'}
                    </p>
                </div>
            )
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props: any) => (
                <Button
                    size="xs"
                    onClick={() => handleUseVoucher(props.row.original.id)}
                >
                    Chọn
                </Button>
            )
        }
    ]

    const fetchDataProduct = async () => {
        try {
            setLoading(true)
            const params = {
                page: tableData.pageIndex - 1,
                size: tableData.pageSize,
                query: tableData.query,
                typeTicket: tableData.typeTicket,
                sort: tableData.sort ? (tableData.sort.key + ',' + tableData.sort.order) : '',
                customerId: selectOrder?.customerResponseDTO?.id
            }
            const response = await instance.get(`/voucher/find-valid-voucher`, { params: params })
            setData(response.data.content || [])
            setTableData((prev) => ({ ...prev, total: response.data.totalElements || 0 }))
        } finally {
            setLoading(false)
        }
    }

    const handleUseVoucher = async (idVoucher: number) => {
        try {
            await instance.post(`/orders/use-voucher-by-id`, {
                idOrder: selectOrder.id,
                idVoucher
            }).then(function(response) {
                if (response.status === 200) {
                    openNotification('Áp khuyễn mãi thành công')
                    sleep(500)
                    fetchData()
                }
            })
            closeModal()
        } catch (error) {
            if (axios.isAxiosError(error) && error?.response?.status === 400) {
                openNotification(error.response.data?.error)
            }
        }
    }

    const handleDebouncedChange = debounce((value: string) => {
        setTableData((prev) => ({ ...prev, query: value }))
    }, 500)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleDebouncedChange(e.target.value)
    }

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: pageIndex }))
    }

    const handleSelectChange = (pageSize: number) => {
        setTableData((prev) => ({ ...prev, pageSize: pageSize }))
    }

    const handleSort = ({ order, key }: { order: 'asc' | 'desc'; key: string }) => {
        setTableData((prev) => ({
            ...prev,
            sort: { order, key }
        }))
    }

    const closeModal = () => {
        setIsOpenVoucherModal(false)
        document.body.style.overflow = 'auto'
    }

    useEffect(() => {
        fetchDataProduct()
    }, [tableData.pageIndex, tableData.pageSize, tableData.query, tableData.typeTicket, tableData.sort])


    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-40">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10/12 h-auto bg-gray-100 shadow-md rounded-md">
                <div className="p-5 bg-white h-4/5 rounded-md">
                    <div className="flex justify-between pb-3">
                        <p className="font-semibold text-xl">Danh sách khuyến mãi</p>
                        <CloseButton
                            className="text-2xl py-1"
                            onClick={closeModal}
                        />
                    </div>
                    <div className="grid xl:grid-cols-3 grid-cols-1 gap-2 mb-3">
                        <Input
                            ref={inputRef}
                            placeholder="Tìm kiếm theo tên, mã"
                            size="sm"
                            className="xl:col-span-2"
                            onChange={handleChange}
                        />
                        <Select
                            size="sm"
                            isClearable
                            placeholder="Loại phiếu"
                            options={typeOptions}
                            onChange={(newValue) => {
                                setTableData((prev) => ({
                                    ...prev,
                                    typeTicket: newValue?.value || ''
                                }))
                            }}
                        />
                    </div>
                    {
                        data.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={data}
                                loading={loading}
                                pagingData={tableData}
                                onPaginationChange={handlePaginationChange}
                                onSelectChange={handleSelectChange}
                                onSort={handleSort}
                            />
                        ):(
                        <div className={'flex justify-center py-10'}>
                            <p className={'flex justify-between py-28 items-center text-xl font-semibold'}>Không có khuyễn mãi nào phù hợp</p>

                        </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default SellVoucherModal
