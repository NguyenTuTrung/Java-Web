import { Fragment, useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, Button, Dialog, Notification, toast } from '@/components/ui'
import { HiLockClosed, HiMinusCircle, HiPencil, HiPlusCircle } from 'react-icons/hi'
import { OrderDetailResponseDTO, OrderResponseDTO } from '@/@types/order'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import DataTable, { type OnSortParam } from '../../../../../components/shared/DataTable'
import { FiPackage } from 'react-icons/fi'
import { DeleteOutline } from '@mui/icons-material'
import { useWSContext } from '@/context/WsContext'
import PriceAmount from '@/views/util/PriceAmount'
import { getFinalPriceInThePart, hasChangeEventPercent, hasChangeUnitPrice } from '@/views/util/OrderUtil'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

const SellProductTable = ({ selectedOrder, fetchData }: {
    selectedOrder: OrderResponseDTO,
    fetchData: () => Promise<void>
}) => {
    const { signalReloadTableProduct, setSelectedOrderInStoreCode } = useWSContext()
    const [isOpenEditQuantity, setIsOpenEditQuantity] = useState<boolean>(false)
    const [data, setData] = useState<OrderDetailResponseDTO[]>([])
    const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetailResponseDTO>()
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
        pageSize: 5,
        query: '',
        sort: {
            order: '',
            key: ''
        }
    })
    const { openNotification } = useToastContext()

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        await instance.get(`/order-details/quantity/update/${id}?quantity=${quantity}`)
            .then(function(response) {
                if (response.status === 200) {
                    openNotification('Thay đổi thành công')
                    fetchData()
                }
            })
            .catch(function(err) {
                console.error('Error updating quantity:', err)
                if (err.response) {
                    console.log('Status code:', err.response.status) // Trạng thái HTTP từ phản hồi
                    if (err.response.status === 400) {
                        openNotification(err.response.data.error, 'Thông báo', 'warning', 1500)
                    }
                } else {
                    console.log('Error message:', err.message) // Nếu không có phản hồi từ máy chủ
                }
                fetchData()
            })
    }

    const getAllOrderDetailWithIdOrder = async (id: number) => {
        instance.get(`/order-details/get-by-order/${id}?page=${tableData.pageIndex - 1}&size=${tableData.pageSize}`).then(function(response) {
            setData(response.data.content)
            setTableData((prevData) => ({
                ...prevData,
                ...{
                    total: response.data.totalElements
                }
            }))
        })

    }
    const fetchOrderData = async () => {
        if (selectedOrder && selectedOrder.id) {
            console.log('Thay đổi selectedOrder')
            setSelectedOrderInStoreCode(selectedOrder.code)
            await getAllOrderDetailWithIdOrder(selectedOrder.id)
        }
    }

    useEffect(() => {
        fetchOrderData()
    }, [selectedOrder, tableData.pageSize, tableData.pageIndex, signalReloadTableProduct])


    const columns = useMemo<ColumnDef<OrderDetailResponseDTO>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Sản phẩm',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return <ProductColumn row={row} />
                }
            },
            {
                accessorKey: 'quantity',
                header: 'Số lượng',
                cell: (props) => {
                    return (
                        <div className="flex gap-1 items-center justify-start">
                            {
                                (<button className="p-2 text-xl" hidden={selectedOrder.status !== 'PENDING'}
                                         onClick={() => {
                                             handleUpdateQuantity(props.row.original.id, props.row.original.quantity + 1)
                                         }}><HiPlusCircle /></button>)
                            }

                            <label>{props.row.original.quantity} </label>
                            {
                                (<button className="p-2 text-xl" hidden={selectedOrder.status !== 'PENDING'}
                                         onClick={() => {
                                             handleUpdateQuantity(props.row.original.id, props.row.original.quantity - 1)
                                         }}><HiMinusCircle /></button>)
                            }

                        </div>
                    )
                }
            },
            {
                header: 'Kho',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div
                            className={`${row.productDetailResponseDTO.quantity >= props.row.original.quantity ? 'text-green-600' : 'text-red-600'} `}>
                            <p>{row.productDetailResponseDTO.quantity}</p>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'price',
                header: 'Giá Hiện tại',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return (
                        <div>
                            {
                                row.averageDiscountEventPercent ? (
                                        <div className={'flex gap-2 flex-col'}>
                                            <PriceAmount
                                                className={'text-gray-900 line-through'}
                                                amount={row.productDetailResponseDTO.price}
                                            />
                                            <PriceAmount
                                                className={'text-red-400'}
                                                amount={getFinalPriceInThePart(row)}
                                            />
                                        </div>
                                    ) :
                                    (
                                        <div>
                                            <PriceAmount
                                                className={'text-red-400'}
                                                amount={getFinalPriceInThePart(row)}
                                            />
                                        </div>
                                    )
                            }
                        </div>
                    )
                }
            },
            {
                accessorKey: 'unitPrice',
                header: 'Giá được tính',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return (
                        <div>
                            <div>
                                <PriceAmount
                                    className={'text-red-600'}
                                    amount={row.unitPrice}
                                />
                            </div>
                        </div>
                    )
                }
            },
            {
                // accessorKey: 'price',
                header: 'Tổng',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return <PriceAmount
                        className={'text-red-600'}
                        amount={row.quantity * row.unitPrice}
                    />
                }
            },
            {
                // accessorKey: 'price',
                header: 'Hành động',
                cell: (props) => {
                    const row = props.row.original as OrderDetailResponseDTO
                    return (
                        <div className={'flex gap-4'}>
                            {
                                selectedOrder.status === 'PENDING' ?
                                    (
                                        <Fragment>
                                            <Button
                                                icon={<HiPencil />}
                                                variant="plain"
                                                onClick={() => {
                                                    setSelectedOrderDetail(row)
                                                    setIsOpenEditQuantity(true)
                                                    document.body.style.overflow = 'hidden'
                                                }}
                                            ></Button>
                                            <Button
                                                icon={<DeleteOutline />}
                                                variant="plain"
                                                onClick={() => openDeleteConfirm(row.id)}
                                            ></Button>
                                        </Fragment>
                                    ) :
                                    (
                                        <Button
                                            icon={<HiLockClosed />}
                                            variant="plain"
                                        ></Button>
                                    )
                            }
                        </div>
                    )
                }
            }
        ],
        []
    )


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

    const availableQuantityProvide = (item: OrderDetailResponseDTO) => {
        const product_detail_quantity = item.productDetailResponseDTO.quantity
        return product_detail_quantity > 0
    }

    const ProductColumn = ({ row }: { row: OrderDetailResponseDTO }) => {
        return (
            <div>
                <div className="flex gap-3">
                    <div className={'relative'}>
                        {
                            Array.isArray(row.productDetailResponseDTO.images) && row.productDetailResponseDTO.images.length > 0 ?
                                (
                                    <Avatar
                                        size={100}
                                        src={row.productDetailResponseDTO.images[0].url}
                                    />
                                )
                                : (
                                    <Avatar size={100} icon={<FiPackage />} />
                                )
                        }
                        {
                            row?.averageDiscountEventPercent ? (
                                <div
                                    className={'absolute -top-2 -right-2 text-white p-[2px] bg-red-600 text-[12px] border border-black'}>
                                    {
                                        <p>-{row.averageDiscountEventPercent}%</p>
                                    }
                                </div>
                            ) : (<div></div>)
                        }

                    </div>
                    <div className="ltr:ml-2 rtl:mr-2">
                        <h6 className="mb-2">
                            ({row.productDetailResponseDTO?.product.name})
                            {row.productDetailResponseDTO?.name}</h6>
                        <div className="mb-1">
                            <span className="capitalize">Mã SCPT: </span>
                            <span className="font-semibold">{row.productDetailResponseDTO?.code}</span>
                        </div>
                        <div className="mb-1">
                            <span className="capitalize">Kích cỡ: </span>
                            <span className="font-semibold">{row.productDetailResponseDTO?.size.name}</span>
                        </div>
                        <div className="mb-1">
                            <span className="capitalize">Màu sắc: </span>
                            <span className="font-semibold">{row.productDetailResponseDTO?.color.name}</span>
                        </div>
                    </div>
                </div>
                <div className={'text-orange-700 flex flex-col'}>
                    <p>
                        {hasChangeEventPercent(row) ? '' : `Có sự thay đổi về khuyễn mãi sự kiện hiện tại là ${row.productDetailResponseDTO.product.nowAverageDiscountPercentEvent}%`}

                    </p>
                    <p>
                        {hasChangeUnitPrice(row) ? '' : `Có sự thay đổi về giá hiện tại là ${getFinalPriceInThePart(row).toLocaleString('vi')}₫ - ${row.unitPrice.toLocaleString('vi')}₫`}
                    </p>
                </div>
                <div className={'text-orange-700'}>
                    {availableQuantityProvide(row) ? '' : `Sản phẩm này hiện không đủ số lượng cung ứng thêm`}
                </div>
            </div>
        )
    }

    const closeNotification = (key: string | Promise<string>) => {
        if (typeof key !== 'string') {
            key.then((resolvedValue) => {
                toast.remove(resolvedValue)
            })
        } else {
            toast.remove(key)
        }
    }

    const openDeleteConfirm = async (idOrderDetail: number) => {
        const notificationKey = toast.push(
            <Notification title="Thông báo" duration={8000}>
                <div>
                    Xác nhận xóa sản phẩm này khỏi giỏ hàng ?
                </div>
                <div className="text-right mt-3">
                    <Button
                        size="sm"
                        variant="solid"
                        className="mr-2 bg-red-600"
                        onClick={async () => {
                            closeNotification(notificationKey as string | Promise<string>)
                            const response = await instance.delete(`/order-details/${idOrderDetail}`)
                            if (response.status === 200) {
                                console.log('response', response)
                                await fetchData()
                                await getAllOrderDetailWithIdOrder(selectedOrder.id)
                            }
                        }}
                    >
                        Xác nhận
                    </Button>
                    <Button
                        size="sm"
                        onClick={() =>
                            closeNotification(notificationKey as string | Promise<string>)
                        }
                    >
                        Hủy
                    </Button>
                </div>
            </Notification>
        )
    }

    const EditQuantityDialog = () => {
        const initialValues = {
            quantity: selectedOrderDetail?.quantity || 1
        }

        const validationSchema = Yup.object({
            quantity: Yup.number()
                .typeError('Số lượng phải là số')
                .positive('Số lượng phải lớn hơn 0')
                .integer('Số lượng phải là số nguyên')
                .required('Vui lòng nhập số lượng')
        })

        const onSubmit = (values: { quantity: number }) => {
            console.log('OK')
            selectedOrderDetail && handleUpdateQuantity(selectedOrderDetail?.id, values.quantity)
            onClose()
        }

        const onClose = () => {
            setIsOpenEditQuantity(false)
            document.body.style.overflow = 'auto'
        }
        return (
            <Dialog isOpen={isOpenEditQuantity} closable={false}>
                <h5 className="mb-4">Thay đổi số lượng</h5>
                <p>Vui lòng nhập số lượng mong muốn:</p>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <Field
                                name="quantity"
                                type="number"
                                min={1}
                                className="w-full px-3 py-2 border rounded"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = e.target.value
                                    if (/^\d*$/.test(value)) {
                                        setFieldValue('quantity', value ? Math.max(Number(value), 1) : '')
                                    }
                                }}
                            />
                            <ErrorMessage
                                name="quantity"
                                component="p"
                                className="text-red-500 mt-2"
                            />
                            <div className="text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    onClick={onClose}
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" variant="solid">
                                    Xác nhận
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        )
    }

    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
                pagingData={tableData}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <EditQuantityDialog />
        </div>
    )
}

export default SellProductTable

