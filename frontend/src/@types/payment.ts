import { ReactNode } from 'react'

export type PaymentInfoProps = {
    label?: string | ReactNode
    value?: number
    isLast?: boolean
    prefix?: string
}

export type PaymentSummaryProps = {
    total: number | undefined
    deliveryFee: number | undefined
    subTotal: number | undefined
    discount: number | undefined
    tax: number | undefined
    refund: number | undefined
    surcharge: number | undefined
    totalPaid: number | undefined
    totalAfterDiscountAndFee: number | undefined
}