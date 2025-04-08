import { NumericFormat } from 'react-number-format'

const PriceAmount = ({ amount, className }: { amount: number; className?: string }) => {
    return (
        <NumericFormat
            displayType="text"
            value={(Math.round(amount * 100) / 100).toFixed(0)}
            suffix={'₫'}
            thousandSeparator={true}
            className={className} // Áp dụng className
        />
    )
}
export default PriceAmount