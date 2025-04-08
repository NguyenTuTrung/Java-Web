import { useState, useEffect, useRef, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import { Badge, DatePicker, Select } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { StatusBill, EOrderStatusEnums, OrderTypeBill, EOrderTypeEnums } from '@/@types/order'
import { Link } from 'react-router-dom'
import { HiEye, HiOutlineSearch } from 'react-icons/hi'
import instance from '@/axios/CustomAxios'
import { parse, formatDistanceToNow, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import TypeOrderFormat from '@/views/util/TypeOrderFormat'
import IsInStoreOrderFormat from '@/views/util/IsInStoreOrderFormat'
import OrderStatusTimeline from './OrderStatusTimeline'
import { message } from 'antd'


type BadgeType =
    'countAll'
    | 'countPending'
    | 'countToShip'
    | 'countToReceive'
    | 'countDelivered'
    | 'countCancelled'
    | 'countReturned'

interface ICountStatus {
    countAll: number;    // Số lượng hóa đơn chờ xác nhận
    countPending: number;    // Số lượng hóa đơn chờ xác nhận
    countToShip: number;     // Số lượng hóa đơn chờ giao hàng
    countToReceive: number;  // Số lượng hóa đơn đang giao hàng
    countDelivered: number;  // Số lượng hóa đơn đang giao hàng
    countCancelled: number;  // Số lượng hóa đơn đã hủy
    countReturned: number;   // Số lượng hóa đơn trả hàng
}

type IOveriewBill = {
    id: number;
    code: string;
    phone: string;
    status: string;
    customerName: string;
    staffName: string;
    address: string;
    type: string;
    total: number;
    totalPaid: number;
    deliveryFee: number;
    subTotal: number;
    discount: number;
    inStore: boolean;
    discountVoucherPercent: number;
    createdDate: string
}


interface Account {
    id: number;
    username: string;
    staff?: {
        code: string;
        name: string;
        email: string;
        phone: string;
    };
    customer?: {
        id: number;
        code: string;
        name: string;
        email: string;
        phone: string;
        addressResponseDTOS: Array<{
            id: number;
            phone: string;
            name: string;
            province: string;
            district: string;
            ward: string;
            detail: string;
            defaultAddress: boolean;
        }>;
    };
}


interface BillHistory {
    id: number;
    status: Status;
    note: string;
    createdDate: string;
    updatedDate?: string;
    account: Account;
}

enum Status {
    PLACED = "PLACED",
    PENDING = "PENDING",
    TOSHIP = "TOSHIP",
    TORECEIVE = "TORECEIVE",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED"
}

interface Bill {
    status: string;
}


export const MyOrderTable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [countAnyStatus, setCountAnyStatus] = useState<ICountStatus>({
        countAll: 0,
        countPending: 0,
        countToShip: 0,
        countCancelled: 0,
        countDelivered: 0,
        countReturned: 0,
        countToReceive: 0
    })
    const [queryParam, setQueryParam] = useState<{
        type: EOrderTypeEnums,
        status: EOrderStatusEnums | string,
        inStore?: boolean,
        createdFrom: string,
        createdTo: string
    }>({
        type: '',
        status: '',
        createdFrom: '',
        createdTo: ''
    })

    const setFromDateParam = (p: string) => {
        setQueryParam(prevState => ({
            ...prevState,
            createdFrom: p
        }))
    }

    const setToDateParam = (p: string) => {
        setQueryParam(prevState => ({
            ...prevState,
            createdTo: p
        }))
    }

    const setInStoreParam = (p: boolean) => {
        setQueryParam(prevState => ({
            ...prevState,
            inStore: p
        }))
    }

    const setTypeParam = (p: EOrderTypeEnums) => {
        setQueryParam(prevState => ({
            ...prevState,
            type: p
        }))
    }

    const setStatusParam = (p: EOrderStatusEnums) => {
        setQueryParam(prevState => ({
            ...prevState,
            status: p
        }))
    }

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
            key: ''
        }
    })

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        console.log(val)
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 }
            }))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const calculateDistanceTime = (formattedDate: string) => {
        console.log('Input formattedDate:', formattedDate)

        // Parse date theo định dạng "yyyy-MM-dd HH:mm:ss.SSSSSS"
        const date = parse(formattedDate, 'HH:mm dd-MM-yyyy', new Date())
        if (isNaN(date.getTime())) {
            console.error('Invalid date format')
            return 'Invalid date'
        }


        // Tính khoảng cách thời gian so với hiện tại
        const distance = formatDistanceToNow(date, { addSuffix: true, locale: vi })

        return distance
    }


    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])


    const handleRangePickerChange = (date: [Date | null, Date | null]) => {
        console.log('Selected range date', date)

        if (date[0]) {
            const formattedFromDate = format(date[0], 'yyyy-MM-dd\'T\'HH:mm:ss')
            console.log(formattedFromDate)
            setFromDateParam(formattedFromDate)
        } else {
            setFromDateParam('')
        }

        if (date[1]) {
            const formattedToDate = format(date[1], 'yyyy-MM-dd\'T\'HH:mm:ss')
            console.log(formattedToDate)
            setToDateParam(formattedToDate)
        } else {
            setToDateParam('')
        }

        setDateRange(date)
    }


    const columns: ColumnDef<IOveriewBill>[] = [
        {
            header: '#',
            cell: (props) => (
                props.row.index + 1
            )
        },
        {
            header: 'Mã',
            accessorKey: 'code',
            cell: (props) => (
                <p>{props.row.original.code}</p>
            )
        },
        {
            header: 'Tổng giá trị',
            accessorKey: 'subTotal',
            cell: (props) => (
                Math.round(props.row.original.subTotal).toLocaleString('vi') + 'đ'
            )
        },
        {
            header: 'Tiền giảm',
            accessorKey: 'discount',
            cell: (props) => (
                `(${props.row.original.discountVoucherPercent}%)` + ' ~ ' + Math.round(props.row.original.discount).toLocaleString('vi') + 'đ'
            )
        },
        {
            header: 'Phí',
            accessorKey: 'deliveryFee',
            cell: (props) => (
                Math.round(props.row.original.deliveryFee).toLocaleString('vi') + 'đ'
            )
        },
        {
            header: 'Đã Trả',
            accessorKey: 'totalPaid',
            cell: (props) => (
                Math.round(props.row.original.totalPaid).toLocaleString('vi') + 'đ'
            )
        },
        {
            header: 'Cần TT',
            accessorKey: 'total',
            cell: (props) => (
                Math.round(props.row.original.total).toLocaleString('vi') + 'đ'
            )
        },
        {
            header: 'Thời gian',
            accessorKey: 'createdDate',
            cell: (props) => (
                calculateDistanceTime(props.row.original.createdDate)
            )
        },
        {
            header: 'Trạng thái',
            accessorKey: 'status',
            cell: (props) => (
                <Button
                    size="xs"
                    block
                    variant="solid"
                    className={`!bg-none !bg-transparent !bg-opacity-100 ${props.row.original.status === 'PENDING'
                        ? '!text-yellow-500'
                        : props.row.original.status === 'TOSHIP'
                            ? '!text-blue-500'
                            : props.row.original.status === 'TORECEIVE'
                                ? '!text-green-500'
                                : props.row.original.status === 'DELIVERED'
                                    ? '!text-purple-500'
                                    : props.row.original.status === 'CANCELED'
                                        ? '!text-red-500'
                                        : '!text-gray-500'
                        }`}
                >
                    <span className={`flex items-center font-bold`}>
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${props.row.original.status === 'PENDING'
                                ? '!bg-yellow-500'
                                : props.row.original.status === 'TOSHIP'
                                    ? '!bg-blue-500'
                                    : props.row.original.status === 'TORECEIVE'
                                        ? '!bg-green-500'
                                        : props.row.original.status === 'DELIVERED'
                                            ? '!bg-purple-500'
                                            : props.row.original.status === 'CANCELED'
                                                ? '!bg-red-500'
                                                : '!bg-gray-500'
                                }`}></span>
                        <span>
                            <p>
                                {props.row.original.status === 'PENDING'
                                    ? 'Chờ xác nhân'
                                    : props.row.original.status === 'TOSHIP'
                                        ? 'Chờ vận chuyển'
                                        : props.row.original.status === 'TORECEIVE'
                                            ? 'Đang vận chuyển'
                                            : props.row.original.status === 'DELIVERED'
                                                ? 'Đã hoàn thành'
                                                : props.row.original.status === 'CANCELED'
                                                    ? 'Đã hủy đơn'
                                                    : 'Không xác định'}
                            </p>
                        </span>
                    </span>
                </Button>

            )
        },
        {
            header: 'PT Nhận Hàng',
            accessorKey: 'type',
            cell: (props) => (
                <span><TypeOrderFormat status={props.row.original.type}></TypeOrderFormat></span>
            )
        },
        {
            header: 'Loại đơn',
            accessorKey: 'inStore',
            cell: (props) => (
                <span><IsInStoreOrderFormat status={props.row.original.inStore}></IsInStoreOrderFormat></span>
            )
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props) => (
                <Button size="xs" className="w-full flex justify-start items-center" variant="plain">
                    <Link to={`/me/my-order/${props.row.original.id}`}><HiEye size={20} className="mr-3 text-2xl"
                        style={{ cursor: 'pointer' }} /></Link>
                </Button>

            )
        }
    ]

    const statusBills: StatusBill[] = [
        { label: 'TẤT CẢ', value: EOrderStatusEnums.EMPTY, badge: 'countAll' },
        { label: 'CHỜ XÁC NHẬN', value: EOrderStatusEnums.PENDING, badge: 'countPending' },
        { label: 'CHỜ VẬN CHUYỂN', value: EOrderStatusEnums.TOSHIP, badge: 'countToShip' },
        { label: 'ĐANG VẬN CHUYỂN', value: EOrderStatusEnums.TORECEIVE, badge: 'countToReceive' },
        { label: 'ĐÃ HOÀN THÀNH', value: EOrderStatusEnums.DELIVERED, badge: 'countDelivered' },
        { label: 'ĐÃ HỦY', value: EOrderStatusEnums.CANCELED, badge: 'countCancelled' }
    ]

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }))
    }

    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace('___', '.')
            }
        }))
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await instance.post('/orders/me/overview', tableData,
                {
                    params: queryParam
                }
            )
            console.log(response)
            if (response.data) {
                setData(response.data.content)
                setLoading(false)
                setTableData((prevData) => ({
                    ...prevData,
                    ...{ total: response.data.totalElements }
                }))
            }
        }
        fetchCountAnyStatus()
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        queryParam
    ])

    const listTypeBillOptions: OrderTypeBill[] = [
        { label: 'Tất cả', value: '' },
        { label: 'Tại quầy', value: 'INSTORE' },
        { label: 'Giao hàng', value: 'ONLINE' }
    ]

    const listTypeOrder = [
        { label: 'Tất cả', value: null },
        { label: 'Tại quầy', value: true },
        { label: 'Trực tuyến', value: false }
    ]

    const fetchCountAnyStatus = async () => {
        instance.get(`orders/me/count-any-status?type=${queryParam.type}`).then(function (response) {
            if (response.data) {
                setCountAnyStatus(response.data as ICountStatus)
            }
        })

    }
    const [billHistory, setBillHistory] = useState<BillHistory[]>([]);
    const [bill, setBill] = useState<{ status: Status }>({ status: Status.PLACED });
    const [isLoading, setIsLoading] = useState(true);


    const handleOrderAction = async (isCancel: boolean) => {
        const actionText = isCancel ? 'Hủy đơn hàng' : 'Xác nhận đơn hàng';

        try {
            const response = await fetch('http://localhost:8080/api/v1/history/action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isCancel,
                    billId: billHistory[0]?.id,
                }),
            });

            if (response.ok) {
                message.success(`${actionText} thành công!`);
                // Làm mới lịch sử đơn hàng
                fetchBillHistory();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Thao tác không thành công');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Đã có lỗi xảy ra khi thực hiện thao tác');
        }
    };

    // Fetch bill history
    const fetchBillHistory = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:8080/api/v1/history/timeline/2`);

            // if (!response.ok) {
            //     throw new Error('Không thể tải thông tin đơn hàng');
            // }

            const data = await response.json();

            // Ánh xạ API response sang BillHistory
            const mappedHistory: BillHistory[] = [
                {
                    id: data.id,
                    status: data.status,
                    note: data.note || '',
                    createdDate: data.createdDate,
                    updatedDate: data.updatedDate,
                    account: data.account,
                },
            ];

            setBillHistory(mappedHistory);
            setBill({ status: data.status });
        } catch (error) {
            console.error('Error fetching bill history:', error);
            // message.error('Không thể tải thông tin đơn hàng');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBillHistory();
    }, []);

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    return (
        <>
            <div>
                <h1 className="font-semibold text-xl text-black mb-4 text-transform: uppercase">Đơn mua của tôi</h1>
            </div>

            {/*<div className="container mx-auto p-4">*/}
            {/*    <h1 className="text-2xl font-bold mb-4">Chi Tiết Đơn Hàng</h1>*/}

            {/*    <OrderStatusTimeline*/}
            {/*        billHistory={billHistory}*/}
            {/*        bill={bill}*/}
            {/*        onActionClick={handleOrderAction}*/}
            {/*    />*/}
            {/*</div>*/}

            <div className="py-2">
                <TabList className="flex justify-evenly gap-4 w-full pt-3 pb-1">
                    {
                        statusBills.map((item, index) => (
                            <TabNav key={index}
                                className={`w-full rounded ${queryParam.status === item.value ? 'bg-opacity-80 bg-blue-100 text-indigo-600' : ''}`}
                                value={item.value || 0}>
                                <Badge className="mr-5" content={(countAnyStatus[item.badge as BadgeType] as number)}
                                    maxCount={99} innerClass="bg-red-50 text-red-500">
                                    <button className="p-2 w-auto" onClick={() => setStatusParam(item.value)}>
                                        {item.label}
                                    </button>
                                </Badge>
                            </TabNav>
                        ))
                    }
                </TabList>
            </div>
            <div className="grid grid-cols-1 gap-2 py-2">
                <div>
                    <div className="relative mr-4">
                        <p className={'font-black'}>Tìm kiếm</p>
                        <Input
                            size={'sm'}
                            ref={inputRef}
                            placeholder="Tìm kiếm theo mã đơn hàng"
                            className="lg:w-full"
                            prefix={<HiOutlineSearch className="text-lg" />}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className="py-4 px-2">
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
        </>
    )
}

