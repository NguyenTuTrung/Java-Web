import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import TabCard from '../component/card/TabCard'
import instance from '@/axios/CustomAxios'
import { changeOrderStatus } from '@/services/OrderService'
import { EOrderStatusEnums, OrderHistoryResponseDTO } from '@/@types/order'
import { useToastContext } from '@/context/ToastContext'

type TabObject = {
    orderId: number,
    label: string,
    value: string,
    content: ReactNode
}

type AppContextType = {
    tabs: TabObject[];
    setTabs: React.Dispatch<React.SetStateAction<TabObject[]>>;
    createTab: (orderId: number) => void;
    removeTab: (orderId: number) => void;
    removeTabAndCancel: (orderId: number) => void;
    addTabByOrderId: (orderId: number) => void;
};


const SellContext = createContext<AppContextType>({
    tabs: [],
    setTabs: () => {
    },
    createTab: () => {
    },
    removeTab: () => {
    },
    removeTabAndCancel: () => {
    },
    addTabByOrderId: () => {
    }
})

const SellProvider = ({ children }: { children: ReactNode }) => {
    const [tabs, setTabs] = useState<TabObject[]>([])
    const { openNotification } = useToastContext()

    useEffect(() => {
        setTabs(getTabsFromLocalStorage())
    }, [])

    const addTabByOrderId = (id: number) => {
        let savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        savedIds = savedIds.filter((savedId: number) => savedId !== id)
        savedIds.push(id)
        localStorage.setItem("orderIds", JSON.stringify(savedIds))
        console.log(savedIds)
        window.location.href = "/admin/manage/sell"
    }


    const getTabsFromLocalStorage = () => {
        const savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        let listTab: TabObject[] = []
        listTab = savedIds.map((id: number, index: number) => ({
            value: `tab${index + 1}`,
            label: `Đơn hàng ${index + 1}`,
            orderId: id,
            content: <TabCard idOrder={id} />
        }))
        console.log('TABS: ', listTab)
        return listTab
    }

    const createTab = (orderId: number) => {
        const savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        if (!savedIds.includes(orderId)) {
            savedIds.push(orderId)
            localStorage.setItem('orderIds', JSON.stringify(savedIds))
            setTabs(getTabsFromLocalStorage())
        }
    }

    const removeTabAndCancel = async (orderId: number) => {
        let savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        if (savedIds.includes(orderId)) {
            const data: OrderHistoryResponseDTO = {
                id: orderId,
                status: EOrderStatusEnums.CANCELED,
                note: 'Hủy tại quầy'
            }
            await instance.put(`/orders/status/change/${orderId}`, data).then(function(response) {
                console.log(response)
                if (response.status === 200) {
                    savedIds = savedIds.filter((s: number) => s !== orderId)
                    localStorage.setItem('orderIds', JSON.stringify(savedIds))
                    setTabs(getTabsFromLocalStorage())
                }
            }).catch(function(error) {
                if (error?.response?.data?.error === "Đơn hàng đã bị hủy trước đó") {
                    openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
                }
            }).finally(function(){
                removeTab(orderId)
            })

        }
    }

    const removeTab = async (orderId: number) => {
        let savedIds = JSON.parse(localStorage.getItem('orderIds') || '[]')
        if (savedIds.includes(orderId)) {
            savedIds = savedIds.filter((s: number) => s !== orderId)
            localStorage.setItem('orderIds', JSON.stringify(savedIds))
            setTabs(getTabsFromLocalStorage())
        }
    }


    return (
        <SellContext.Provider value={{ tabs, setTabs, createTab, removeTab, removeTabAndCancel, addTabByOrderId }}>
            {children}
        </SellContext.Provider>
    )
}

export const useSellContext = () => useContext(SellContext)

export default SellProvider
