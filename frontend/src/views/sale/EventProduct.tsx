import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoBagHandle, IoCart } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import { Button } from '@/components/ui';
import { Pagination, Select } from '@/components/ui'
import BreadCrumb from './BreadCrumb';

interface Color {
    id: number;
    name: string;
}

interface Size {
    id: number;
    name: string;
}

interface Event {
    id: number;
    name: string;
}

interface Product {
    productId: number;
    productCode: string;
    productName: string;
    countColor: number;
    countSize: number;
    price: number;
    discountPrice: number;
    discountPercent: number;
    discountAmount: number;
    image: string[];
    mass: number;
    listEvent: Event[];
}


type Option = {
    value: number
    label: string
}
const options: Option[] = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 50, label: '50 / page' }
]

function EventProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
    const [pageSize, setPageSize] = useState(10)

    const onPageSizeChange = (val: Option) => {
        setPageSize(val.value)
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [totalElement, setTotalElement] = useState(0)


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/v1/productDetails/new-in-last-week?page=0&size=10"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch data from API");
                }
                const data = await response.json();
                setProducts(data.content || []);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;
    return (
        <div>

            <div className="w-full">
                <img
                    src="https://file.hstatic.net/200000182297/file/1__2__7ce0c3d98f5c4a0dbeb5aab5dd3875eb.png"
                    alt="Full Page Image"
                    className="w-full object-contain"
                />
            </div>

            <div className="container mx-auto px-72 max-w-full mt-10 mb-10">
                <div className="flex items-center gap-4">
                    <h1 className="text uppercase">Hàng Hot</h1>
                    <img
                        alt="HÀNG HOT"
                        className="max-h-[55px] w-[50px] h-[50px]"
                        src="//theme.hstatic.net/200000881795/1001243022/14/flashsale-hot.png?v=152"
                    />
                </div>



                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-5">
                    {products.map((product) => (
                        <div
                            key={product.productId}
                            className="product-card bg-white shadow-lg rounded-lg p-4"
                            onMouseEnter={() => setHoveredProductId(product.productId)}
                            onMouseLeave={() => setHoveredProductId(null)}
                        >
                            <div className="mb-2 relative group overflow-hidden aspect-square">
                                {product.image.length > 0 ? (
                                    <img
                                        src={
                                            hoveredProductId === product.productId && product.image.length > 1
                                                ? product.image[1]
                                                : product.image[0]
                                        }
                                        alt={product.productName}
                                        className={`transition-transform duration-300 ease-in-out ${hoveredProductId === product.productId
                                            ? 'transform scale-300' // Smaller scale on hover
                                            : 'transform scale-100'
                                            }`}
                                    />
                                ) : (
                                    <img
                                        src="https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"
                                        alt={''}
                                    />
                                )}

                                <div
                                    className="absolute bottom-0 left-0 right-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-opacity-50 p-2 w-full">
                                    {/* Button 1 */}
                                    <Link to={`/products/${product.productId}`} className="flex items-center justify-center px-2">
                                        <Button
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                                            <IoBagHandle />
                                        </Button>
                                    </Link>

                                    {/* Button 2 */}
                                    <Link to={`/products/${product.productId}`} className="flex items-center justify-center px-2">
                                        <Button
                                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                                            <FaEye className="mr-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className={'flex justify-between text-gray-500 text-[15px] mt-3'}>
                                <p>+ {product.countColor} màu sắc</p>
                                <p>+ {product.countSize} kích thước</p>
                            </div>
                            <div className="product-info mt-4">
                                <h2 className="text-xl font-semibold">{product.productName}</h2>
                                <p className="text-gray-500">{product.productCode}</p>
                                <div className={'font-semibold text-[14px] text-black py-2'}>
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
                            </div>
                            <div>
                                <Link to={`/products/${product.productId}`}>
                                    <Button className={'w-full !rounded-none !border !border-black !text-black font-'}>
                                        Thêm vào giỏ hàng</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end pb-10"> {/* Align pagination to the right */}
                    <Pagination
                        currentPage={currentPage + 1} // Ant Design expects 1-based page number
                        pageSize={pageSize}
                        total={totalElement}
                        onChange={handlePageChange}
                    />
                    <div style={{ minWidth: 120 }} className="ml-4">
                        <Select
                            size="sm"
                            isSearchable={false}
                            defaultValue={options[0]}
                            options={options}
                            onChange={selected => onPageSizeChange(selected as Option)}
                        />
                    </div>
                </div>
            </div>
            <div className=" card border-0">
                <div className="flex items-center justify-center gap-10 mt-10 mb-10">
                    <h1 className="text uppercase mt-10">Đồ Hiệu CANTH</h1>
                </div>
                <div className="ss_body">
                    <div className="row mx-0 hrz-scroll text-center flex-nowrap js-slider justify-content-around slick-initialized slick-slider">
                        <div className="slick-list draggable">
                            <div className="slick-track" style={{ opacity: 1, width: '1212px', transform: 'translate3d(0px, 0px, 0px)' }} role="listbox">
                                <div className="ss_item style2 slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" style={{ width: '202px' }} tabIndex={-1} role="option">
                                    <a href="/collections/do-xuan-he" tabIndex={0}>
                                        <div className="ss_img">
                                            <picture>
                                                <source media="(max-width: 991px)" srcSet="//theme.hstatic.net/200000881795/1001243022/14/season_coll_1_img_medium.png?v=152" />
                                                <img className="img-fluid m-auto object-contain mh-100 w-auto" src="//theme.hstatic.net/200000881795/1001243022/14/season_coll_1_img_large.png?v=152" width={200} height={200} alt="season_coll_1_img.png" />
                                            </picture>
                                        </div>
                                        <div className="ss_info">
                                            <div className="ss_name">Đồ xuân hè</div>
                                            <span className="ss_number">21 sản phẩm</span>
                                            <div className="ss_seemore">
                                                <svg className="icon">
                                                    <use xlinkHref="#icon-arrow" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="ss_item style2 slick-slide slick-active" data-slick-index="1" aria-hidden="false" style={{ width: '202px' }} tabIndex={-1} role="option">
                                    <a href="/collections/do-thu-dong" tabIndex={0}>
                                        <div className="ss_img">
                                            <picture>
                                                <source media="(max-width: 991px)" srcSet="//theme.hstatic.net/200000881795/1001243022/14/season_coll_3_img_medium.png?v=152" />
                                                <img className="img-fluid m-auto object-contain mh-100 w-auto" src="//theme.hstatic.net/200000881795/1001243022/14/season_coll_3_img_large.png?v=152" width={200} height={200} alt="season_coll_3_img.png" />
                                            </picture>
                                        </div>
                                        <div className="ss_info">
                                            <div className="ss_name">Đồ thu đông</div>
                                            <span className="ss_number">6 sản phẩm</span>
                                            <div className="ss_seemore">
                                                <svg className="icon">
                                                    <use xlinkHref="#icon-arrow" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="ss_item style2 slick-slide slick-active" data-slick-index="2" aria-hidden="false" style={{ width: '202px' }} tabIndex={-1} role="option">
                                    <a href="/collections/coc-binh" tabIndex={0}>
                                        <div className="ss_img">
                                            <picture>
                                                <source media="(max-width: 991px)" srcSet="//theme.hstatic.net/200000881795/1001243022/14/season_coll_4_img_medium.png?v=152" />
                                                <img className="img-fluid m-auto object-contain mh-100 w-auto" src="//theme.hstatic.net/200000881795/1001243022/14/season_coll_4_img_large.png?v=152" width={200} height={200} alt="season_coll_4_img.png" />
                                            </picture>
                                        </div>
                                        <div className="ss_info">
                                            <div className="ss_name">Cốc bình</div>
                                            <span className="ss_number">3 sản phẩm</span>
                                            <div className="ss_seemore">
                                                <svg className="icon">
                                                    <use xlinkHref="#icon-arrow" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="ss_item style2 slick-slide slick-active" data-slick-index="3" aria-hidden="false" style={{ width: '202px' }} tabIndex={-1} role="option">
                                    <a href="/collections/lego" tabIndex={0}>
                                        <div className="ss_img">
                                            <picture>
                                                <source media="(max-width: 991px)" srcSet="//theme.hstatic.net/200000881795/1001243022/14/season_coll_5_img_medium.png?v=152" />
                                                <img className="img-fluid m-auto object-contain mh-100 w-auto" src="//theme.hstatic.net/200000881795/1001243022/14/season_coll_5_img_large.png?v=152" width={200} height={200} alt="season_coll_5_img.png" />
                                            </picture>
                                        </div>
                                        <div className="ss_info">
                                            <div className="ss_name">Lego</div>
                                            <span className="ss_number">9 sản phẩm</span>
                                            <div className="ss_seemore">
                                                <svg className="icon">
                                                    <use xlinkHref="#icon-arrow" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="ss_item style2 slick-slide slick-active" data-slick-index="4" aria-hidden="false" style={{ width: '202px' }} tabIndex={-1} role="option">
                                    <a href="/collections/giay-dep" tabIndex={0}>
                                        <div className="ss_img">
                                            <picture>
                                                <source media="(max-width: 991px)" srcSet="//theme.hstatic.net/200000881795/1001243022/14/season_coll_6_img_medium.png?v=152" />
                                                <img className="img-fluid m-auto object-contain mh-100 w-auto" src="//theme.hstatic.net/200000881795/1001243022/14/season_coll_6_img_large.png?v=152" width={200} height={200} alt="season_coll_6_img.png" />
                                            </picture>
                                        </div>
                                        <div className="ss_info">
                                            <div className="ss_name">Giày dép</div>
                                            <span className="ss_number">1 sản phẩm</span>
                                            <div className="ss_seemore">
                                                <svg className="icon">
                                                    <use xlinkHref="#icon-arrow" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="ss_item style2 slick-slide slick-active" data-slick-index="5" aria-hidden="false" style={{ width: '202px' }} tabIndex={-1} role="option">
                                    <a href="/collections/do-luu-niem" tabIndex={0}>
                                        <div className="ss_img">
                                            <picture>
                                                <source media="(max-width: 991px)" srcSet="//theme.hstatic.net/200000881795/1001243022/14/season_coll_7_img_medium.png?v=152" />
                                                <img className="img-fluid m-auto object-contain mh-100 w-auto" src="//theme.hstatic.net/200000881795/1001243022/14/season_coll_7_img_large.png?v=152" width={200} height={200} alt="season_coll_7_img.png" />
                                            </picture>
                                        </div>
                                        <div className="ss_info">
                                            <div className="ss_name">Đồ lưu niệm</div>
                                            <span className="ss_number">1 sản phẩm</span>
                                            <div className="ss_seemore">
                                                <svg className="icon">
                                                    <use xlinkHref="#icon-arrow" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default EventProduct