import Tabs from '@/components/ui/Tabs'
import { HiOutlineUser, HiPlusCircle } from 'react-icons/hi'

import React, { useEffect, useState } from 'react'
import { Badge, Button, Notification, toast } from '@/components/ui'
import { DoubleSidedImage, Loading } from '@/components/shared'
import { useToastContext } from '@/context/ToastContext'
import CloseButton from '@/components/ui/CloseButton'
import instance from '@/axios/CustomAxios'
import { OrderResponseDTO } from '@/@types/order'
import { useLoadingContext } from '@/context/LoadingContext'
import { useSellContext } from '../context/SellContext'

const { TabNav, TabList, TabContent } = Tabs

type QuantityInOrder = {
    id: number,
    code: string,
    quantity: number
}

const SellTab = () => {
    const [currentTab, setCurrentTab] = useState('')
    const { tabs, createTab, removeTabAndCancel } = useSellContext()
    const [loading, setLoading] = useState<boolean>(false)
    const { openNotification } = useToastContext()
    const [quantityInOrder, setQuantityInOrder] = useState<QuantityInOrder[]>([])
    const { isLoadingComponent } = useLoadingContext()

    const closeNotification = (key: string | Promise<string>) => {
        if (typeof key !== 'string') {
            key.then((resolvedValue) => {
                toast.remove(resolvedValue)
            })
        } else {
            toast.remove(key)
        }
    }

    const openDeleteConfirm = async (orderId: number) => {
        const notificationKey = toast.push(
            <Notification title="Thông báo" duration={8000}>
                <div>
                    Số lượng trong kho sẽ được hoàn lại
                    Vui lòng xác nhận hủy hóa đơn này?
                </div>
                <div className="text-right mt-3">
                    <Button
                        size="sm"
                        variant="solid"
                        className="mr-2 bg-red-600"
                        onClick={async () => {
                            closeNotification(notificationKey as string | Promise<string>)
                            removeTabAndCancel(orderId)
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

    useEffect(() => {
        if (tabs.length > 0) {
            setCurrentTab(tabs[tabs.length - 1].value)
        }
    }, [tabs])

    useEffect(() => {
        reloadQuantityInOrder()
    }, [currentTab, tabs, isLoadingComponent])

    const reloadQuantityInOrder = async () => {
        const ids = tabs.map((s) => s.orderId)
        await instance.get(`/orders/count-order-detail?ids=${ids}`).then(function(response) {
            setQuantityInOrder(response.data)
        })
    }

    const handleCreateNewOrder = async (): Promise<OrderResponseDTO> => {
        const data = {
            'name': 'Hoa Don',
            'address': '',
            'phone': '',
            'deleted': false,
            'total': 0,
            'subTotal': 0,
            'voucher': null,
            'type': 'INSTORE'
        }

        try {
            const response = await instance.post('/orders', data)
            return response.data
        } catch (error) {
            console.error('Error creating new order:', error)
            throw error
        }
    }

    const handleAddNewTab = async () => {
        const newOrder = await handleCreateNewOrder()
        if (tabs.length >= 10) {
            openNotification('Bạn không thể tạo quá 5 đơn hàng.', "Thông báo", "warning")
            return
        } else {
            createTab(newOrder.id)
        }
    }


    useEffect(() => {
        console.log('Current Tab: ', currentTab)
    }, [currentTab])

    return (
        <div>
            <Loading loading={loading} type="cover">
                <div className="flex justify-between">
                    <div>
                        <h1 className="font-semibold text-xl text-black text-transform: uppercase">Quản lý bán hàng</h1>
                    </div>
                    <div>
                        <Button
                            variant="default"
                            icon={<HiPlusCircle />}
                            onClick={handleAddNewTab}>
                            Tạo đơn hàng mới
                        </Button>
                    </div>
                </div>
                {
                    tabs.length > 0 ? (
                        <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
                            <TabList className="flex justify-between py-2">
                                <div className="flex">
                                    {tabs.map((tab) => (
                                        <div key={tab.value} className="flex items-center justify-center gap-1">
                                            <Badge
                                                className="mr-1"
                                                content={Array.isArray(quantityInOrder) && quantityInOrder.find((s) => s.id === tab.orderId)?.quantity}
                                                // maxCount={tab.orderId}
                                                innerClass="bg-red-50 text-red-500">
                                                <TabNav
                                                    value={tab.value}
                                                    icon={<HiOutlineUser />}
                                                    className={`${currentTab === tab.value ? 'text-[15px]' : ''} !p-1`}
                                                >
                                                    {tab.label} - HD{tab.orderId}
                                                </TabNav>
                                            </Badge>
                                            <CloseButton
                                                className="text-gray-800 text-[18px] hover:text-red-500 transition-all duration-500"
                                                onClick={() => openDeleteConfirm(tab.orderId)}
                                            />
                                            <div>
                                                <p>
                                                    {
                                                        ' | '
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabList>
                            <div className="py-1">
                                {tabs.map((tab, index) => (
                                    <TabContent key={index} value={tab.value}>
                                        {tab.content}
                                    </TabContent>
                                ))}
                            </div>
                        </Tabs>
                    ) : (
                        <NoHaveAnyTab />
                    )
                }
            </Loading>
        </div>
    )
}

const NoHaveAnyTab = () => {
    return (
        <div className="h-[760px] flex justify-center items-center">
            <div className="flex justify-center items-center flex-col">
                <DoubleSidedImage
                    src="/img/others/image-removebg-preview-order-empty.png"
                    darkModeSrc="/img/others/image-removebg-preview-order-empty.png"
                    alt="No user found!"
                />
                <div className="py-3 font-semibold">
                    <p className="text-xl">Không có bất kì đơn hàng nào !!!</p>
                </div>
            </div>
        </div>
    )
}

export default SellTab
