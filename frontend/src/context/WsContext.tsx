import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useToastContext } from '@/context/ToastContext'
import { Client, Message } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

type AppContextType = {
    signalReloadTableProduct: boolean,
    countOrder: number;
    setCountOrder: React.Dispatch<React.SetStateAction<number>>;
    callHaveNewOrder: () => void;
    selectedOrderInStoreCode: string;
    setSelectedOrderInStoreCode: React.Dispatch<React.SetStateAction<string>>;

};

const WsContext = createContext<AppContextType>({
    signalReloadTableProduct: false,
    countOrder: 0,
    setCountOrder: () => {
    },
    callHaveNewOrder: () => {
    }, // Default empty function
    selectedOrderInStoreCode: '',
    setSelectedOrderInStoreCode: () => {
    }
})

const WsProvider = ({ children }: { children: ReactNode }) => {
    const clientRef = useRef<Client | null>(null)
    const [countOrder, setCountOrder] = useState<number>(0)
    const [selectedOrderInStoreCode, setSelectedOrderInStoreCode] = useState<string>('')
    const [signalReloadTableProduct, setSignalReloadTableProduct] = useState<boolean>(false)
    const { openNotification } = useToastContext()

    useEffect(() => {
        if (clientRef.current) {
            console.log('Publishing new order message')
            try {
                clientRef.current.publish({ destination: '/app/change-order-in-store-coder', body: selectedOrderInStoreCode })
            } catch (error) {
                console.error('Failed to publish message:', error)
            }
        } else {
            console.warn('WebSocket client is not connected')
        }
    }, [selectedOrderInStoreCode])

    useEffect(() => {
        console.log('CONNECT WS')
        connect()

        return () => {
            if (clientRef.current) {
                console.log('Deactivating WebSocket client')
                clientRef.current.deactivate()
            }
        }
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if (clientRef.current && !clientRef.current.connected) {
                console.warn('WebSocket client not connected. Attempting to reconnect...')
                connect()
            }
        }, 5000) // Kiểm tra trạng thái mỗi 5 giây

        return () => clearInterval(interval) // Dọn dẹp interval khi component unmount
    }, [])

    useEffect(() => {
        console.log(countOrder)
    }, [countOrder])

    const connect = () => {
        const socket = new SockJS(`http://localhost:8080/api/v1/ws-notifications`)
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                // Authorization: `Bearer ${accessToken}`,
            },
            debug: function(str) {
                console.log(str)
            },
            reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        })

        client.onConnect = function() {
            console.log('Connected to WebSocket')
            client.subscribe('/send/messages', (message: Message) => {
                const result = JSON.parse(message.body)
                openNotification(result.body, 'Thông báo mới', 'info', 10000)
            })
            client.subscribe('/receive/messages', (message: Message) => {
                const result = JSON.parse(message.body)
                console.log(result)
            })
            client.subscribe('/new-order/messages', (message: Message) => {
                const result = JSON.parse(message.body)
                console.log(result)
                setCountOrder((prevCountOrder) => prevCountOrder + 1)
            })
            client.subscribe('/has-change/messages', (message: Message) => {
                console.log('has change message log: ', message)
                setSignalReloadTableProduct((prevSignalReloadTableProduct) => {
                    console.log(!prevSignalReloadTableProduct) // Log giá trị nghịch đảo của state cũ
                    return !prevSignalReloadTableProduct // Cập nhật state mới
                })
                console.log('------')
            })
            client.publish({ destination: '/app/receive', body: 'MY MESSAGE' })
        }

        client.onDisconnect = function() {
            console.warn('Disconnected from WebSocket')
        }

        client.onStompError = function(frame) {
            console.error('Broker reported error: ' + frame.headers['message'])
            console.error('Additional details: ' + frame.body)
        }

        clientRef.current = client
        client.activate()
    }

    const callHaveNewOrder = () => {
        if (clientRef.current) {
            console.log('Publishing new order message')
            try {
                clientRef.current.publish({ destination: '/app/new-order', body: 'Hello world' })
            } catch (error) {
                console.error('Failed to publish message:', error)
            }
        } else {
            console.warn('WebSocket client is not connected')
        }
    }

    return (
        <WsContext.Provider value={{
            signalReloadTableProduct,
            callHaveNewOrder,
            countOrder,
            setCountOrder,
            selectedOrderInStoreCode,
            setSelectedOrderInStoreCode
        }}>
            {children}
        </WsContext.Provider>
    )
}

export const useWSContext = () => useContext(WsContext)

export default WsProvider
