import { useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import useThemeClass from '@/utils/hooks/useThemeClass'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table'
import { Link, useNavigate } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import { OrderDTO } from '@/views/manage/statistics/store'
import { HiEye } from 'react-icons/hi'


type LatestOrderProps = {
    data?: OrderDTO[]
    className?: string
}

type OrderColumnPros = {
    row: OrderDTO
}

const { Tr, Td, TBody, THead, Th } = Table

const orderStatusColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    'PENDING': {
        label: 'Chờ xác nhận',
        dotClass: 'bg-yellow-500',
        textClass: 'text-yellow-500'
    },
    'TOSHIP': {
        label: 'Chờ vận chuyển',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500'
    },
    'TORECEIVE': {
        label: 'Đang vận chuyển',
        dotClass: 'bg-green-500',
        textClass: 'text-green-500'
    },
    'DELIVERED': {
        label: 'Đã hoàn thành',
        dotClass: 'bg-purple-500',
        textClass: 'text-purple-500'
    },
    'CANCELED': {
        label: 'Đã hủy đơn',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500'
    }
}

const orderTypeColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    'INSTORE': {
        label: 'Tại quầy',
        dotClass: 'bg-yellow-500',
        textClass: 'text-yellow-500'
    },
    'ONLINE': {
        label: 'Giao hàng',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500'
    }
}

const OrderColumn = ({ row }: OrderColumnPros) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onView = useCallback(() => {
        navigate(`/app/sales/order-details/${row.id}`)
    }, [navigate, row])

    return (
        <span
            className={`cursor-pointer select-none font-semibold hover:${textTheme}`}
            onClick={onView}
        >
            #{row.id}
        </span>
    )
}

const columnHelper = createColumnHelper<OrderDTO>()

const columns = [
    columnHelper.accessor('id', {
        header: 'Đơn hàng',
        cell: (props) => <OrderColumn row={props.row.original} />
    }),
    columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: (props) => {
            const { status } = props.row.original
            return (
                <div className="flex items-center">
                    <Badge className={orderStatusColor[status]?.dotClass} />
                    <span
                        className={`ml-2 rtl:mr-2 capitalize font-semibold ${orderStatusColor[status]?.textClass}`}
                    >
                        {orderStatusColor[status]?.label}
                    </span>
                </div>
            )
        }
    }),
    columnHelper.accessor('type', {
        header: 'Loại',
        cell: (props) => {
            const { type } = props.row.original
            return (
                <div className="flex items-center">
                    <Badge className={orderTypeColor[type].dotClass} />
                    <span
                        className={`ml-2 rtl:mr-2 capitalize font-semibold ${orderTypeColor[type].textClass}`}
                    >
                        {orderTypeColor[type].label}
                    </span>
                </div>
            )
        }
    }),
    columnHelper.accessor('createdDate', {
        header: 'Ngày tạo',
        cell: (props) => {
            const row = props.row.original
            return <span>{row.createdDate}</span>
        }
    }),
    columnHelper.accessor('customerName', {
        header: 'Khách hàng',
        cell: (props) => {
            const row = props.row.original
            return <span>{row.customerName ?? 'Khách lẻ'}</span>
        }
    }),
    columnHelper.accessor('subTotal', {
        header: 'Doanh số',
        cell: (props) => {
            const row = props.row.original
            return (
                <NumericFormat
                    displayType="text"
                    value={(Math.round(row.subTotal * 100) / 100).toFixed(0)}
                    suffix={'đ'}
                    thousandSeparator={true}
                />
            )
        }
    }),
    columnHelper.accessor('total', {
        header: 'Cần TT',
        cell: (props) => {
            const { total } = props.row.original
            return (
                <NumericFormat
                    displayType="text"
                    value={(Math.round(total * 100) / 100).toFixed(0)}
                    suffix={'đ'}
                    thousandSeparator={true}
                />
            )
        }
    }),
    columnHelper.accessor('id', {
        header: 'Hành động',
        cell: (props) => {
            const { id } = props.row.original
            return (
                <Button size="xs" className="w-full flex justify-start items-center" variant="plain">
                    <Link to={`/admin/manage/order/order-details/${id}`}>
                        <HiEye
                            size={20}
                            className="mr-3 text-2xl"
                            style={{ cursor: 'pointer' }}
                        />
                    </Link>
                </Button>
            )
        }
    })
]

const LatestOrder = ({ data = [], className }: LatestOrderProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <Card className={className}>
            <div className="flex items-center justify-between mb-6">
                <h4>Đơn hàng gần đây</h4>
                {/*<Button size="sm">View Orders</Button>*/}
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup, index) => (
                        <Tr key={index}>
                            {headerGroup.headers.map((header, index) => {
                                return (
                                    <Th
                                        key={index}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row, index) => {
                        return (
                            <Tr key={index}>
                                {row.getVisibleCells().map((cell, index) => {
                                    return (
                                        <Td key={index}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
    )
}

export default LatestOrder
