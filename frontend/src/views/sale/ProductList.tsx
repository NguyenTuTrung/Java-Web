import { Fragment, useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { Button, Pagination, Select } from '@/components/ui'
import { Link } from 'react-router-dom'
import { IoBagHandle } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

type Event = {
    discountPercent: number;
    startDate: string; // ISO 8601 date string
    endDate: string;   // ISO 8601 date string
    name: string;
    description: string | null;
    status: boolean;
};

type Product = {
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
    listEvent: Event[]
};
type CommonObject = {
    name: string,
    code: string
}
type Param = {
    sizeCodes: string[],
    colorCodes: string[],
    minPrice: number;
    maxPrice: number;
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

const ProductList = () => {
    const [pageSize, setPageSize] = useState(10)

    const onPageSizeChange = (val: Option) => {
        setPageSize(val.value)
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalElement, setTotalElement] = useState(0)

    const [listProduct, setListProduct] = useState<Product[]>([])
    const [listColor, setSetListColor] = useState<CommonObject[]>([])
    const [listSize, setSetListSize] = useState<CommonObject[]>([])
    const [listSizeSelected, setListSizeSelected] = useState<CommonObject[]>([])
    const [listColorSelected, setListColorSelected] = useState<CommonObject[]>([])
    // Hùng
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null)
    const [priceRange, setPriceRange] = useState([0, 5000000])
    const [isNewProductSelected, setIsNewProductSelected] = useState(false)
    const [isOnSaleSelected, setIsOnSaleSelected] = useState(false)

    const [param, setParam] = useState<Param>({
        sizeCodes: [],
        colorCodes: [],
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
    })

    // Hùng

    const initDataProduct = async () => {
        const response = await instance.get(`/productDetails/abc?colorCodes=${param.colorCodes}&sizeCodes=${param.sizeCodes}&minPrice=${param.minPrice}&maxPrice=${param.maxPrice}&page=${currentPage-1}&size=${pageSize}`)
        setListProduct(response?.data?.content)
        setTotalElement(response?.data?.totalElements)
    }
    const initListColor = async () => {
        const response = await instance.get('/color/color-objects')
        if (response.data && Array.isArray(response.data)) {
            setSetListColor(response.data)
        }
    }
    const initListSize = async () => {
        const response = await instance.get('/size/size-objects')
        if (response.data && Array.isArray(response.data)) {
            setSetListSize(response.data)
        }
    }
    useEffect(() => {
        initDataProduct()
        initListColor()
        initListSize()
    }, [param, pageSize, currentPage])


    const handleSelectColor = (color: CommonObject) => {
        console.log(color)
        if (!listColorSelected.find(s => s.code === color.code)) {
            // Nếu màu chưa được chọn, thêm vào danh sách
            setListColorSelected((prev) => [...prev, color])
        } else {
            // Nếu màu đã được chọn, loại bỏ khỏi danh sách
            setListColorSelected(listColorSelected.filter(s => s.code !== color.code))
        }
    }
    const handleSelectSize = (size: CommonObject) => {
        console.log(size)
        if (!listSizeSelected.find(s => s.code === size.code)) {
            setListSizeSelected((prev) => [...prev, size])
        } else {
            setListSizeSelected(listSizeSelected.filter(s => s.code !== size.code))
        }

    }
    const handlePriceChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            setPriceRange(value)
            setParam((prevParam) => ({
                ...prevParam,
                minPrice: value[0],
                maxPrice: value[1]
            }))
        }
    }

    // const handleSelectCategory = (category :string) => setSelectedCategory(category.id);
    const handleFilterNewProducts = () => setIsNewProductSelected(!isNewProductSelected)
    const handleFilterOnSale = () => setIsOnSaleSelected(!isOnSaleSelected)

    useEffect(() => {
        setParam((prevParam) => ({
            ...prevParam,
            colorCodes: listColorSelected.map(item => item.code),
            sizeCodes: listSizeSelected.map(item => item.code),
            minPrice: priceRange[0],
            maxPrice: priceRange[1]
        }))
        console.log(listSizeSelected)
        console.log(listColorSelected)
    }, [listSizeSelected, listColorSelected, priceRange])


    return (
        <Fragment>
            <div className={'grid grid-cols-12 px-[4%]  py-8 gap-10'}>
                <div className={'col-span-3'}>
                    <div className={'py-5'}>
                        <h3 className={'uppercase'}>Bộ lọc</h3>
                    </div>

                    <div className={'py-4'}>
                        <div className={'text-gray-800 py-2 font-semibold text-[16px]'}>
                            <p>Khoảng giá</p>
                        </div>
                        <div className={'flex flex-col items-center'}>
                            <Slider
                                range
                                min={0}
                                max={10000000}
                                step={1000}
                                value={priceRange}
                                onChange={handlePriceChange}
                                trackStyle={[{ backgroundColor: 'gray', height: 8 }]}
                                handleStyle={[
                                    {
                                        borderColor: 'black',
                                        height: 24,
                                        width: 24,
                                        marginLeft: -12,
                                        marginTop: -8,
                                        backgroundColor: 'white'
                                    },
                                    {
                                        borderColor: 'black',
                                        height: 24,
                                        width: 24,
                                        marginLeft: -12,
                                        marginTop: -8,
                                        backgroundColor: 'white'
                                    }
                                ]}
                                railStyle={{ backgroundColor: 'lightgray', height: 8 }}
                            />
                            <div className="flex justify-between w-full mt-3">
                                {/* Hiển thị giá theo định dạng có dấu phẩy và "đ" */}
                                <p>{priceRange[0].toLocaleString('vi-VN')} đ</p>
                                <p>{priceRange[1].toLocaleString('vi-VN')} đ</p>
                            </div>
                            <div className="mt-2 font-semibold text-sm text-gray-800">
                                Khoảng giá: {priceRange[0].toLocaleString('vi-VN')}đ
                                - {priceRange[1].toLocaleString('vi-VN')}đ
                            </div>
                        </div>
                    </div>

                    <div className={'py-4'}>
                        <div className={'text-gray-800 py-2 font-semibold text-[18px]'}>
                            <p>Danh mục</p>
                        </div>
                        {/* <div className={'flex flex-col'}>
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    className={`hover:bg-gray-200 p-2 text-left ${selectedCategory === category.id ? 'bg-gray-300' : ''}`}
                                    onClick={() => handleSelectCategory(category)}>
                                    {category.name}
                                </button>
                            ))}
                        </div> */}
                    </div>

                    {/* Lọc theo Sản phẩm mới và Sản phẩm đang sale */}
                    {/*<div className={'py-4'}>*/}
                    {/*    <div className={'text-gray-800 py-2 font-semibold text-[16px]'}>*/}
                    {/*        <p>Loại sản phẩm</p>*/}
                    {/*    </div>*/}
                    {/*    <div className={'flex flex-col'}>*/}
                    {/*        <button*/}
                    {/*            className={`hover:bg-gray-200 p-2 text-left ${isNewProductSelected ? 'bg-gray-300' : ''}`}*/}
                    {/*            onClick={() => handleFilterNewProducts()}>*/}
                    {/*            <p className="font-bold"> Sản phẩm mới</p>*/}
                    {/*        </button>*/}
                    {/*        <button*/}
                    {/*            className={`hover:bg-gray-200 p-2 text-left ${isOnSaleSelected ? 'bg-gray-300' : ''}`}*/}
                    {/*            onClick={() => handleFilterOnSale()}>*/}
                    {/*            <p className="font-bold"> Sản phẩm đang sale</p>*/}

                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    <div className={'pb-4'}>
                        <div className={'text-gray-800 py-2 font-semibold text-[16px]'}>
                            <p>Màu sắc</p>
                        </div>
                        <div className={'grid 2xl:grid-cols-6 md:grid-cols-4 xl:grid-cols-5 gap-3'}>
                            {
                                listColor.map((item, index) => (
                                    <button key={index}
                                            className={`hover:bg-gray-200 p-2 aspect-square w-[60px] text-center hover:outline-black outline-offset-4 hover:outline outline-2 border ${listColorSelected.find(s => s.code === item.code) ? '!bg-black text-white outline-black outline' : 'border-black border'}`}
                                            onClick={() => handleSelectColor(item)}>
                                        <p>{item.name}</p>
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    <div className={'py-4'}>
                        <div className={'text-gray-800 py-2 font-semibold text-[16px]'}>
                            <p>Size</p>
                        </div>
                        <div className={'grid 2xl:grid-cols-6 md:grid-cols-4 xl:grid-cols-5 gap-3'}>
                            {
                                listSize.map((item, index) => (
                                    <div key={index} className={'py-2'}>
                                        <button key={index}
                                                className={`hover:bg-gray-200 p-2 aspect-square w-[60px] text-center hover:outline-black outline-offset-4 hover:outline outline-2 border ${listSizeSelected.find(s => s.code === item.code) ? '!bg-black text-white outline-black outline' : 'border-black border'}`}
                                                onClick={() => handleSelectSize(item)}>
                                            <p>{item.name}</p>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={'col-span-9'}>
                    <div className={'py-5'}>
                        <h3 className={'uppercase'}>Danh sách sản phẩm </h3>
                    </div>
                    <div
                        className={'grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-5 gap-y-10 '}>
                        {
                            listProduct.map((product, index) => (
                                <Fragment key={index}>


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
                                            <Link to={`/products/${product.productId}`}>
                                                <Button className={'w-full !rounded-none !border !border-black !text-black font-'}>Thêm vào giỏ hàng</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Fragment>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center pb-10">
                <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={totalElement}
                    onChange={handlePageChange}
                />
                <div style={{ minWidth: 120 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        defaultValue={options[0]}
                        options={options}
                        onChange={selected => onPageSizeChange(selected as Option)}
                    />
                </div>
            </div>
        </Fragment>
    )
}
export default ProductList
