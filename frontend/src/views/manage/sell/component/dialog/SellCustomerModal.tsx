import { useState, useEffect, useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import type { ColumnDef, OnSortParam} from '@/components/shared/DataTable'
import CloseButton from '@/components/ui/CloseButton'


import instance from '@/axios/CustomAxios'
import { SellCustomerOverview } from '../..'
import { OrderResponseDTO } from '@/@types/order'

const SellCustomerModal = ({ setIsOpenCustomerModal, selectOrder, fetchData }: { setIsOpenCustomerModal: Dispatch<SetStateAction<boolean>>, selectOrder: OrderResponseDTO, fetchData: () => Promise<void> }) => {
    const inputRef = useRef(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number;
        };
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    })
    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
        setQueryParam((pre) => ({ ...pre, page: pageIndex }))
    }
    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }));
        setQueryParam((pre) => ({ ...pre, size: pageSize }))
    }
    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace("___", "."),
            },
        }));
    }
    const columns: ColumnDef<SellCustomerOverview>[] = [
        {
            header: '#',
            cell: (props) => (
                props.row.index + 1
            ),
        },
        {
            header: 'Mã',
            accessorKey: 'code',
        },
        {
            header: 'Tên',
            accessorKey: 'name',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Số điện thoại',
            accessorKey: 'phone',
        },
        {
            header: 'Đ/c mặc định',
            cell: (props) => (
                <p>{props.row.original.defaultAddress ? "Có" : "Không"}</p>
            ),
        },
        {
            header: 'Giới tính',
            accessorKey: 'gender',
            cell: (props) => (
                <p>{props.row.original.gender === "Male" ? "Nam" : "Nữ"}</p>
            ),

        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props) => (
                <Button
                    size="xs"
                    onClick={() => {
                        console.log("Selected id customer: ", props.row.original.id)
                        handleUpdateCustomerInfoOrder(props.row.original.id)

                    }}
                >
                    Chọn
                </Button>
            ),
        },
    ]
    const [queryParam, setQueryParam] = useState<{
        size: number | undefined,
        page: number | undefined,
        query: string | undefined,
        status: string

    }>({
        size: 10,
        page: undefined,
        query: undefined,
        status: "Active"
    })

    // FUCTION

    const handleUpdateCustomerInfoOrder = async (idCustomer: number) => {
        const data = {
            "id": selectOrder.id,
            "customer": {
                "id": idCustomer
            }
        }
        await instance.put(`/orders/edit-customer/${selectOrder.id}`, data).then(function (response) {
            console.log(response)
        })
        await handleDelayScreen();
        await fetchData();
        setIsOpenCustomerModal(false)
        document.body.style.overflow = 'auto';
    }

    const fetchDataProduct = async () => {
        setLoading(true)
        const response = await instance.get('/customer/search-active', {
            params: queryParam
        });
        setData(response.data.content)
        setLoading(false)
        setTableData((prevData) => ({
            ...prevData,
            ...{ total: response.data.totalElements },
        }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const debounceFn = debounce(handleDebounceFn, 500)
    function handleDebounceFn(val: string) {
        console.log(val)
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 },
            }))
            setQueryParam((pre) => ({ ...pre, query: val }))
        }
    }

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const handleDelayScreen = async () => {
        setLoading(true);
        await sleep(500)
        setLoading(false);
    }

    // HOOK
    useEffect(() => {
        fetchDataProduct();
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        queryParam
    ])
    return (
        <div className='fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-40'>
            <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/6 h-auto bg-gray-100 z-20 shadow-md rounded-md'>
                <div className='p-5 bg-white !h-4/5 rounded-md'>
                    <div className='flex justify-between pb-3'>
                        <div>
                            <p className='font-semibold text-xl'>Danh sách khách hàng</p>
                        </div>
                        <div>
                            <CloseButton
                                className='text-2xl py-1'
                                onClick={() => {
                                    setIsOpenCustomerModal(false)
                                    document.body.style.overflow = 'auto';
                                }}
                            ></CloseButton>
                        </div>
                    </div>
                    <div>
                        <div className={'pb-5'}>
                            <Input
                                ref={inputRef}
                                placeholder="Search..."
                                size="sm"
                                className="lg:w-full"
                                onChange={(el) => handleChange(el)}
                            />
                        </div>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={loading}
                            pagingData={tableData}
                            onPaginationChange={handlePaginationChange}
                            onSelectChange={handleSelectChange}
                            onSort={handleSort}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellCustomerModal;