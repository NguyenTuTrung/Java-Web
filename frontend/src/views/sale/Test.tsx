import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "@/axios/CustomAxios";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { useSaleContext } from "@/views/sale/SaleContext";
import { useToastContext } from "@/context/ToastContext";

type BaseEntity = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

export type Image = BaseEntity & {
    url: string;
};

export type Size = BaseEntity;
export type Color = BaseEntity;
export type Product = BaseEntity & {
    events: any[];
};

export type ProductDetailResponseDTOTest = {
    id: number;
    code: string;
    price: number;
    quantity: number;
    size: Size;
    color: Color;
    brand: BaseEntity;
    material: BaseEntity;
    image: Image[];
};

const ProductDetail = () => {
    const { id } = useParams();
    const { myCartId } = useSaleContext();
    const [product, setProduct] = useState<Product>();
    const [productDetail, setProductDetail] = useState<any>(null);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { openNotification } = useToastContext();
    const [quantity, setQuantity] = useState<number>(1);

    // Lấy dữ liệu ban đầu của sản phẩm và chi tiết sản phẩm
    useEffect(() => {
        if (id) {
            instance.get(`/product/${id}`).then(response => {
                if (response?.data) {
                    setProduct(response.data);
                }
            });

            instance.get(`/productDetails/product-detail-of-product/hung/${id}`).then(response => {
                if (response?.data) {
                    setProductDetail(response.data);
                }
            });
        }
    }, [id]);

    // Handle việc chọn hình ảnh
    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        console.log("check: ", productDetail?.image)
    };

    const defaultImage = "https://bizweb.dktcdn.net/100/415/697/products/img-2069-1.jpg?v=1724056536197"
    // Format giá
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = () => {
        const dataRequest = {
            cartId: myCartId,
            productDetailId: productDetail?.id,
            quantity: quantity
        };
        instance.post("/cart-details/create", dataRequest).then(function (response) {
            if (response.status === 200) {
                openNotification("Thêm vào giỏ hàng thành công");
            }
        });
    };

    return (
        <div>
            <div className="flex justify-center gap-10 2xl:p-20">
                <div className="col-span-6">
                    <div className="mb-4">
                        <img
                            className="w-[400px] h-[500px] object-cover rounded-lg"
                            src={
                                // Kiểm tra nếu productDetail.image là mảng và currentImageIndex hợp lệ
                                Array.isArray(productDetail?.image) && productDetail.image.length > 0 && currentImageIndex >= 0 && currentImageIndex < productDetail.image.length
                                    ? productDetail.image[currentImageIndex] // Nếu hợp lệ, lấy URL ảnh theo chỉ số
                                    : defaultImage // Nếu không hợp lệ, sử dụng ảnh mặc định
                            }
                            alt="Product Image"
                        />

                    </div>

                    {productDetail?.image && productDetail.image.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {productDetail.image.map((image: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageClick(index)}
                                    className={`relative min-w-[80px] h-[80px] border-2 rounded-md overflow-hidden
                    ${currentImageIndex === index ? 'border-black' : 'border-gray-200'}`}
                                >
                                    <img
                                        // Kiểm tra nếu image.url tồn tại, nếu không thì sử dụng ảnh mặc định
                                        src={image || defaultImage}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                </div>

                <div className="col-span-6">
                    <div>
                        <p className="font-semibold text-xl text-black">{product?.name}</p>
                    </div>
                    <div className={'flex flex-col'}>
                        <p>Mã sản phẩm <span className={'text-black'}>{productDetail?.code}</span></p>
                        <div className={'flex gap-2'}>
                            <p>Thương hiệu: <span className={'text-black'}>{productDetail?.brand?.name}</span></p>
                            <p>Tình trạng: <span className={'text-black'}>{productDetail?.quantity > 0 ? "Còn hàng" : "Hết hàng"}</span></p>
                        </div>
                        <p>Chất liệu <span className={'text-black'}>{productDetail?.material?.name}</span></p>
                    </div>
                    <div className="py-1 text-xl">
                        <p>Giá: {
                            productDetail ? (
                                <span className="text-xl text-red-500">
                                    {formatPrice(productDetail.price)}
                                </span>
                            ) : (
                                <span>Đang cập nhật</span>
                            )
                        }</p>
                    </div>

                    <div className="py-2 flex gap-4 items-center">
                        <div className="flex items-center">
                            <button
                                onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                                className="text-2xl text-black"
                            >
                                <HiMinusCircle />
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="text-2xl text-black"
                            >
                                <HiPlusCircle />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!productDetail || productDetail?.quantity <= 0}
                            className="bg-red-500 text-white rounded-md px-6 py-3 disabled:bg-gray-400"
                        >
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
