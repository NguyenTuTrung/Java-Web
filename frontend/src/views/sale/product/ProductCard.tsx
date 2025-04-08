import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { ProductSaleCardDTO } from '@/@types/sale'


const ProductCard = ({ product }: { product: ProductSaleCardDTO }) => {
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null)
    const nevigate = useNavigate()
    return (
        <Fragment>


            <div
                className={'bg-white p-4 flex justify-center flex-col duration-500 ease-in-out hover:scale-110 relative rounded-sm border'}
                onMouseEnter={() => setHoveredProductId(product.productId)}
                onMouseLeave={() => setHoveredProductId(null)}
            >
                {
                    Array.isArray(product.listEvent)
                    && product.listEvent.length > 0
                    && (
                        <div
                            className={'absolute top-2 right-2 bg-red-600 text-white p-2 border border-black z-20'}>
                            - {product.discountPercent}%
                        </div>
                    )
                }

                <div className="mb-2 relative group overflow-hidden  aspect-square ">
                    {
                        product.image.length > 0 ?
                            (
                                <img
                                    src={
                                        hoveredProductId === product.productId && product.image.length > 1
                                            ? product.image[1]
                                            : product.image[0]
                                    }
                                    alt={product.productName}
                                    className={`transition-transform duration-500 ease-in-out ${hoveredProductId === product.productId
                                        ? 'transform scale-110'
                                        : 'transform scale-100'
                                    }`}
                                />
                            ) :
                            (
                                <img
                                    src="https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"
                                    alt={''}
                                />
                            )
                    }
                    {/*<div*/}
                    {/*    className="absolute bottom-0 left-0 right-0 flex flex-row justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-opacity-50 p-2 w-full">*/}
                    {/*    <Link to={`/products/${product.productId}`} className="flex-1 mr-1">*/}
                    {/*        <Button*/}
                    {/*            className=" bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 flex items-center justify-center overflow-hidden">*/}
                    {/*            <IoBagHandle />*/}
                    {/*        </Button>*/}
                    {/*    </Link>*/}

                    {/*    <Link to={`/products/${product.productId}`} className="flex-1 ml-1">*/}
                    {/*        <Button*/}
                    {/*            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 flex items-center justify-center">*/}
                    {/*            <FaEye className="mr-2" />*/}
                    {/*        </Button>*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                </div>
                <div className={'flex justify-between text-red-500 text-[12.5px]'}>
                    <p>+ {product.countColor} màu sắc</p>
                    <p>+ {product.countSize} kích thước</p>
                </div>
                <div className={'font-semibold text-[16px] py-1 text-black'}>
                    <p>{product.productName}</p>
                </div>
                <div
                    className={'font-semibold text-[14px] text-black py-2'}>
                    {
                        Array.isArray(product.listEvent)
                        && product.listEvent.length > 0
                            ? (
                                <div className={' flex justify-between'}>
                                    <p className={'line-through'}>{Math.round(product.price).toLocaleString('vi') + '₫'}</p>
                                    <p className={'text-red-600'}>{Math.round(product.price / 100 * (100 - product.discountPercent)).toLocaleString('vi') + '₫'}</p>
                                </div>
                            )
                            :
                            (
                                <p className={'text-red-600'}>{Math.round(product.price).toLocaleString('vi') + '₫'}</p>
                            )
                    }

                </div>
                <div>
                    <Button
                        className={'w-full !rounded-none !border !border-black !text-black'}
                        onClick={() => {
                            nevigate(`/products/${product.productId}`)
                        }}>Thêm vào giỏ
                        hàng</Button>
                </div>
            </div>
        </Fragment>
    )
}
export default ProductCard