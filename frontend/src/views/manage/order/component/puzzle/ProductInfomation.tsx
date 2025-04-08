import { ProductDetailOverviewPhah04 } from '../../../../../@types/order'
import { Avatar } from '@/components/ui'
import { FiPackage } from 'react-icons/fi'

const hasSaleEvent = (item: ProductDetailOverviewPhah04) => {
    return item.nowAverageDiscountPercentEvent > 0

}
const getFinalPrice = (item: ProductDetailOverviewPhah04) => {
    const { price } = item
    const discountPercent = item.eventResponseDTOS.length > 0
        ? item.nowAverageDiscountPercentEvent
        : 0

    return Math.round(price * (1 - discountPercent / 100))
}

const ProductInformation = ({ seletedProductDetail }: { seletedProductDetail: ProductDetailOverviewPhah04 }) => {
    return (
        <div className="grid xl:grid-cols-3 grid-cols-1">
            <div className={'md:col-span-2'}>
                <div className="font-semibold text-xl py-2">
                    <div>
                        <span>Sản phẩm: </span>
                        <span className="text-gray-600">
                            {seletedProductDetail?.name}
                        </span>
                    </div>
                </div>
                <div className="flex gap-5">
                    <div>
                        {
                            Array.isArray(seletedProductDetail.images) && seletedProductDetail.images.length > 0 ? (
                                <div className={'relative'}>
                                    <Avatar className={'relative'} size={90} src={seletedProductDetail.images[0].url}
                                            shape={'round'} />
                                    {
                                        seletedProductDetail.nowAverageDiscountPercentEvent > 0 && (
                                            <div
                                                className={'absolute top-0 right-0  bg-red-600 z-50 border-black border text-[10px] text-white w-[40px] text-center font-semibold'}>
                                                <p>-{seletedProductDetail.nowAverageDiscountPercentEvent} %</p>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <div className={'relative'}>
                                    <Avatar size={90} icon={<FiPackage />} />
                                    {
                                        seletedProductDetail.nowAverageDiscountPercentEvent> 0 && (
                                            <div
                                                className={'absolute top-0 right-0 bg-red-600 z-50 border-black border text-[10px] text-white w-[40px] text-center font-semibold'}>
                                                <p>-{seletedProductDetail.nowAverageDiscountPercentEvent} %</p>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                    <div className="text-sm py-2 inline-flex flex-col justify-between">
                        <li>
                            <span>Mã: </span>
                            <span className="font-semibold">{seletedProductDetail?.code}</span>
                        </li>
                        <li>
                            <span>Kích thước: </span>
                            <span className="font-semibold">{seletedProductDetail?.sizeName}</span>
                        </li>
                        <li>
                            <span>Màu sắc: </span>
                            <span className="font-semibold">{seletedProductDetail?.colorName}</span>
                        </li>
                        <li>
                            <span>Sản phẩm: </span>
                            <span className="font-semibold">{seletedProductDetail?.productName}</span>
                        </li>
                        <li>
                            <span>Họa tiết: </span>
                            <span className="font-semibold">{seletedProductDetail?.textureName}</span>
                        </li>
                        <li>
                            <span>Xuất xứ: </span>
                            <span className="font-semibold">{seletedProductDetail?.originName}</span>
                        </li>
                        <li>
                            <span>Thương hiệu: </span>
                            <span className="font-semibold">{seletedProductDetail?.brandName}</span>
                        </li>
                        <li>
                            <span>Cổ áo: </span>
                            <span className="font-semibold">{seletedProductDetail?.collarName}</span>
                        </li>
                        <li>
                            <span>Tay áo: </span>
                            <span className="font-semibold">{seletedProductDetail?.sleeveName}</span>
                        </li>
                        <li>
                            <span>Chất liệu: </span>
                            <span className="font-semibold">{seletedProductDetail?.materialName}</span>
                        </li>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-10">
                <li>
                    <span>Giá: </span>
                    <span className={'text-red-600'}>
                        {
                            hasSaleEvent(seletedProductDetail) ? (
                                <span>
                                    <span
                                        className={'line-through'}>{Math.round(seletedProductDetail.price).toLocaleString('vi') + 'đ'}</span>
                                    <span
                                        className={'ml-4'}>{Math.round(getFinalPrice(seletedProductDetail)).toLocaleString('vi') + 'đ'}</span>
                                </span>
                            ) : (
                                <span>
                                    <span>{Math.round(seletedProductDetail.price).toLocaleString('vi') + 'đ'}</span>
                                </span>
                            )
                        }
                    </span>
                </li>
                <li>
                    <span>Kho: </span>
                    <span className="font-semibold text-black">
                        {seletedProductDetail?.quantity}
                    </span>
                </li>
            </div>
        </div>
    )
}

export default ProductInformation