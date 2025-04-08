import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import { Loading } from '@/components/shared'
import instance from '@/axios/CustomAxios'

type OrderRequestDTOCONTEXT = {
    quantity?: number | undefined;
    orderId: number;
    productDetailId?: number | undefined;
};

type AppContextType = {
    selectedOrderRequestContext: OrderRequestDTOCONTEXT | null;
    setSelectedOrderRequestContext: React.Dispatch<React.SetStateAction<OrderRequestDTOCONTEXT | null>>;
    isAllowOverrideOrderDetail: boolean;
    setIsAllowOverrideOrderDetail: React.Dispatch<React.SetStateAction<boolean>>;
    isOpenOverrideConfirm: boolean;
    setIsOpenOverrideConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    sleep: (ms: number) => Promise<void>;
    checkAllowOverride: (data: any) => Promise<boolean>;
};

// Create the OrderContext with the default values
const OrderContext = createContext<AppContextType>({
    selectedOrderRequestContext: null,
    setSelectedOrderRequestContext: () => {
    },
    isAllowOverrideOrderDetail: false,
    setIsAllowOverrideOrderDetail: () => {
    },
    isOpenOverrideConfirm: false,
    setIsOpenOverrideConfirm: () => {
    },
    sleep: async () => {
    },
    checkAllowOverride: async () => false
})

const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [isOpenOverrideConfirm, setIsOpenOverrideConfirm] = useState<boolean>(false)
    const [isAllowOverrideOrderDetail, setIsAllowOverrideOrderDetail] = useState<boolean>(false)
    const [selectedOrderRequestContext, setSelectedOrderRequestContext] =
        useState<OrderRequestDTOCONTEXT | null>(null)

    // Sleep utility function
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

    // Function to check if override is allowed
    const checkAllowOverride = async (data: any): Promise<boolean> => {
        try {
            const response = await instance.post('/order-details/allowOverride', data)
            console.log(response.data) // Xử lý log
            return response.data?.hasChange ?? false // Đảm bảo giá trị trả về hợp lệ
        } catch (error) {
            console.error('Error checking override permission:', error)
            return false
        }
    }

    useEffect(() => {
        console.log('isOpenOverrideConfirm:', isOpenOverrideConfirm)
    }, [isOpenOverrideConfirm])

    return (
        <OrderContext.Provider
            value={{
                selectedOrderRequestContext,
                setSelectedOrderRequestContext,
                isAllowOverrideOrderDetail,
                setIsAllowOverrideOrderDetail,
                isOpenOverrideConfirm,
                setIsOpenOverrideConfirm,
                sleep,
                checkAllowOverride
            }}
        >
            <Loading loading={isOpenOverrideConfirm} type="cover">
                {children}
            </Loading>
        </OrderContext.Provider>
    )
}

// Custom hook to use OrderContext
export const useOrderContext = () => useContext(OrderContext)

export default OrderProvider
