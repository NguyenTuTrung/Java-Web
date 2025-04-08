import { Fragment } from 'react'
import Button from '@/components/ui/Button'
import { EOrderPayment } from '@/@types/order'
import { HiLibrary, HiOutlineCreditCard } from 'react-icons/hi'

const MethodPaymentOrderFormat = ({ inStore, payment }: { inStore: boolean, payment: EOrderPayment, }) => {
    return (
        <Fragment>
            <Button
                size="xs"
                variant="plain"
            >
                    <span
                        className={`flex items-center font-bold ${payment === 'CASH' ? 'text-green-600' : 'text-blue-600'}`}>
                        <span>
                            <p>
                                {payment === 'CASH'
                                    ? (<div className={'flex justify-center items-center gap-1'}>
                                        <HiLibrary size={20} />
                                        <p>
                                            Tiền mặt
                                        </p>
                                    </div>)
                                    : payment === 'TRANSFER'
                                        ? (<div className={'flex justify-center items-center gap-1'}>
                                            <HiOutlineCreditCard  size={20} />
                                            <p>
                                                Chuyển khoản ngân hàng
                                            </p>
                                        </div>)
                                        : 'Không xác định'}
                            </p>
                        </span>
                    </span>
            </Button>
        </Fragment>
    )
}
export default MethodPaymentOrderFormat