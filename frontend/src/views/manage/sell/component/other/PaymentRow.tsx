import { PaymentInfoProps } from '@/@types/payment'
import { NumericFormat } from 'react-number-format'

const PaymentRow = ({ label, value, isLast, prefix, children }: PaymentInfoProps & { children?: React.ReactNode }) => {
    return (
        <li
            className={`flex items-center justify-between${!isLast ? ' mb-3' : ''
            }`}
        >
            <span className="text-black">{label}</span>
            <div className={'flex'}>
                {children && <div className="">{children}</div>}
                <span className="font-semibold text-red-600">
                <NumericFormat
                    displayType="text"
                    value={(Math.round((value as number) * 100) / 100).toFixed(
                        0
                    )}
                    prefix={prefix}
                    suffix={' ₫'}
                    thousandSeparator={true}
                    allowNegative={false}
                />
            </span>
            </div>
        </li>
    )
}
export default PaymentRow;