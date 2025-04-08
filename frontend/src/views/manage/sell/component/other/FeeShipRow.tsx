import { Fragment, useState } from 'react'
import PaymentRow from '@/views/manage/sell/component/other/PaymentRow'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
import { HiOutlineCash, HiOutlineTruck } from 'react-icons/hi'
import { changeIsManually } from '@/services/OrderService'
import { OrderResponseDTO } from '@/@types/order'
import { PaymentSummaryProps } from '@/@types/payment'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import instance from '@/axios/CustomAxios'
import { useToastContext } from '@/context/ToastContext'

const FeeShipRow = ({ selectedOrder, data, fetchSelectedOrder }: {
    selectedOrder: OrderResponseDTO,
    data: PaymentSummaryProps,
    fetchSelectedOrder: () => Promise<void>,
}) => {

    const { openNotification } = useToastContext()
    const FeeShipSchema = Yup.object().shape({
        feeShip: Yup.number()
            .required('Phí vận chuyển không được để trống.')
            .min(0, 'Phí vận chuyển không được nhỏ hơn 0.')
            .max(10000000, 'Phí vận chuyển không được vượt quá 10.000.000.')
    })

    const [isOpenEditFeeShip, setIsOpenEditFeeShip] = useState<boolean>(false)

    const handleEditFeeShip = async (value: number) => {
        console.log('FEE SHIP: ' + value)
        const data = {
            'orderId': selectedOrder.id,
            'amount': value
        }
        await changeIsManually(selectedOrder.id, true)
        await instance.post('/orders/edit-custom-fee', data).then(function(response) {
            console.log('Ok')
            if (response.status === 200) {
                openNotification('Áp dụng thành công')
            }
        }).catch(function(error) {
            if (error?.response?.data?.error) {
                openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
            }
        })
    }

    const handleChangeAutoFillFeeShip = async () => {
        const closeNotification = (key: string | Promise<string>) => {
            if (typeof key !== 'string') {
                key.then((resolvedValue) => {
                    toast.remove(resolvedValue)
                })
            } else {
                toast.remove(key)
            }
        }

        const notificationAutoFillFeeShip = toast.push(
            <Notification title="Thông báo" duration={8000}>
                <div>
                    Xác nhận đổi phương thức tính phí tự động?
                </div>
                <div className="text-right mt-3">
                    <Button
                        size="sm"
                        variant="solid"
                        className="mr-2 bg-red-600"
                        onClick={async () => {
                            closeNotification(notificationAutoFillFeeShip as string | Promise<string>)
                            const response = await changeIsManually(selectedOrder.id, false)
                            if (response.status === 200) {
                                console.log('response', response)
                                await fetchSelectedOrder()
                            }
                        }}
                    >
                        Xác nhận
                    </Button>
                    <Button
                        size="sm"
                        onClick={() =>
                            closeNotification(notificationAutoFillFeeShip as string | Promise<string>)
                        }
                    >
                        Hủy
                    </Button>
                </div>
            </Notification>
        )
    }

    return (
        <Fragment>
            <PaymentRow label={(
                <div className={'flex gap-2'}>
                    <p>Phí vận chuyển</p>
                    <img
                        alt={""}
                        src={'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Blue-Orange-350x88.png'}
                        width={'60px'} />
                </div>
            )} value={data?.deliveryFee} prefix={' + '}>
                <div hidden={selectedOrder.type === 'INSTORE' || selectedOrder.status !== "PENDING"}>
                    <Button
                        variant={'plain'}
                        icon={<HiOutlineTruck />}
                        onClick={handleChangeAutoFillFeeShip}
                    />
                    <Button
                        variant={'plain'}
                        icon={<HiOutlineCash />}
                        onClick={() => setIsOpenEditFeeShip(true)}
                    />
                </div>
            </PaymentRow>


            <Dialog isOpen={isOpenEditFeeShip} closable={false}>
                <h5 className="mb-4">Nhập phí vận chuyển:</h5>
                <div>
                    <Formik
                        initialValues={{ feeShip: 10000 }}
                        validationSchema={FeeShipSchema}
                        onSubmit={async (values) => {
                            await handleEditFeeShip(values.feeShip) // Gọi hàm với giá trị phí vận chuyển
                            setIsOpenEditFeeShip(false) // Đóng dialog
                            await fetchSelectedOrder()
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div>
                                    <Field
                                        name="feeShip"
                                        placeholder="Vui lòng nhập phí"
                                        type="number"
                                        className="input-class"
                                        inputMode="decimal"
                                        as={Input}
                                    />
                                    {errors.feeShip && touched.feeShip && (
                                        <div className="text-red-500 text-sm">{errors.feeShip}</div>
                                    )}
                                </div>
                                <p className={'text-[13px] text-red-600'}>(Phí điền tay chỉ được áp dụng khi dịch vụ
                                    tính phí vận chuyển gặp trục trặc)</p>
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        type={'button'}
                                        onClick={() => setIsOpenEditFeeShip(false)}
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
                </div>
            </Dialog>

        </Fragment>
    )
}
export default FeeShipRow