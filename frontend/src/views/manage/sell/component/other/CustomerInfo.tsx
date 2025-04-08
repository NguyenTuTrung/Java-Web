import { IconText } from '@/components/shared'
import { Avatar, Button, Card, Input, Notification, Radio, toast, Tooltip } from '@/components/ui'
import AddressModal from '@/views/manage/order/component/puzzle/AddressModal'
import { OrderAddressResponseDTOS, OrderResponseDTO } from '@/@types/order'
import { SetStateAction, useEffect, useState } from 'react'
import { HiArrowsExpand, HiMail, HiOutlineBackspace, HiPencilAlt, HiPhone, HiPlusCircle } from 'react-icons/hi'
import { updateOrder } from '@/services/OrderService'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'
import CreateNewCustomerModal from '@/views/manage/sell/component/dialog/CreateNewCustomerModal'

const CustomerInfo = ({ data, fetchSelectedOrder, setIsOpenCustomerModal }: {
    data: OrderResponseDTO,
    fetchSelectedOrder: () => Promise<void>
    setIsOpenCustomerModal: React.Dispatch<SetStateAction<boolean>>
}) => {
    const [isOpenEditAddress, setIsOpenEditAddress] = useState(false)
    const [isOpenCreateCustomerModal, setIsOpenCreateCustomerModal] = useState<boolean>(false)

    // Đặt giá trị mặc định của isShipping là false để "Tại quầy" được chọn
    const [isShipping, setIsShipping] = useState<boolean>(true)
    const customer = data?.customerResponseDTO || {}
    const addresses = customer.addressResponseDTOS || []
    const { openNotification } = useToastContext()

    useEffect(() => {
        const typeLocal = data.type
        if (typeLocal === 'ONLINE') {
            setIsShipping(true)
        } else {
            setIsShipping(false)
        }
    }, [data])

    useEffect(() => {
        console.log('isShipping: ', isShipping)
    }, [isShipping])

    const onChangeMethod = async (val: boolean) => {
        setIsShipping(val)
        const response = await updateOrder(data.id, { 'type': val ? 'ONLINE' : 'INSTORE' })
        await fetchSelectedOrder()
        console.log(response)
    }

    const handleChangeAddress = async (val: OrderAddressResponseDTOS) => {
        console.log(val)
        const payload = {
            'provinceId': val.provinceId,
            'provinceName': val.province,
            'districtId': val.districtId,
            'districtName': val.district,
            'wardId': val.wardId,
            'wardName': val.ward,
            'address': val.detail,
            'recipientName': val.name,
            'phone': val.phone
        }
        await instance.put(`/orders/${data.id}`, payload).then(function(response) {
            console.log(response)
            fetchSelectedOrder()
        }).catch(function(err){
            console.log("Errorsss")
            console.log(err)
            if (err?.response?.status === 400) {
                openNotification(err.response.data.error, 'Thông báo', 'warning', 1500)
            }
        })
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

    const openUnLinkCustomerConfirm = async (orderId: number) => {
        const notificationKey = toast.push(
            <Notification title="Xác nhận bỏ gán cho khách hàng cho đơn?" duration={15000}>
                <p className={'text-black py-1 '}>Các phiếu giảm giá cá nhân đang dùng có thể sẽ được gỡ bỏ</p>
                <div className="text-right mt-3">
                    <Button
                        size="sm"
                        variant="solid"
                        className="mr-2 bg-red-600"
                        onClick={async () => {
                            closeNotification(notificationKey as string | Promise<string>)
                            await instance.get(`orders/unlink-customer/${orderId}`).then(function(response) {
                                if (response.status === 200) {
                                    fetchSelectedOrder()
                                    openNotification('Bỏ gán thành công')
                                }
                            }).catch(function(error) {
                                if (error?.response?.data?.error) {
                                    openNotification(error?.response?.data?.error, 'Thông báo', 'danger', 5000)
                                }
                            })

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

    return (
        <Card
            className={`mb-5`}>
            {isOpenEditAddress && <AddressModal
                selectedOrder={data}
                fetchData={fetchSelectedOrder}
                onCloseModal={setIsOpenEditAddress}
            />}

            <div className={'flex justify-between'}>
                <h5 className="mb-4">
                    Khách hàng #{customer.code || 'Khách lẻ'}
                </h5>
                <div className={'flex gap-2'}>
                    <div>
                        <Button
                            size="sm"
                            variant="default"
                            icon={<HiArrowsExpand />}
                            hidden={data.status !== 'PENDING'}
                            onClick={() => setIsOpenCustomerModal(true)}
                        >Chọn
                        </Button>
                    </div>
                    <div>
                        <Button
                            size="sm"
                            variant="solid"
                            icon={<HiPlusCircle />}
                            hidden={data.status !== 'PENDING'}
                            onClick={() => setIsOpenCreateCustomerModal(true)}
                        >Thêm mới</Button>
                    </div>
                </div>

            </div>

            {
                isOpenCreateCustomerModal && (
                    <CreateNewCustomerModal
                        selectedOrder={data}
                        fetchSelectedOrder={fetchSelectedOrder}
                        setIsOpenCreateCustomerModal={setIsOpenCreateCustomerModal}
                    />
                )
            }

            <div className="group flex items-center justify-between">
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        src={'https://th.bing.com/th/id/OIP.QypR4Rt5VeZ3Po2g8HQ2_QAAAA?rs=1&pid=ImgDetMain'}
                    />
                    <div className="ltr:ml-2 rtl:mr-2">
                        <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {customer.email || 'Khách lẻ'}
                        </div>
                    </div>
                </div>
                {
                    data?.customerResponseDTO && (
                        <div hidden={data.status !== 'PENDING'}>
                            <Tooltip title={'Hủy gán'} className={'text-black'} >
                                <Button
                                    variant={'plain'}
                                    icon={<HiOutlineBackspace size={25} />}
                                    onClick={() => openUnLinkCustomerConfirm(data?.id)}
                                />
                            </Tooltip>
                        </div>
                    )
                }
            </div>
            <hr className="my-5" />
            {
                customer.code && (
                    <div>
                        <IconText className="mb-4" icon={<HiMail className="text-xl opacity-70" />}>
                            <span className="font-semibold">{customer.email || ''}</span>
                        </IconText>

                        <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                            <span className="font-semibold">{customer.phone || ''}</span>
                        </IconText>

                    </div>
                )
            }
            <hr className="my-5" />
            <div>
                <div className="flex justify-between items-center">
                    <div>
                        <h6 className="mb-4">Hình thức nhận hàng</h6>
                    </div>
                    <div className="text-black">
                        <div className="font-semibold">
                            {/* Sử dụng onChange để xử lý sự kiện */}
                            <Radio.Group value={isShipping} onChange={onChangeMethod}>
                                <Radio value={true}>Giao hàng</Radio>
                                <Radio value={false}>Tại quầy</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </div>
                <div
                    className={`${!isShipping ? (customer.code ? 'max-h-[0px]' : 'max-h-[0px]') : 'max-h-[600px]'} overflow-hidden duration-700 transition-all  font-semibold text-gray-500`}
                >
                    <Card>
                        <address className="not-italic my-2">
                            <div className={'flex flex-col gap-3 text-sm pb-4'}>
                                <div>
                                    + Tên người nhận: {data?.recipientName || '....'}
                                </div>
                                <div>
                                    + Số điện thoại nhận: {data?.phone || '....'}
                                </div>

                            </div>
                            <Input
                                disabled
                                value={
                                    (data?.address + ', ' + (data?.wardName || '') + ', ' + (data?.districtName || '') + ', ' + (data?.provinceName || ''))
                                }
                                suffix={
                                    <Tooltip title="Chỉnh sửa" className={'text-black'}>
                                        <HiPencilAlt
                                            className="text-lg cursor-pointer ml-1"
                                            onClick={() => setIsOpenEditAddress(true)}
                                        />
                                    </Tooltip>
                                }
                            />
                        </address>
                        <Radio.Group vertical className={'text-sm w-full'}>
                            {addresses.length ? (
                                addresses.map((item, index) => (
                                    <Radio key={index} value={item.id}
                                           className={'border px-2 py-2 !w-full rounded border-dashed'}
                                           onClick={() => handleChangeAddress(item)}>
                                        <div className={'ml-2 font-normal'}>
                                            <div>KH: {item.name} - SDT: {item.phone}</div>
                                            <div>D/C: {item.detail}, {item.ward}, {item.district}, {item.province}</div>
                                        </div>
                                    </Radio>
                                ))
                            ) : (
                                <div className="flex justify-start items-center">
                                    <p className="py-2">Không có bất kỳ địa chỉ nào khác</p>
                                </div>
                            )}
                        </Radio.Group>
                    </Card>
                </div>

            </div>
        </Card>
    )
}

export default CustomerInfo
