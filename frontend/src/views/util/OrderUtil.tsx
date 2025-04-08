import { OrderDetailResponseDTO } from '@/@types/order'

const getFinalPriceInThePart = (item: OrderDetailResponseDTO) => {
    const discountPercent = item.averageDiscountEventPercent > 0
        ? item.averageDiscountEventPercent
        : 0
    return Math.round(item.productDetailResponseDTO.price * (1 - discountPercent / 100))
}
const hasChangeEventPercent = (item: OrderDetailResponseDTO) => {
    const nowPercent = item.averageDiscountEventPercent
    const partPercent = item.productDetailResponseDTO.product.nowAverageDiscountPercentEvent
    return nowPercent === partPercent
}
const hasChangeUnitPrice = (item: OrderDetailResponseDTO) => {
    const unitPrice = item.unitPrice
    const partPercent = getFinalPriceInThePart(item)
    return unitPrice === partPercent
}
export  {getFinalPriceInThePart, hasChangeEventPercent, hasChangeUnitPrice }