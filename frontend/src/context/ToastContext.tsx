import { Notification, toast } from '@/components/ui'
import { ReactNode, createContext, useContext } from 'react'

type ContextType = {
    openNotification: (message: string, title?: string, type?: 'success' | 'warning' | 'danger' | 'info', duration?: number) => void; // Thêm tham số message
};

const ToastContext = createContext<ContextType | undefined>(undefined)

const ToastProvider = ({ children }: { children: ReactNode }) => {
    function openNotification(message: string, title?: string, type?: 'success' | 'warning' | 'danger' | 'info', duration?: number) {
        toast.push(
            <Notification
                closable
                title={title ?? "Thông báo"}
                type={type ?? "success"}
                className={'z-50'}
                duration={duration ?? 2000}
            >
                {message}
            </Notification>
        )
    }

    return (
        <ToastContext.Provider value={{ openNotification }}>
            {children}
        </ToastContext.Provider>
    )
}

export const useToastContext = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToastContext must be used within an OrderProvider')
    }
    return context
}

export default ToastProvider
