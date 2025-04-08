import { useState, useEffect, useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import { HiPlusCircle } from 'react-icons/hi'
import CloseButton from '@/components/ui/CloseButton'
import type { MouseEvent } from 'react'
import { useToastContext } from '@/context/ToastContext'
import instance from '@/axios/CustomAxios'
import ProductInformation from '@/views/manage/order/component/puzzle/ProductInfomation'
import { OrderResponseDTO, ProductDetailOverviewPhah04 } from '@/@types/order'
import { useLoadingContext } from '@/context/LoadingContext'
import { Avatar, Select } from '@/components/ui'
import { FiPackage } from 'react-icons/fi'
import { useOrderContext } from '@/views/manage/order/component/context/OrderContext'

type Property = {
    id: number;
    createdDate: string; // ISO 8601 format: "1980-08-31T21:43:06.41"
    updatedDate: string; // ISO 8601 format: "1994-02-13T15:50:10.003"
    code: string;
    name: string;
    deleted: boolean;
    value: string;
    label: string;
};

const SellProductModal = ({ setIsOpenProductModal, selectOrder, fetchData }: {
    setIsOpenProductModal: Dispatch<SetStateAction<boolean>>,
    selectOrder: OrderResponseDTO,
    fetchData: () => Promise<void>
}) => {
    const [listSize, setListSize] = useState<Property[]>([])
    const [listColor, setListColor] = useState<Property[]>([])
    const [listProduct, setListProduct] = useState<Property[]>([])
    const [listTexture, setListTexture] = useState<Property[]>([])
    const [listOrigin, setListOrigin] = useState<Property[]>([])
    const [listBrand, setListBrand] = useState<Property[]>([])
    const [listCollar, setListCollar] = useState<Property[]>([])
    const [listSleeve, setListSleeve] = useState<Property[]>([])
    const [listMaterial, setListMaterial] = useState<Property[]>([])
    const [listThickness, setListThickness] = useState<Property[]>([])
    const [listElasticity, setListElasticity] = useState<Property[]>([])


    // const [selectedColor, setSelectedColor] = useState<Property>()
    // const [selectedSize, setSelectedSize] = useState<Property>()
    // const [selectedBrand, setSelectedBrand] = useState<Property>()
    // const [selecteddMaterial, setSelectedMaterial] = useState<Property>()
    // const [selectedProduct, setSelectedProduct] = useState<Property>()

    const handleThicknessChange = (newValue, actionMeta) => {
        console.log(`action: ${actionMeta.action}`)
        console.log(newValue)
        setQueryParam(prevState => ({
            ...prevState,
            thickness: newValue?.id ?? undefined
        }))
    }
    const handleElasticityChange = (newValue, actionMeta) => {
        console.log(`action: ${actionMeta.action}`)
        console.log(newValue)
        setQueryParam(prevState => ({
            ...prevState,
            elasticity: newValue?.id ?? undefined
        }))
    }
    const handleCollarChange = (newValue, actionMeta) => {
        console.log(`action: ${actionMeta.action}`)
        console.log(newValue)
        setQueryParam(prevState => ({
            ...prevState,
            collar: newValue?.id ?? undefined
        }))
    }
    const handleSleeveChange = (newValue, actionMeta) => {
        console.log(`action: ${actionMeta.action}`)
        console.log(newValue)
        setQueryParam(prevState => ({
            ...prevState,
            sleeve: newValue?.id ?? undefined
        }))
    }

    const handleOriginChange = (newValue, actionMeta) => {
        console.log(`action: ${actionMeta.action}`)
        console.log(newValue)
        setQueryParam(prevState => ({
            ...prevState,
            origin: newValue?.id ?? undefined
        }))
    }

    const handleTextureChange = (newValue, actionMeta) => {
        console.log(`action: ${actionMeta.action}`)
        console.log(newValue)
        setQueryParam(prevState => ({
            ...prevState,
            texture: newValue?.id ?? undefined
        }))
    }

    const handleColorChange = (newValue, actionMeta) => {
        console.log(`action: ${actionMeta.action}`)
        console.log(newValue)
        setQueryParam(prevState => ({
            ...prevState,
            color: newValue?.id ?? undefined
        }))
    }

    const handleSizeChange = (newValue, actionMeta) => {
        setQueryParam(prevState => ({
            ...prevState,
            size: newValue?.id ?? undefined
        }))
    }

    const handleBrandChange = (newValue, actionMeta) => {
        setQueryParam(prevState => ({
            ...prevState,
            brand: newValue?.id ?? undefined
        }))
    }

    const handleMaterialChange = (newValue, actionMeta) => {
        setQueryParam(prevState => ({
            ...prevState,
            material: newValue?.id ?? undefined
        }))
    }

    const handleProductChange = (newValue, actionMeta) => {
        setQueryParam(prevState => ({
            ...prevState,
            product: newValue?.id ?? undefined
        }))
    }


    const transformData = (data: any[]) => {
        return data.map(item => ({
            id: item.id,
            createdDate: item.createdDate,
            updatedDate: item.updatedDate,
            code: item.code,
            name: item.name,
            deleted: item.deleted,
            value: item.code, // value là code
            label: item.name  // label là name
        }))
    }

    const initProperties = () => {
        instance.get('/color/color-objects').then(function(response) {
            console.log(response.data)
            setListColor(transformData(response.data))
        })
        instance.get('/size/size-objects').then(function(response) {
            console.log(response.data)
            setListSize(transformData(response.data))
        })
        instance.get('/brand/brand-objects').then(function(response) {
            console.log(response.data)
            setListBrand(transformData(response.data))
        })
        instance.get('/product/product-objects').then(function(response) {
            console.log(response.data)
            setListProduct(transformData(response.data))
        })
        instance.get('/texture/texture-objects').then(function(response) {
            console.log(response.data)
            setListTexture(transformData(response.data))
        })
        instance.get('/material/material-objects').then(function(response) {
            console.log(response.data)
            setListMaterial(transformData(response.data))
        })
        instance.get('/origin/origin-objects').then(function(response) {
            console.log(response.data)
            setListOrigin(transformData(response.data))
        })
        instance.get('/collar/collar-objects').then(function(response) {
            console.log(response.data)
            setListCollar(transformData(response.data))
        })
        instance.get('/sleeve/sleeve-objects').then(function(response) {
            console.log(response.data)
            setListSleeve(transformData(response.data))
        })
        instance.get('/thickness/thickness-objects').then(function(response) {
            console.log(response.data)
            setListThickness(transformData(response.data))
        })
        instance.get('/elasticity/elasticity-objects').then(function(response) {
            console.log(response.data)
            setListElasticity(transformData(response.data))
        })

    }
    useEffect(() => {
        initProperties()
    }, [])


    const inputRef = useRef(null)
    const quantityRef = useRef(null)
    const { setIsOpenOverrideConfirm, checkAllowOverride, setSelectedOrderRequestContext } = useOrderContext()
    const [data, setData] = useState([])
    const { sleep, isLoadingComponent, setIsLoadingComponent } = useLoadingContext()
    const [isOpenPlacement, setIsOpenPlacement] = useState(false)
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetailOverviewPhah04>({
        id: 0,
        code: '',
        name: '',
        deleted: false,
        quantity: 1,
        price: 0,
        sizeName: '',
        colorName: '',
        productName: '',
        textureName: '',
        originName: '',
        brandName: '',
        collarName: '',
        sleeveName: '',
        materialName: '',
        thicknessName: '',
        elasticityName: '',
        images: [],
        nowAverageDiscountPercentEvent: 0,
        eventResponseDTOS: []
    })

    const [orderDetailRequest, setOrderDetailRequest] = useState<{
        quantity?: number;
        orderId: number;
        productDetailId?: number;
    }>({
        orderId: selectOrder.id,
        quantity: 1
    })
    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number;
        };
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 5,
        query: '',
        sort: {
            order: '',
            key: ''
        }
    })
    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }
    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }))
    }
    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace('___', '.')
            }
        }))
    }

    const hasSaleEvent = (item: ProductDetailOverviewPhah04) => {
        return item.eventResponseDTOS.length > 0

    }
    const getFinalPrice = (item: ProductDetailOverviewPhah04) => {
        const { price } = item
        const discountPercent = item.eventResponseDTOS.length > 0
            ? item.nowAverageDiscountPercentEvent
            : 0

        return Math.round(price * (1 - discountPercent / 100))
    }
    const columns: ColumnDef<ProductDetailOverviewPhah04>[] = [
        {
            header: '#',
            cell: (props) => (
                props.row.index + 1
            )
        },
        {
            header: 'Ảnh',
            cell: (props) => {
                return Array.isArray(props.row.original.images) && props.row.original.images.length > 0 ? (
                    <div className={'relative'}>
                        <Avatar className={'relative'} size={90} src={props.row.original.images[0].url}
                                shape={'round'} />
                        {
                            props.row.original.eventResponseDTOS.length > 0 && (
                                <div
                                    className={'absolute top-0 -right-4 p-1 bg-red-600 z-50 border-black border text-[10px] text-white mim-w-[45px] text-center font-semibold'}>
                                    <p>-{props.row.original.nowAverageDiscountPercentEvent} %</p>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className={'relative'}>
                        <Avatar size={90} icon={<FiPackage />} />
                        {
                            props.row.original.eventResponseDTOS.length > 0 && (
                                <div
                                    className={'absolute top-0 -right-4 p-1 bg-red-600 z-50 border-black border text-[10px] text-white mim-w-[45px] text-center font-semibold'}>
                                    <p>-{props.row.original.nowAverageDiscountPercentEvent} %</p>
                                </div>
                            )
                        }
                    </div>
                )
            }
        },
        {
            header: 'Mã',
            accessorKey: 'code'
        },
        {
            header: 'Sản phẩm',
            accessorKey: 'product___name',
            cell: (props) => (
                props.row.original.productName
            )
        },
        {
            header: 'Kích thước',
            accessorKey: 'size___name',
            cell: (props) => (
                props.row.original.sizeName
            )
        },
        {
            header: 'Màu sắc',
            accessorKey: 'color___name',
            cell: (props) => (
                props.row.original.colorName
            )
        },
        {
            header: 'Chất liệu',
            accessorKey: 'material___name',
            cell: (props) => (
                props.row.original.materialName
            )
        },
        {
            header: 'Thương hiệu',
            accessorKey: 'brand___name',
            cell: (props) => (
                props.row.original.brandName
            )
        },
        {
            header: 'Giá',
            accessorKey: 'price',
            cell: (props) => (
                <div className={'text-red-600'}>
                    {
                        hasSaleEvent(props.row.original) ? (
                            <div className={'flex gap-3'}>
                                <p className={'line-through'}>{Math.round(props.row.original.price).toLocaleString('vi') + 'đ'}</p>
                                <p>{Math.round(getFinalPrice(props.row.original)).toLocaleString('vi') + 'đ'}</p>
                            </div>
                        ) : (
                            <div>
                                <p>{Math.round(props.row.original.price).toLocaleString('vi') + 'đ'}</p>
                            </div>
                        )
                    }
                </div>
            )
        },
        {
            header: 'Số lương',
            accessorKey: 'quantity',
            cell: (props) => (
                props.row.original.quantity
            )
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: (props) => (
                <Button size="xs" onClick={() => setSelectProductDetailAndOpenDrawer(props.row.original, true)}>
                    Chọn
                </Button>

            )
        }
    ]
    const [queryParam, setQueryParam] = useState<{
        size: number | undefined,
        color: number | undefined,
        product: number | undefined,
        texture: number | undefined,
        origin: number | undefined,
        brand: number | undefined,
        collar: number | undefined,
        sleeve: number | undefined,
        material: number | undefined,
        thickness: number | undefined,
        elasticity: number | undefined
    }>({
        size: undefined,
        color: undefined,
        product: undefined,
        texture: undefined,
        origin: undefined,
        brand: undefined,
        collar: undefined,
        sleeve: undefined,
        material: undefined,
        thickness: undefined,
        elasticity: undefined,
    })

    // FUCTION
    const { openNotification } = useToastContext()

    const setSelectProductDetailAndOpenDrawer = (productDetail: ProductDetailOverviewPhah04, isOpen: boolean) => {
        setIsOpenPlacement(true)
        setSelectedProductDetail(productDetail)
        console.log('------------------')
        console.log(productDetail)
        setOrderDetailRequest((pre) => ({
            ...pre,
            productDetailId: productDetail.id,
            quantity: 1,
            averageDiscountEventPercent: productDetail.nowAverageDiscountPercentEvent
        }))
    }

    const fetchDataProduct = async () => {
        setIsLoadingComponent(true)
        const response = await instance.post('/v2/product', tableData,
            {
                params: queryParam
            }
        )
        setData(response.data.content)
        setTableData((prevData) => ({
            ...prevData,
            ...{ total: response.data.totalElements }
        }))
        await fetchData()
        setIsLoadingComponent(false)
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value) // Log the input value
        debounceFn(e.target.value) // Call the debounced function
    }

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        console.log(val)
        if ((val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 }
            }))
        }
    }

    const addOrderDetail = async () => {
        console.log(orderDetailRequest)
        const hasChange = await checkAllowOverride(orderDetailRequest)
        console.log(hasChange)
        setIsOpenOverrideConfirm(hasChange)
        if (hasChange) {
            setSelectedOrderRequestContext(orderDetailRequest)
            setIsOpenPlacement(false)
            setIsOpenProductModal(false)
        } else {
            await instance.post('/order-details', orderDetailRequest).then(function(response){
                if(response.status === 200){
                    openNotification("Thêm thành công")
                }
            }).catch(function(error){
                if (error?.response?.data?.error) {
                    openNotification(error?.response?.data?.error, 'Thông báo', 'warning', 5000)
                }
            })
            await fetchData()
            setIsOpenPlacement(false)
            setIsOpenProductModal(false)
            await sleep(500)
        }
        document.body.style.overflow = 'auto'


    }


    const onDrawerClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpenPlacement(false)
    }

    // HOOK
    useEffect(() => {
        fetchDataProduct()
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        queryParam
    ])

    return (
        <div className="fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-40">
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 3xl:w-4/5 xl:w-5/6 w-4/5 max-h-4/5 overflow-auto bg-gray-100 z-20 shadow-md rounded-md">
                <div className="flex-wrap inline-flex xl:flex items-center gap-2 !w-[500px]">
                    <div
                        title="Thêm sản phẩm"
                        className={`${!isOpenPlacement ? 'hidden' : ''} w-3/5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl p-5 z-50`}
                    >
                        <div className="flex justify-between py-2 text-xl">
                            <div className="font-semibold text-black">
                                <label>Thêm mới</label>
                            </div>
                            <div>
                                <CloseButton onClick={onDrawerClose}></CloseButton>
                            </div>
                        </div>
                        <hr></hr>
                        <div>
                            {selectedProductDetail &&
                                <ProductInformation seletedProductDetail={selectedProductDetail}></ProductInformation>}
                            <div className="py-5">
                                <label>Vui lòng nhập số lượng</label>
                                <Input
                                    ref={quantityRef}
                                    size="sm"
                                    type="number"
                                    min={1}
                                    max={selectedProductDetail?.quantity}
                                    value={orderDetailRequest.quantity}
                                    onChange={(el) => setOrderDetailRequest({
                                        ...orderDetailRequest,
                                        quantity: Number(el.target.value)
                                    })}
                                />
                                <Button block variant="solid" size="sm" className="bg-indigo-500 w-full mt-5"
                                        icon={<HiPlusCircle />} onClick={() => addOrderDetail()}>
                                    Thêm sản phẩm
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white !h-4/5 rounded-md min-h-[500px]">
                    <div className="flex justify-between pb-3">
                        <div>
                            <p className="font-semibold text-xl">Danh sách sản phẩm chi tiết</p>
                        </div>
                        <div>
                            <CloseButton className="text-2xl py-1" onClick={() => {
                                setIsOpenProductModal(false)
                                document.body.style.overflow = 'auto'
                            }}></CloseButton>

                        </div>
                    </div>
                    <div>
                        <div className={'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5 py-2'}>
                            <div>
                                <p>Tìm kiếm</p>
                                <Input
                                    ref={inputRef}
                                    placeholder="Tìm theo tên sản phẩm chi tiết, mã"
                                    size="sm"
                                    className="lg:w-full"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Kích cỡ</p>
                                <Select
                                    isClearable
                                    onChange={handleSizeChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listSize}
                                ></Select>
                            </div>
                            <div>
                                <p>Màu sắc</p>
                                <Select
                                    onChange={handleColorChange}
                                    isClearable
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listColor}
                                ></Select>
                            </div>
                            <div>
                                <p>Sản phẩm</p>
                                <Select
                                    isClearable
                                    onChange={handleProductChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listProduct}
                                ></Select>
                            </div>
                            <div>
                                <p>Họa tiết</p>
                                <Select
                                    isClearable
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listTexture}
                                    onChange={handleTextureChange}
                                ></Select>
                            </div>


                            <div>
                                <p>Xuất xứ</p>
                                <Select
                                    isClearable
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listOrigin}
                                    onChange={handleOriginChange}
                                ></Select>
                            </div>

                            <div>
                                <p>Cổ áo</p>
                                <Select
                                    isClearable
                                    onChange={handleCollarChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listCollar}
                                ></Select>
                            </div>
                            <div>
                                <p>Tay áo</p>
                                <Select
                                    isClearable
                                    onChange={handleSleeveChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listSleeve}
                                ></Select>
                            </div>
                            <div>
                                <p>Độ dày</p>
                                <Select
                                    isClearable
                                    onChange={handleThicknessChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listThickness}
                                ></Select>
                            </div>
                            <div>
                                <p>Độ co dãn</p>
                                <Select
                                    isClearable
                                    onChange={handleElasticityChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listElasticity}
                                ></Select>
                            </div> 
                            <div>
                                <p>Thương hiệu</p>
                                <Select
                                    isClearable
                                    onChange={handleBrandChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listBrand}
                                ></Select>
                            </div>
                            <div>
                                <p>Chất liệu</p>
                                <Select
                                    isClearable
                                    onChange={handleMaterialChange}
                                    size={'sm'}
                                    placeholder="Vui lòng chọn"
                                    options={listMaterial}
                                ></Select>
                            </div>

                        </div>
                        {
                            data.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    loading={isLoadingComponent}
                                    pagingData={tableData}
                                    onPaginationChange={handlePaginationChange}
                                    onSelectChange={handleSelectChange}
                                    onSort={handleSort}
                                />
                            ) : (
                                <div className={'text-xl font-semibold flex justify-center'}>
                                    <p className={'py-60'}>
                                        Không tìm thấy sản phẩm nào phù hợp
                                    </p>
                                </div>
                            )
                        }

                    </div>
                </div>

            </div>

        </div>
    )
}

export default SellProductModal