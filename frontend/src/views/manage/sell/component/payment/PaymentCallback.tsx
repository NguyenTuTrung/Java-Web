import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Loading } from '@/components/shared'
import { Button } from '@/components/ui'
import instance from '@/axios/CustomAxios'
import StatusOrderFormat from '@/views/util/StatusOrderFormat'
import Logo from '@/components/template/Logo'

type OrderResponseDTO = {
    id: number;
    code: string;
    address: string;
    phone: string;
    recipientName: string | null;
    provinceId: string;
    provinceName: string;
    districtId: string;
    districtName: string;
    wardId: string;
    wardName: string;
    deleted: boolean;
    status: 'TOSHIP' | string; // Assuming the status can be a string, but with "TOSHIP" being a common value.
    type: 'ONLINE' | string; // Assuming the type can be "ONLINE" or any other string value.
    payment: 'TRANSFER' | string; // Assuming the payment method can be "TRANSFER" or other strings.
    total: number;
    totalPaid: number;
    deliveryFee: number;
    discount: number;
    subTotal: number;
};

const PaymentCallback = () => {
    const location = useLocation()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO>()
    const [response_status_code, setResponse_status_code] = useState<string>("")

    const handle_payment_order =  async (orderId: string, amount: string) => {
        await instance.get(`/orders/is-payment-change/${orderId}?amount=${Number(amount) / 100}`).then(function(response){
            if(response.status === 200){
                console.log("Customer cancel order-success")
            }
        })
    }

    const handle_cancel_payment_order = async (orderId: string) => {
         await instance.get(`/orders/cancel-payment-customer/${orderId}`).then(function(response){
            if(response.status === 200){
                console.log("Customer cancel order-success")
            }
        })
    }

    const initData = async () => {
        const params = new URLSearchParams(location.search)
        const transactionId = params.get('vnp_TxnRef') // Mã giao dịch từ VNPay
        const responseCode = params.get('vnp_ResponseCode') // Mã phản hồi từ VNPay
        const amount = params.get('vnp_Amount') // Mã phản hồi từ VNPay
        const idOrder = params.get('orderId') // Mã phản hồi từ VNPay
        const vnp_TransactionStatus = params.get('vnp_TransactionStatus') // Mã phản hồi từ VNPay
        console.log('transactionId: ', transactionId)
        console.log('responseCode: ', responseCode)
        setResponse_status_code(responseCode || "")
        console.log('vnp_TransactionStatus: ', vnp_TransactionStatus)
        console.log('idOrder: ', idOrder)


        // Xử lý phản hồi từ VNPay
        if (responseCode === '00') {
            console.log(`Giao dịch thành công với mã giao dịch: ${transactionId} Id Order: ${idOrder}`)
            // Thực hiện logic cho giao dịch thành công
            if(idOrder != null && amount != null){
                await handle_payment_order(idOrder, amount)
            }
        } else if (responseCode == '24') {
            console.log('Khách hàng hủy giao dịch hóa đơn: ', idOrder)
            if(idOrder != null){
                await handle_cancel_payment_order(idOrder)
            }
        } else {
            console.log('Giao dịch thất bại.')
            // Thực hiện logic cho giao dịch thất bại
        }

        setIsLoading(true)
        await instance.get(`orders/${idOrder}`).then(function(response) {
            if (response.status === 200) {
                setSelectedOrder(response.data)
            }
        }).finally(function(){
            setIsLoading(false)
        })
    }

    useEffect(() => {
        initData();
    }, [location])

    const InfoOrder = ({ selectedOrder }: { selectedOrder: OrderResponseDTO }) => {
        return (
            <div className="border-t border-gray-200 mt-4 pt-4">
                <div className={'pb-5'}>
                    <h2 className="text-lg font-semibold text-indigo-400">Thông tin đơn hàng:</h2>
                </div>
                <div className={'grid grid-cols-2 justify-between text-[13px] gap-2'}>
                    <p className="text-gray-600 text-left">Mã đơn hàng:</p>
                    <p className="font-bold text-right">#{(selectedOrder as OrderResponseDTO)?.code ?? ''}</p>
                    <p className="text-gray-600 text-left ">Tổng tiền:</p>
                    <p className="font-bold text-right text-red-600">{(selectedOrder as OrderResponseDTO)?.subTotal.toLocaleString('vi') ?? ''} VND</p>
                    <p className="text-gray-600 text-left ">Phí vận chuyển:</p>
                    <p className="font-bold text-right text-red-600"> + {(selectedOrder as OrderResponseDTO)?.deliveryFee.toLocaleString('vi') ?? ''} VND</p>
                    <p className="text-gray-600 text-left ">Giảm giá:</p>
                    <p className="font-bold text-right text-red-600"> - {(selectedOrder as OrderResponseDTO)?.discount.toLocaleString('vi') ?? ''} VND</p>
                    <p className="text-gray-600 text-left">Đã thanh toán:</p>
                    <p className="font-bold text-right text-red-600">{(selectedOrder as OrderResponseDTO)?.totalPaid.toLocaleString('vi') ?? ''} VND</p>
                    <p className="text-gray-600 text-left">Cần thanh toán:</p>
                    <p className="font-bold text-right text-red-600">{(selectedOrder as OrderResponseDTO)?.total.toLocaleString('vi') ?? ''} VND</p>

                </div>
                <div className={'py-6'}>
                    <p className="text-gray-600">Trạng thái đơn hàng: <span
                        className="font-bold"> <StatusOrderFormat
                        status={(selectedOrder as OrderResponseDTO)?.status}></StatusOrderFormat></span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <Loading loading={isLoading} type={'cover'}>
            <div className="p-8 w-full text-center flex flex-col items-center justify-center h-svh">
                <div className="shadow-md bg-white rounded-md p-10 text-sm">
                    <div className={'flex justify-center'}>
                        <Logo/>
                    </div>
                    {
                        response_status_code === '00' ? (
                            <div className="p-8 w-full text-center">
                                <h1 className="text-2xl font-bold text-indigo-600 mb-4">Thanh Toán Thành Công!</h1>
                                <p className="text-gray-700 mb-4">Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xử
                                    lý.</p>
                                <InfoOrder selectedOrder={(selectedOrder as OrderResponseDTO)}></InfoOrder>
                                <div className={'py-6 flex gap-10 items-center justify-center'}>
                                    <Button className={''} variant="solid" onClick={() => {
                                        window.location.href = "/"
                                    }}>
                                        Quay về trang chủ
                                    </Button>
                                    <Link to={`/me/my-order/${(selectedOrder as OrderResponseDTO)?.id}`}>
                                        <Button className={''} variant="default">
                                            Xem chi tiết đơn hàng
                                        </Button>
                                    </Link>
                                </div>

                            </div>
                        ) : response_status_code === '24' ?
                            (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-600 mb-4 min-w-[500px]">Quý khách đã hủy giao
                                        dịch</h1>
                                    <div className={'py-6 flex gap-10 items-center justify-center'}>
                                        <Button className={''} onClick={() => {
                                            window.location.href = "/"
                                        }}>
                                            Quay về trang chủ
                                        </Button>
                                    </div>
                                </div>
                            )
                            : (
                                <div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-indigo-600 mb-4">Giao dịch thất bại</h1>
                                        <InfoOrder selectedOrder={(selectedOrder as OrderResponseDTO)}></InfoOrder>
                                        <div className={'py-6'}>
                                            <Link to={`/user/purchase/${(selectedOrder as OrderResponseDTO)?.code}`}>
                                                <Button className={''} variant="default">
                                                    Xem chi tiết đơn hàng
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>)
                    }
                </div>
            </div>

        </Loading>

    )
}
export default PaymentCallback