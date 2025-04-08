import React, { useState, useEffect, useRef, ChangeEvent, SetStateAction } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import CloseButton from '@/components/ui/CloseButton'
import instance from '@/axios/CustomAxios'
import { useLoadingContext } from '@/context/LoadingContext'
import axios from 'axios'
import { useToastContext } from '@/context/ToastContext'
import { Pagination, Select } from '@/components/ui'
import { useSaleContext } from '@/views/sale/SaleContext'
import { b } from 'vite/dist/node/types.d-aGj9QkWt'
import { CartResponseDTO } from '@/views/sale/index'
import { HiOutlineTicket } from 'react-icons/hi'
import useAuth from '@/utils/hooks/useAuth'
import { useAuthContext } from '@/views/client/auth/AuthContext'

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

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

interface Voucher {
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
}

const VoucherModal = ({
    onVoucherSelect,
    isVoucherModalOpen,
    setIsVoucherModalOpen,
    toggleVoucherModal
}: {
    onVoucherSelect: (voucher: Voucher) => void;
    isVoucherModalOpen: boolean;
    setIsVoucherModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleVoucherModal: () => void;
}) => {
    const { sleep } = useLoadingContext()
    const { openNotification } = useToastContext()

    const [data, setData] = useState<VoucherDTO[]>([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuthContext();
    const [totalElements, setTotalElements] = useState<number>(0)
    useEffect(() => {
        console.log("user", user)
    }, [])

    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 5,
        query: '',
        typeTicket: '',
        sort: { order: '', key: '' }
    })

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }


    const { selectedCart } = useSaleContext()

    const fetchDataProduct = async () => {
        try {
            setLoading(true)
            const params = {
                page: tableData.pageIndex - 1,
                size: tableData.pageSize,
                query: tableData.query,
                typeTicket: tableData.typeTicket,
                sort: tableData.sort ? (tableData.sort.key + ',' + tableData.sort.order) : '',
                customerId: user?.customerId || ''
            }
            const response = await instance.get(`/voucher/find-valid-voucher`, { params: params })
            setData(response.data.content || [])
            setTotalElements(response.data.totalElements)
            setTableData((prev) => ({ ...prev, total: response.data.totalElements || 0 }))
        } finally {
            setLoading(false)
        }
    }

    const closeModal = () => {
        setIsVoucherModalOpen(false)
        document.body.style.overflow = 'auto'
    }

    useEffect(() => {
        fetchDataProduct()
    }, [tableData.pageIndex, tableData.pageSize, tableData.query, tableData.typeTicket, tableData.sort])


    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-40">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/12 h-auto bg-gray-100 shadow-md rounded-md">
                <div className="p-5 bg-white h-2/5 rounded-md">
                    <div className="flex justify-between pb-3">
                        <p className="font-semibold text-xl">Danh sách khuyến mãi</p>
                        <CloseButton
                            className="text-2xl py-1"
                            onClick={closeModal}
                        />
                    </div>
                    {
                        data.length > 0 ? (
                            <div className={'flex flex-col gap-2'}>
                                {data.map((item, index) => (
                                    <div key={index} className={'flex h-40 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer'}>
                                        <div className={'w-24 bg-[#ee4d2d] flex items-center justify-center'}>
                                            <div className={'text-white'}>
                                                <HiOutlineTicket size={32} />
                                            </div>
                                        </div>

                                        <div className={'flex-1 px-3 py-2 relative border-gray-300 border'}>
                                            <div className={'inline-block bg-[#ee4d2d] text-white text-xs px-1.5 py-1 rounded-sm mb-1'}>
                                                {item.code}
                                            </div>

                                            <div className={'text-gray-800 font-medium text-base mb-1'}>
                                                Giảm: {item.maxPercent}%  <br></br>
                                                Đơn tối thiểu: <span className="text-blue-600 font-semibold text-lg"> {item.minAmount.toLocaleString('vi')} vnđ</span>
                                            </div>


                                            <div className={'flex items-center gap-1 text-xs'}>
                                                <span className={'text-gray-400'}>- HSD: {item.endDate}</span>
                                            </div>


                                            <div className={'text-[#0055AA] text-xs mt-1'}>
                                                Chi tiết {'>>'}
                                            </div>

                                            <div className="absolute inset-0 flex items-center justify-end mr-2">
                                                <button
                                                    type={'button'}
                                                    className={'border-black border p-1 text-[20px] font-semibold'}
                                                    onClick={() => onVoucherSelect(item)}
                                                >
                                                    Chọn
                                                </button>
                                            </div>


                                            <div className={'absolute -left-[6px] top-0 h-full flex flex-col justify-between py-1'}>
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className={'w-3 h-3 rounded-full bg-gray-100'}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center py-10">
                                <p className="flex justify-between py-28 items-center text-xl font-semibold">
                                    Không có khuyến mãi nào phù hợp
                                </p>
                            </div>
                        )
                    }
                    <div className={'flex justify-center'}>
                        <Pagination
                            total={totalElements}
                            currentPage={tableData.pageIndex}
                            pageSize={tableData.pageSize}
                            onChange={(el) => {
                                handlePaginationChange(el)
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default VoucherModal
