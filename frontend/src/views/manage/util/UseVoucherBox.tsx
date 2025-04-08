import { Fragment, useState } from 'react'
import { Button, Input } from '@/components/ui'
import { HiOutlineHand, HiPaperAirplane, HiTicket } from 'react-icons/hi'
import SellVocherModal from '@/views/manage/sell/component/dialog/SellVocherModal'
import { OrderResponseDTO } from '@/@types/order'
import instance from '@/axios/CustomAxios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useToastContext } from '@/context/ToastContext'

const UseVoucherBox = ({ selectedOrder, fetchSelectedOrder }: {
    selectedOrder: OrderResponseDTO,
    fetchSelectedOrder: () => Promise<void>
}) => {
    const [isOpenVoucherModal, setIsOpenVoucherModal] = useState<boolean>(false)

    const { openNotification } = useToastContext()
    const onUseVoucherByCode = async (codeVoucher: string) => {
        const data = {
            idOrder: selectedOrder.id,
            codeVoucher: codeVoucher
        }
        await instance.post(`/orders/use-voucher-by-code`, data).then(function(response) {
            console.log(response)
            fetchSelectedOrder()
            if (response.status === 200) {
                openNotification('Áp phiếu giảm giá thành công', 'Sử dụng phiếu giảm giá', 'success', 2000)
            }
        }).catch(function(error) {
            if (error?.response?.data?.error) {
                console.log(error.response.data)
                openNotification(error?.response?.data?.error, 'Sử dụng phiếu giảm giá', 'danger', 2000)
            }
        })
    }

    const handleUnlinkVoucher = async () => {
        instance.get(`/orders/unlink-voucher/${selectedOrder.id}`).then(function(response) {
            console.log(response)
            fetchSelectedOrder()
            if (response.status === 200) {
                openNotification('Gỡ bỏ voucher thành công', 'Thông báo', 'success', 2000)
            }
        }).catch(function(error) {
            if (error?.response?.data?.error) {
                console.log(error.response.data)
                openNotification(error?.response?.data?.error, 'Thông báo', 'danger', 2000)
            }
        })
    }

    // Yup validation schema
    const validationSchema = Yup.object({
        codeVoucher: Yup.string().required('Mã giảm giá không được để trống')
    })

    return (
        <Fragment>
            <div className={`${selectedOrder.status !== 'PENDING' ? 'hidden' : ''}`}>
                <Formik
                    initialValues={{ codeVoucher: selectedOrder?.voucherResponseDTO?.code || '' }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        await onUseVoucherByCode(values.codeVoucher)
                        resetForm()
                    }}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Fragment>
                            <Form className="flex gap-2">
                                <div className="flex flex-col w-full">
                                    <div className="relative">
                                        <Field name="codeVoucher">
                                            {({ field }) => (
                                                <Input
                                                    disabled={selectedOrder.status !== 'PENDING'}
                                                    {...field}
                                                    placeholder="Nhập mã giảm giá nếu khách cung cấp"
                                                    suffix={(
                                                        <Button
                                                            type="submit"
                                                            className="cursor-pointer"
                                                            variant="plain"
                                                            icon={<HiPaperAirplane />}
                                                            disabled={isSubmitting || selectedOrder.status !== 'PENDING'}
                                                        />
                                                    )}
                                                />
                                            )}
                                        </Field>
                                    </div>

                                </div>
                                <Button
                                    type={'button'}
                                    className="!px-2"
                                    icon={<HiTicket size={18} />}
                                    disabled={selectedOrder.status !== 'PENDING'}
                                    onClick={() => setIsOpenVoucherModal(true)}
                                />
                                {
                                    selectedOrder?.voucherResponseDTO?.quantity <= 0 && (
                                        <Button
                                            type={'button'}
                                            className="!px-2"
                                            icon={<HiOutlineHand  size={18} />}
                                            disabled={selectedOrder.status !== 'PENDING'}
                                            onClick={() => handleUnlinkVoucher()}
                                        />
                                    )
                                }

                            </Form>
                            <ErrorMessage
                                name="codeVoucher"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </Fragment>
                    )}
                </Formik>
            </div>

            {
                (isOpenVoucherModal && selectedOrder) && (
                    <SellVocherModal
                        setIsOpenVoucherModal={setIsOpenVoucherModal}
                        selectOrder={selectedOrder}
                        fetchData={fetchSelectedOrder}
                    />
                )
            }
        </Fragment>
    )
}

export default UseVoucherBox
