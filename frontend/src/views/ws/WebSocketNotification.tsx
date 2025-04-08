import React, { Fragment, Suspense} from 'react'

const WebSocketNotification: React.FC = () => {
    // const [messages, setMessages] = useState<MessageEntity[]>([])
    // const [message, setMessage] = useState<string>('')
    // const clientRef = useRef<Client | null>(null)
    // const { openNotification } = useToastContext()
    //
    // useEffect(() => {
    //     console.log('CONNECT WS')
    //     connect()
    //     return () => {
    //         if (clientRef.current) {
    //             clientRef.current.deactivate()
    //         }
    //     }
    // }, [])
    //
    // const connect = () => {
    //     const tokenString = localStorage.getItem('token')
    //     const token = tokenString ? JSON.parse(tokenString) : null
    //     const accessToken = token ? token.accessToken : ''
    //
    //     const socket = new SockJS(`http://localhost:8080/api/v1/ws-notifications`)
    //     const client = new Client({
    //         webSocketFactory: () => socket,
    //         connectHeaders: {
    //             Authorization: `Bearer ${accessToken}`
    //         },
    //         debug: function(str) {
    //             console.log(str)
    //         },
    //         reconnectDelay: 5000,
    //         heartbeatIncoming: 4000,
    //         heartbeatOutgoing: 4000
    //     })
    //
    //     client.onConnect = function() {
    //         console.log('OK')
    //         client.subscribe('/send/messages', (message: Message) => {
    //             const result = JSON.parse(message.body)
    //             openNotification(result.body, "Thông báo mới", "info", 10000)
    //         })
    //         client.subscribe('/receive/messages', (message: Message) => {
    //             const result = JSON.parse(message.body)
    //             console.log(result)
    //         })
    //
    //         client.publish({ destination: '/app/receive', body: message })
    //     }
    //
    //     client.onStompError = function(frame) {
    //         console.error('Broker reported error: ' + frame.headers['message'])
    //         console.error('Additional details: ' + frame.body)
    //     }
    //
    //     clientRef.current = client
    //     client.activate()
    // }
    //
    // const handleSend = () => {
    //     if (clientRef.current) {
    //         console.log('+++')
    //         clientRef.current.publish({ destination: '/app/send', body: 'Hello word' })
    //     } else {
    //         console.log('---')
    //     }
    // }
    return (
        <Fragment>
            <Suspense>
            </Suspense>
        </Fragment>
    )
}

export default WebSocketNotification