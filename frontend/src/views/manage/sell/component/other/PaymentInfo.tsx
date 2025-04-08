import { PaymentSummaryProps } from '@/@types/payment'
import { Card, Radio } from '@/components/ui'
import { Fragment } from 'react/jsx-runtime'
import { EPaymentMethod } from '@/views/manage/sell'
import { useEffect, useState } from 'react'
import { updateOrder } from '@/services/OrderService'
import { OrderResponseDTO } from '@/@types/order'
import SuggestVoucher from '@/views/manage/util/SuggestVoucher'
import UseVoucherBox from '@/views/manage/util/UseVoucherBox'
import PaymentRow from '@/views/manage/sell/component/other/PaymentRow'
import FeeShipRow from '@/views/manage/sell/component/other/FeeShipRow'

const PaymentInfo = ({ selectedOrder, data, fetchSelectedOrder }: {
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>
}) => {
    return (
        <Fragment>
            <PaymentSummary
                data={data}
                selectedOrder={selectedOrder}
                fetchSelectedOrder={fetchSelectedOrder}
            />
        </Fragment>
    )
}

const PaymentSummary = ({ selectedOrder, data, fetchSelectedOrder }: {
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>,
}) => {

    const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(EPaymentMethod.CASH)


    useEffect(() => {
        setPaymentMethod(selectedOrder.payment as EPaymentMethod)
    }, [data, selectedOrder.payment])

    const onChangeMethod = async (val: EPaymentMethod) => {
        setPaymentMethod(val)
        const response = await updateOrder(selectedOrder.id, { payment: val })
        console.log(response)
        await fetchSelectedOrder()
    }

    return (
        <Fragment>
            <Card className="mb-4 h-auto">
                <div className="flex justify-between">
                    <div>
                        <h5 className="mb-4">Hình thức thanh toán</h5>
                    </div>
                    <div className="flex gap-3 justify-between">
                        <div>
                            <div className="text-black">
                                <div className="font-semibold">
                                    <Radio.Group value={paymentMethod} onChange={onChangeMethod}>
                                        <Radio value={EPaymentMethod.TRANSFER}>Chuyển khoản</Radio>
                                        <Radio value={EPaymentMethod.CASH}>Tiền mặt</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul>
                    <PaymentRow label="Tổng tiền" value={data?.subTotal} />
                    <FeeShipRow fetchSelectedOrder={fetchSelectedOrder} data={data} selectedOrder={selectedOrder} />
                    <PaymentRow label={`Giảm giá (${selectedOrder?.discountVoucherPercent}%)`} value={data?.discount}
                                prefix={' - '} />
                    <div className={'pb-4'}>
                        <div>
                            <UseVoucherBox fetchSelectedOrder={fetchSelectedOrder} selectedOrder={selectedOrder} />
                        </div>
                        <SuggestVoucher
                            selectedOrder={selectedOrder}
                            fetchSelectedOrder={fetchSelectedOrder}
                        />
                    </div>
                    <PaymentRow isLast label="Tổng thanh toán" value={data?.total} />
                </ul>
            </Card>
        </Fragment>
    )
}

export default PaymentInfo