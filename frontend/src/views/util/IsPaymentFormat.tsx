import { Fragment } from 'react'
import Button from '@/components/ui/Button'

const IsPaymentFormat = ({status}: {status: boolean}) => {
    return (
        <Fragment>
            <Button
                size="xs"
                variant="plain"
            >
                    <span
                        className={`flex items-center font-bold ${status ? 'text-green-600' : 'text-red-600'}`}>
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${status ? 'bg-green-600' : 'bg-red-600'}`}
                        ></span>
                        <span>
                            <p>
                                {status
                                    ? 'Đã thanh toán'
                                    : !status
                                        ? 'Chưa thanh toán'
                                        : 'Không xác định'}
                            </p>
                        </span>
                    </span>
            </Button>
        </Fragment>
    )
}
export default IsPaymentFormat;