import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { useSaleContext } from '@/views/sale/SaleContext'
import { Color, Product, ProductDetailResponseDTO, Size } from '@/views/sale/index'
import { useToastContext } from '@/context/ToastContext'
import ProductInfo from '../client/Cart/ProductInfo'
import RecommendProduct from './RecommendProduct'
import ScrollToTop from '@/views/util/ScrollToTop'


const ProductDetail = () => {
    const { id } = useParams()
    const { myCartId, getCartDetailInCard, fetchDataMyCart } = useSaleContext()
    const [product, setProduct] = useState<Product>()
    const [listProductDetail, setListProductDetail] = useState<ProductDetailResponseDTO[]>([])
    const [listColorValid, setListColorValid] = useState<string[]>([])
    const [listColor, setListColor] = useState<Color[]>([])
    const [listSizeValid, setListSizeValid] = useState<string[]>([])
    const [listSize, setListSize] = useState<Size[]>([])
    const [selectedColor, setSelectedColor] = useState<Color | null>(null)
    const [selectedSize, setSelectedSize] = useState<Size | null>(null)
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetailResponseDTO | null>(null)

    const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const { openNotification } = useToastContext()
    const [quantity, setQuantity] = useState<number>(1)

    const handleDecreaseQuantity = () => {
        if (quantity - 1 > 0) {
            setQuantity(quantity - 1)
        }
    }
    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1)
    }

    const [salePercent, setSalePercent] = useState<number>(0)

    useEffect(() => {
        console.log(product)
        {
            product && product.nowAverageDiscountPercentEvent
                && setSalePercent(product.nowAverageDiscountPercentEvent)
        }
    }, [product])


    // Lấy dữ liệu ban đầu của sản phẩm và chi tiết sản phẩm
    useEffect(() => {
        if (id) {
            instance.get(`/productDetails/product-detail-of-product/${id}`).then(response => {
                if (response?.data) {
                    setListProductDetail(response.data)
                    setPriceRange(calculatePriceRange(response.data))
                }
            })

            instance.get(`/product/${id}`).then(response => {
                if (response?.data) {
                    setProduct(response.data)
                }
            })
        }
    }, [id])
    useEffect(() => {
    }, [listProductDetail])


    useEffect(() => {
        if (listProductDetail.length > 0) {
            // Lọc màu sắc và kích thước duy nhất
            const uniqueColors = listProductDetail.reduce((acc, item) => {
                if (!acc.some((color) => color.code === item.color.code)) {
                    acc.push(item.color)
                }
                return acc
            }, [] as typeof listProductDetail[0]['color'][])

            const uniqueSizes = listProductDetail.reduce((acc, item) => {
                if (!acc.some((size) => size.id === item.size.id)) {
                    acc.push(item.size)
                }
                return acc
            }, [] as typeof listProductDetail[0]['size'][])

            setListColor(uniqueColors)
            setListSize(uniqueSizes)

            // Chọn màu và kích thước mặc định nếu có
            if (uniqueColors.length > 0) {
                setSelectedColor(uniqueColors[0])  // Chọn màu đầu tiên
            }
            if (uniqueSizes.length > 0) {
                setSelectedSize(uniqueSizes[0])  // Chọn kích thước đầu tiên
            }
        }
    }, [listProductDetail])

    useEffect(() => {
        // Cập nhật chi tiết sản phẩm khi màu và kích thước đã chọn
        if (selectedColor && selectedSize) {
            const productDetail = listProductDetail.find(
                (item) => item.color.id === selectedColor.id && item.size.id === selectedSize.id
            )
            setSelectedProductDetail(productDetail ?? null)
        }
    }, [selectedColor, selectedSize, listProductDetail])

    // ảnh 
    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index)
    }

    const removeDuplicates = (array: string[]) => {
        return [...new Set(array)];
    };

    const defaultImage = "https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"
    // ảnh

    // Giá
    const calculatePriceRange = (details: ProductDetailResponseDTO[]) => {
        if (details.length === 0) return null

        const prices = details.map(detail => detail.price)
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    useEffect(() => {
        console.log("selectedColor CODE: " + selectedColor?.code)
        console.log("selectedColor ID: " + selectedColor?.id)
    }, [selectedColor])

    useEffect(() => {
        console.log("selectedSize CODE: " + selectedSize?.code)
        console.log("selectedSize ID: " + selectedSize?.id)
    }, [selectedSize])


    const handleSizeSelect = (size: Size) => {
        setSelectedSize(size)
        const filteredColors = removeDuplicates(listProductDetail
            .filter((item) => item.size.id === size.id)
            .map((item) => item.color.code))
        setListColorValid(filteredColors)
    }

    const handleColorSelect = (color: Color) => {
        setSelectedColor(color)
        const filteredSizes = removeDuplicates(listProductDetail
            .filter((item) => item.color.id === color.id)
            .map((item) => item.size.code))
        setListSizeValid(filteredSizes)
        console.log(filteredSizes)
        setSelectedSize(null)
    }


    // Lấy thông tin chi tiết sản phẩm dựa trên màu và kích thước đã chọn
    useEffect(() => {
        if (selectedColor && selectedSize) {
            const productDetail = listProductDetail.find(
                (item) => item.color.id === selectedColor.id && item.size.id === selectedSize.id
            )
            setSelectedProductDetail(productDetail ?? null)
        }
        else {
            setSelectedProductDetail(null)
        }
    }, [selectedColor, selectedSize, listProductDetail])

    const handleAddToCart = async (isRedirect: boolean = false) => {
        if (!selectedProductDetail?.id) {
            openNotification("Vui lòng chọn biến thể phù hợp", "Thông báo", "warning", 5000)
        }
        else {
            const dataRequest = {
                'cartId': myCartId,
                'productDetailId': selectedProductDetail?.id,
                'quantity': quantity
            }
            await instance.post('/cart-details/create', dataRequest).then(function (response) {
                console.log(response)
                if (response.status === 200) {
                    openNotification('Thêm vào giỏ hàng thành công')
                    getCartDetailInCard()
                    if(isRedirect){
                        window.location.href = `/checkout/${myCartId}`
                    }
                }
            }).catch(function (error) {
                if (error?.response?.data?.error) {
                    openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
                }
            })
        }
        await fetchDataMyCart();
    }

    const isDisableSize = () => {
        console.log("Ok")
    }

    return (

        <div className='px-[2%] mt-10'>
            <div className="flex justify-start gap-10 mb-5">
                <div className="col-span-6 border border-black p-10">

                    <div className="mb-4 relative">
                        {product && Array.isArray(product.eventDTOList)
                            && product.eventDTOList.length > 0
                            && (
                                <div
                                    className={'absolute top-2 right-2 bg-red-600 text-white p-2 border border-black z-20'}>
                                    - {product.eventDTOList[0].discountPercent}%
                                </div>
                            )
                        }
                        <img
                            className="w-[400px] h-[500px] object-cover rounded-lg"
                            src={selectedProductDetail?.images?.[currentImageIndex]?.url || defaultImage}
                            alt="Product Image"
                        />
                    </div>

                    {selectedProductDetail?.images && selectedProductDetail.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto justify-center">
                            {selectedProductDetail.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-24 h-24 object-cover cursor-pointer ${currentImageIndex === index ? 'border-2 border-black' : ''}`}
                                    onClick={() => handleImageClick(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>


                <div className="col-span-6">
                    <div>
                        <p className="font-semibold text-2xl text-black">{product?.name}</p>
                    </div>
                    <div className={'flex flex-col'}>
                        <p>Mã sản phẩm chi tiết: <span
                            className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.code}</span>
                        </p>
                        <div className={'flex gap-2'}>
                            <p>Thương hiệu: <span
                                className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.brand?.name}</span>
                            </p>

                        </div>
                        <p>Chất liệu <span
                            className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.material?.name}</span>
                        </p>
                    </div>
                    <div>
                        <p>Kho: <span
                            className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.quantity}</span>
                        </p>
                    </div>
                    <div>
                        <p>Tình trạng: <span
                            className={'text-black'}>{(selectedProductDetail as ProductDetailResponseDTO)?.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                        </p>
                    </div>
                    <div className={'py-2'}>
                        <div className={'font-semibold text-[18px] text-black pb-1'}>Màu sắc</div>
                        <div className="flex gap-3">
                            {listColor.map((item, index) => (
                                <button
                                    key={index}
                                    className={`relative hover:bg-gray-200 p-2 aspect-square w-[60px] text-center hover:outline-black outline-offset-4 hover:outline outline-2 border ${selectedColor?.id === item.id ? '!bg-black text-white outline-black outline' : 'border-black border'}`}
                                    // disabled={!listColorValid.includes(item.code) && listColorValid.length > 0}
                                    onClick={() => handleColorSelect(item)}
                                >
                                    {item.name}
                                    {/*<span*/}
                                    {/*    className={`absolute w-[2px] h-full bg-black top-1/2 left-1/2 rotate-45 -translate-x-1/2 -translate-y-1/2 ${!listColorValid.includes(item.code) && listColorValid.length > 0 ? '' : 'hidden'} ${selectedSize?.id === item.id ? 'bg-white' : 'bg-black'}`}>*/}
                                    {/*</span>*/}
                                </button>

                            ))}
                            {/*<button*/}
                            {/*    className="relative w-16 h-16 border border-black rounded overflow-hidden bg-gray-200 cursor-not-allowed">*/}
                            {/*    <span className="absolute w-[2px] h-full bg-black top-1/2 left-1/2 rotate-45 -translate-x-1/2 -translate-y-1/2"></span>*/}
                            {/*</button>*/}

                        </div>
                    </div>
                    <div className={'py-2'}>
                        <div className={'font-semibold text-black pb-1 text-[18px]'}>Size</div>
                        <div className="flex gap-3">
                            {listSize.map((item, index) => (
                                <button
                                    key={index}
                                    className={`relative hover:bg-gray-200 p-2 aspect-square w-[60px] text-center hover:outline-black outline-offset-4 hover:outline outline-2 border ${selectedSize?.id === item.id ? '!bg-black text-white outline-black outline' : 'border-black border'}`}
                                    disabled={!listSizeValid.includes(item.code) && listSizeValid.length > 0}
                                    onClick={() => handleSizeSelect(item)}
                                >
                                    {item.name}
                                    <span
                                        className={`absolute w-[2px] h-full bg-black top-1/2 left-1/2 rotate-45 -translate-x-1/2 -translate-y-1/2 ${!listSizeValid.includes(item.code) && listSizeValid.length > 0 ? '' : 'hidden'} ${selectedSize?.id === item.id ? 'bg-white' : 'bg-black'}`}>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="py-3 text-xl">
                        <p>{
                            selectedProductDetail ? (
                                <span className="text-xl text-red-500 font-semibold flex gap-4">
                                    {
                                        salePercent !== 0 && (
                                            <div>
                                                <p>{formatPrice(selectedProductDetail.price / 100 * (100 - salePercent))}</p>
                                            </div>
                                        )
                                    }
                                    <div>
                                        <p className={`${salePercent !== 0 ? 'line-through' : ''}`}>{formatPrice(selectedProductDetail.price)}</p>
                                    </div>
                                </span>
                            ) : priceRange ? (
                                <div className="text-xl text-red-500 font-semibold">
                                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                                </div>
                            ) : (
                                <span>Đang cập nhật</span>
                            )
                        }</p>
                    </div>

                    <div className={'py-2'}>
                        <div className={'font-semibold text-black pb-1 text-[18px]'}>Số lượng</div>
                        <div className="flex gap-1 items-center justify-start">
                            {
                                (<button
                                    className="pe-2 text-xl"
                                    onClick={() => handleIncreaseQuantity()}
                                ><HiPlusCircle size={25} /></button>)
                            }

                            <label>{quantity}</label>
                            {
                                (<button
                                    className="pl-2 text-xl"
                                    onClick={() => handleDecreaseQuantity()}
                                ><HiMinusCircle size={25} /></button>)
                            }
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className={'px-4 font-semibold text-red-500 py-2 border border-red-500'}
                            onClick={() => handleAddToCart()}>
                            Thêm vào giỏ hàng
                        </button>
                        <button
                            className={'px-4 font-semibold bg-red-500 text-white py-2 border border-red-500'}
                            onClick={async () => {
                                await handleAddToCart(true);
                            }}>
                            Mua ngay
                        </button>
                    </div>

                    <div>
                        <div className="mt-10 flex flex-wrap items-center justify-between space-x-2">
                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=550"
                                    alt="Miễn phí giao hàng cho đơn hàng từ 1 triệu"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    Miễn phí giao hàng cho đơn hàng từ 1 triệu
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=550"
                                    alt="Hàng phân phối chính hãng 100%"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    Hàng phân phối chính hãng 100%
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=550"
                                    alt="TỔNG ĐÀI 24/7 :  0964942121"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    TỔNG ĐÀI 24/7 : 0964942121
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between space-x-2">
                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=550"
                                    alt="ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi còn nguyên tem mác)"
                                />
                                <div className="text-gray-800 text-sm flex-1">
                                    Sản phẩm uy tín, chất lượng, bán hàng bằng trái tim
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=550"
                                    alt="Kiểm tra, thanh toán khi nhận hàng COD"
                                />
                                <div className="text-gray-800 text-sm flex-2 max-w-full">
                                    Kiểm tra, thanh toán khi nhận hàng COD
                                </div>
                            </div>

                            <div className="flex items-start space-x-1 w-1/4">
                                <img
                                    className="w-6 h-6 lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=550"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=550"
                                    alt="Hỗ trợ bảo hành, đổi sản phẩm tại tất cả store CANTH"
                                />
                                <div className="text-gray-800 text-sm flex-1 max-w-full">
                                    Hỗ trợ bảo hành, đổi sản phẩm tại tất cả tại store CANTH
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            {/* 
            <div className="flex justify-start gap-10 mt-5 ">
                <ProductInfo />
            </div> */}
            <div className="flex justify-start gap-10 mt-5">
                <ProductInfo
                    productDescription={product?.description}
                    reviews="Đánh giá từ khách hàng đã mua sản phẩm."
                    returnPolicy="Chính sách đổi trả áp dụng trong vòng 7 ngày khi sản phẩm còn nguyên tem mác."
                    warrantyPolicy="Sản phẩm được bảo hành tại tất cả các cửa hàng CANTH."
                />
            </div>
            <div className="flex flex-col justify-center items-center mt-4 mb-4">
                <h1 className="text-2xl font-bold mb-4">Có thể bạn sẽ thích</h1>
                <div className="w-full">
                    <RecommendProduct />
                </div>
            </div>
            <ScrollToTop></ScrollToTop>

        </div>
    )
}

export default ProductDetail
