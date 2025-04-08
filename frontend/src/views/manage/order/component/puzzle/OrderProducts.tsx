import { useEffect, useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button, Dialog, Drawer } from '@/components/ui'
import { HiLockClosed, HiMinusCircle, HiPencil, HiPlusCircle, HiViewList } from 'react-icons/hi'
import {
    OrderResponseDTO,
    OrderDetailResponseDTO,
    EOrderStatus
} from '@/@types/order'
import History from './History'
import { ConfirmDialog } from '@/components/shared'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import { FiPackage } from 'react-icons/fi'
import SellProductModal from '@/views/manage/sell/component/dialog/SellProductModal'
import { useOrderContext } from '@/views/manage/order/component/context/OrderContext'
import { useLoadingContext } from '@/context/LoadingContext'
import { DeleteOutline } from '@mui/icons-material'
import IsInStoreOrderFormat from '@/views/util/IsInStoreOrderFormat'
import PriceAmount from '@/views/util/PriceAmount'
import { getFinalPriceInThePart, hasChangeEventPercent, hasChangeUnitPrice } from '@/views/util/OrderUtil'


const OrderProducts = ({ data, selectObject, fetchData, unAllowEditProduct = false }: {
    data: OrderDetailResponseDTO[],
    selectObject: OrderResponseDTO,
    fetchData: () => Promise<void>,
    unAllowEditProduct?: boolean
}) => {
    const { Tr, Th, Td, THead, TBody } = Table

    // FUCTION
    const { openNotification } = useToastContext()
    const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetailResponseDTO>()
    const [isOpenEditQuantity, setIsOpenEditQuantity] = useState<boolean>(false)
    const [endHistoryStatus, setEndHistoryStatus] = useState<EOrderStatus | undefined>()


    const { setIsLoadingComponent } = useLoadingContext()
    const columnHelper = createColumnHelper<OrderDetailResponseDTO>()

    useEffect(() => {
        const historyLength = selectObject.historyResponseDTOS.length
        setEndHistoryStatus(historyLength > 0
            ? selectObject.historyResponseDTOS[historyLength - 1]?.status
            : undefined)
    }, [selectObject])

    const availableQuantityProvide = (item: OrderDetailResponseDTO) => {
        const order_detail_quantity = item.quantity
        const product_detail_quantity = item.productDetailResponseDTO.quantity
        console.log('Y/C: ', order_detail_quantity)
        console.log('KHO: ', product_detail_quantity)
        console.log(data)
        if (selectObject.inStore) {
            console.log('DON TAI QUAY')
            return product_detail_quantity > 0
        } else {
            console.log('DON TRUC TUYEN')
            return product_detail_quantity > order_detail_quantity
        }
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
                <div className={'text-yellow-700'}>
                    {availableQuantityProvide(row) ? '' : `Sản phẩm này hiện không đủ số lượng cung ứng thêm`}
                </div>
            </div>
        )
    }


    const [openDelete, setOpenDelete] = useState(false)
    const [selectedOrderDetailId, setSelectedOrderDetailId] = useState<number>()
    const { sleepLoading } = useLoadingContext()

    const handleCloseDelete = () => {
        console.log('Close')
        setOpenDelete(false)
    }

    const handleConfirmDelete = async () => {
        console.log('Confirm')
        setOpenDelete(false)
        await sleepLoading(300)
        await instance.delete(`/order-details/${selectedOrderDetailId}`).then(function(response) {
            if (response.status === 200) {
                openNotification('Xóa thành công')
            }
            fetchData()
        }).catch(function(err) {
            console.log(err)
            if (err?.response?.status === 400) {
                openNotification(err.response.data.error, 'Thông báo', 'warning', 1500)
            }
        })
    }

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        setIsLoadingComponent(true)
        await instance.get(`/order-details/quantity/update/${id}?quantity=${quantity}`)
            .then(function(response) {
                if (response.status === 200) {
                    openNotification('Thay đổi thành công')
                }
                fetchData()
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
                // fetchData()
            }).finally(function() {
                setIsLoadingComponent(false)
            })
    }


    const onOpenDeleteOrderDetail = (id: number) => {
        setOpenDelete(true)
        setSelectedOrderDetailId(id)
    }

    const ActionColumn = ({ row }: { row: OrderDetailResponseDTO }) => {
        return (
            <div>
                {
                    selectObject.status === 'PENDING' && !unAllowEditProduct && endHistoryStatus === 'PENDING' ? (
                        <div className="flex gap-2">
                            {/*<button><HiPencil size={20}></HiPencil></button>*/}
                            <Button
                                icon={<HiPencil />}
                                variant="plain"
                                onClick={() => {
                                    setSelectedOrderDetail(row)
                                    setIsOpenEditQuantity(true)
                                    document.body.style.overflow = 'hidden'
                                }}
                            ></Button>
                            <button onClick={() => onOpenDeleteOrderDetail(row.id)}><DeleteOutline />
                            </button>
                        </div>
                    ) : (
                        <button><HiLockClosed size={20}></HiLockClosed></button>
                    )
                }

            </div>
        )
    }

    const columns = [
        columnHelper.accessor('productDetailResponseDTO.name', {
            header: 'Sản phẩm',
            cell: (props) => {
                const row = props.row.original
                return <ProductColumn row={row} />
            }
        }),
        columnHelper.accessor('quantity', {
            header: 'Số lượng',
            cell: (props) => {
                return (
                    <div className="flex gap-1 items-center justify-start">
                        {
                            selectObject.status === 'PENDING' && (
                                <button hidden={unAllowEditProduct || endHistoryStatus !== 'PENDING'}
                                        className="p-2 text-xl" onClick={() => {
                                    handleUpdateQuantity(props.row.original.id, props.row.original.quantity + 1)
                                }}><HiPlusCircle /></button>)
                        }
                        <p>{props.row.original.quantity} </p>
                        {
                            selectObject.status === 'PENDING' && (
                                <button hidden={unAllowEditProduct || endHistoryStatus !== 'PENDING'}
                                        className="p-2 text-xl" onClick={() => {
                                    handleUpdateQuantity(props.row.original.id, props.row.original.quantity - 1)
                                }}><HiMinusCircle /></button>)
                        }

                    </div>
                )
            }
        }),
        columnHelper.accessor('productDetailResponseDTO.quantity', {
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
        }),
        columnHelper.accessor('productDetailResponseDTO.price', {
            header: 'Giá hiện tại',
            cell: (props) => {
                const row = props.row.original
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
        }),
        columnHelper.accessor('unitPrice', {
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
        }),
        columnHelper.accessor('productDetailResponseDTO', {
            header: 'Tổng',
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className={'flex gap-3 text-red-600'}>
                        <PriceAmount amount={row.quantity * row.unitPrice} />
                    </div>
                )
            }
        }),
        columnHelper.accessor('productDetailResponseDTO.id', {
            header: 'Hành động',
            cell: (props) => {
                const row = props.row.original
                return <ActionColumn row={row} />
            }
        })
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false)


    const handleCloseOverride = () => {
        console.log('Close')
        setIsOpenOverrideConfirm(false)
    }

    const handleConfirmOverride = async () => {
        console.log('Confirm')
        setIsOpenOverrideConfirm(false)
        console.log(selectedOrderRequestContext)
        await instance.post('/order-details', selectedOrderRequestContext).then(function() {
            fetchData()
        })
    }

    const { isOpenOverrideConfirm, setIsOpenOverrideConfirm, selectedOrderRequestContext } = useOrderContext()


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
        <div
            className={`h-full`}>
            <ConfirmDialog
                isOpen={openDelete}
                type={'danger'}
                title={'Xóa'}
                confirmButtonColor={'red-600'}
                onClose={handleCloseDelete}
                onRequestClose={handleCloseDelete}
                onCancel={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>Xác nhận muốn xóa ?</p>
            </ConfirmDialog>
            <ConfirmDialog
                isOpen={isOpenOverrideConfirm}
                type={'warning'}
                title={'Xác nhận tạo bản ghi mới ?'}
                confirmButtonColor={'red-600'}
                onClose={handleCloseOverride}
                onRequestClose={handleCloseOverride}
                onCancel={handleCloseOverride}
                onConfirm={handleConfirmOverride}
            >
                <p>Vui lòng xác nhận</p>
            </ConfirmDialog>
            {/*  */}
            {isOpenProductModal && <SellProductModal fetchData={fetchData} setIsOpenProductModal={setIsOpenProductModal}
                                                     selectOrder={selectObject}></SellProductModal>}
            {/*  */}
            <div className="">
                <Drawer
                    title="Lịch sử"
                    isOpen={isOpen}
                    width={600}
                    onClose={() => onDrawerClose()}
                    onRequestClose={() => onDrawerClose()}
                >
                    <History selectObject={selectObject}></History>
                </Drawer>
            </div>
            <AdaptableCard className="mb-4 h-full">
                <div className={'flex justify-between'}>
                    <div className={'!text-xl'}>
                        <IsInStoreOrderFormat status={selectObject.inStore} />
                    </div>
                    <div className="flex justify-end items-center pb-4 gap-2">
                        <Button block variant="default" size="sm" className="bg-indigo-500 !w-auto"
                                icon={<HiViewList />} onClick={() => openDrawer()}>
                            Xem lịch sử
                        </Button>
                        {
                            selectObject.status === 'PENDING' && (
                                <Button block variant="solid" size="sm" className="bg-indigo-500 !w-36"
                                        icon={<HiPlusCircle />}
                                        hidden={selectObject.status !== 'PENDING' || endHistoryStatus === 'REQUESTED'}
                                        onClick={() => setIsOpenProductModal(true)}>
                                    Thêm sản phẩm
                                </Button>
                            )
                        }
                    </div>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    <Table>
                        <THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <Th
                                                key={header.id}
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
                            {table.getRowModel().rows.map((row) => {
                                return (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <Td key={cell.id}>
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
                </div>
            </AdaptableCard>
            <EditQuantityDialog />

        </div>
    )
}

export default OrderProducts


