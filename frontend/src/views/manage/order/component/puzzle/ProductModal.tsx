// import { useState, useEffect, useRef, ChangeEvent, SetStateAction, Dispatch } from 'react'
// import Button from '@/components/ui/Button'
// import Input from '@/components/ui/Input'
// import DataTable from '@/components/shared/DataTable'
// import debounce from 'lodash/debounce'
// import axios from 'axios'
// import type { ColumnDef, OnSortParam, CellContext } from '@/components/shared/DataTable'
// import { DatePicker, Select } from '@/components/ui'
// import TabList from '@/components/ui/Tabs/TabList'
// import TabNav from '@/components/ui/Tabs/TabNav'
// import { OrderResponseDTO, OrderProductDetail, ProductDetailOverviewPhah04, StatusBill, EOrderStatusEnums, OrderTypeBill, EOrderTypeEnums } from '../../../../../@types/order'
// import { Link } from 'react-router-dom'
// import { HiArrowLeft, HiArrowNarrowLeft, HiPlusCircle, HiRefresh, HiReply } from 'react-icons/hi'
// import DatePickerRange from '@/components/ui/DatePicker/DatePickerRange'
// import { format } from 'date-fns';
// import CloseButton from '@/components/ui/CloseButton'
//
//
// import Radio from '@/components/ui/Radio'
// import Drawer from '@/components/ui/Drawer'
// import type { MouseEvent } from 'react'
// import { useToastContext } from '@/context/ToastContext'
// import instance from '@/axios/CustomAxios'
// import ProductInfomation from './ProductInfomation'
//
// type Direction = 'top' | 'right' | 'bottom' | 'left'
//
//
//
//
//
// const ProductModal = ({ setIsOpenProductModal, selectOrder, fetchData }: { setIsOpenProductModal: Dispatch<SetStateAction<boolean>>, selectOrder: OrderResponseDTO, fetchData: () => {} }) => {
//     const inputRef = useRef(null)
//     const quantityRef = useRef(null)
//     const [data, setData] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [isOpenPlacement, setIsOpenPlacement] = useState(false)
//     const [seletedProductDetail, setSeletedProductDetail] = useState<ProductDetailOverviewPhah04>()
//     const [orderDetailRequest, setOrderDetailRequest] = useState<{
//         quantity?: number;
//         orderId: number;
//         productDetailId?: number;
//     }>({
//         orderId: selectOrder.id,
//         quantity: 1
//     })
//     const placementList: {
//         name: string,
//         value: Direction,
//     }[] = [
//             { name: 'Top', value: 'top' },
//             { name: 'Right', value: 'right' },
//             { name: 'Bottom', value: 'bottom' },
//             { name: 'Left', value: 'left' },
//         ]
//     const [placement, setPlacement] = useState<Direction>(placementList[1].value)
//     const [tableData, setTableData] = useState<{
//         pageIndex: number
//         pageSize: number
//         sort: {
//             order: '' | 'asc' | 'desc'
//             key: string | number;
//         };
//         query: string
//         total: number
//     }>({
//         total: 0,
//         pageIndex: 1,
//         pageSize: 10,
//         query: '',
//         sort: {
//             order: '',
//             key: '',
//         },
//     })
//     const handlePaginationChange = (pageIndex: number) => {
//         setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
//     }
//     const handleSelectChange = (pageSize: number) => {
//         setTableData((prevData) => ({
//             ...prevData,
//             pageSize: pageSize, // Cập nhật pageSize mới
//             pageIndex: 1 // Đặt pageIndex về 1
//         }));
//     }
//     const handleSort = ({ order, key }: OnSortParam) => {
//         console.log({ order, key })
//         setTableData((prevData) => ({
//             ...prevData,
//             sort: {
//                 order,
//                 key: (key as string).replace("___", "."),
//             },
//         }));
//     }
//     const columns: ColumnDef<ProductDetailOverviewPhah04>[] = [
//         {
//             header: '#',
//             cell: (props) => (
//                 props.row.index + 1
//             ),
//         },
//         {
//             header: 'Tên',
//             accessorKey: 'name',
//         },
//         {
//             header: 'Mã',
//             accessorKey: 'code',
//         },
//         {
//             header: 'Kích thước',
//             accessorKey: 'size___name',
//             cell: (props) => (
//                 props.row.original.sizeName
//             ),
//         },
//         {
//             header: 'Màu sắc',
//             accessorKey: 'color___name',
//             cell: (props) => (
//                 props.row.original.colorName
//             ),
//         },
//         {
//             header: 'Chất liệu',
//             accessorKey: 'material___name',
//             cell: (props) => (
//                 props.row.original.materialName
//             ),
//         },
//         {
//             header: 'Thương hiệu',
//             accessorKey: 'brand___name',
//             cell: (props) => (
//                 props.row.original.brandName
//             ),
//         },
//         {
//             header: 'Hành động',
//             id: 'action',
//             cell: (props) => (
//                 <Button size="xs" onClick={() => setSelectProductDetailAndOpenDrawer(props.row.original, true)}>
//                     Chọn
//                 </Button>
//
//             ),
//         },
//     ]
//     const [queryParam, setQueryParam] = useState<{
//         size: number | undefined,
//
//     }>({
//         size: undefined
//     })
//
//     // FUCTION
//     const { openNotification } = useToastContext();
//
//     const setSelectProductDetailAndOpenDrawer = (productDetail: ProductDetailOverviewPhah04, isOpen: boolean) => {
//         setIsOpenPlacement(true)
//         setSeletedProductDetail(productDetail)
//         setOrderDetailRequest((pre) => ({ ...pre, productDetailId: productDetail.id }))
//     }
//
//     const fetchDataProduct = async () => {
//         setLoading(true)
//         const response = await instance.post('/v2/product', tableData,
//             {
//                 params: queryParam
//             }
//         )
//         setData(response.data.content)
//         setLoading(false)
//         setTableData((prevData) => ({
//             ...prevData,
//             ...{ total: response.data.totalElements },
//         }))
//         fetchData();
//     }
//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         debounceFn(e.target.value)
//     }
//     const debounceFn = debounce(handleDebounceFn, 500)
//     function handleDebounceFn(val: string) {
//         console.log(val)
//         if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
//             setTableData((prevData) => ({
//                 ...prevData,
//                 ...{ query: val, pageIndex: 1 },
//             }))
//         }
//     }
//
//     const sleep = (ms: number) => {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     };
//
//     const addOrderDetail = async () => {
//         await instance.post("/order-details", orderDetailRequest);
//         await handleDelayScreen()
//         fetchData();
//         openNotification("Thêm thành công!");
//         setIsOpenPlacement(false);
//         setIsOpenProductModal(false);
//     };
//
//     const handleDelayScreen = async () => {
//         setLoading(true);
//         await sleep(500)
//         setLoading(false);
//     }
//
//     const openDrawer = () => {
//         setIsOpenPlacement(true)
//     }
//
//     const onDrawerClose = (e: MouseEvent) => {
//         console.log('onDrawerClose', e)
//         setIsOpenPlacement(false)
//     }
//
//     const onPlacementChange = (val: Direction) => {
//         setPlacement(val)
//     }
//     // HOOK
//     useEffect(() => {
//         fetchDataProduct();
//     }, [
//         tableData.pageIndex,
//         tableData.sort,
//         tableData.pageSize,
//         tableData.query,
//         queryParam
//     ])
//     return (
//         <div className='fixed top-0 left-0 bg-gray-300 bg-opacity-50 w-screen h-screen z-50'>
//             <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 bg-gray-100 z-20 shadow-md rounded-md'>
//                 <div className="flex-wrap inline-flex xl:flex items-center gap-2 !w-[500px]">
//                     <div
//                         title="Thêm sản phẩm"
//                         className={`${!isOpenPlacement ? "hidden" : ""} w-3/5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl p-5`}
//                     >
//                         <div className='flex justify-between py-2 text-xl'>
//                             <div className='font-semibold'>
//                                 <label>Thêm mới</label>
//                             </div>
//                             <div>
//                                 <CloseButton onClick={onDrawerClose}></CloseButton>
//                             </div>
//                         </div>
//                         <hr></hr>
//                         <div>
//                             {seletedProductDetail && <ProductInfomation seletedProductDetail={seletedProductDetail}></ProductInfomation>}
//                             <div className='py-5'>
//                                 <label>Vui lòng nhập số lượng</label>
//                                 <Input
//                                     ref={quantityRef}
//                                     size='sm'
//                                     type='number'
//                                     min={1}
//                                     max={seletedProductDetail?.quantity}
//                                     onChange={(el) => setOrderDetailRequest({ ...orderDetailRequest, quantity: Number(el.target.value) })}
//                                 />
//                                 <Button onClick={() => addOrderDetail()} block variant="solid" size="sm" className='bg-indigo-500 w-full mt-5' icon={<HiPlusCircle />} >
//                                     Thêm sản phẩm
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='p-5 bg-white !h-4/5 rounded-md'>
//                     <div className='flex justify-between pb-3'>
//                         <div>
//                             <p className='font-semibold text-xl'>Danh sách sản phẩm chi tiết</p>
//                         </div>
//                         <div>
//                             <CloseButton onClick={() => setIsOpenProductModal(false)} className='text-2xl py-1'></CloseButton>
//
//                         </div>
//                     </div>
//                     <div>
//                         <div>
//                             <Input
//                                 ref={inputRef}
//                                 placeholder="Search..."
//                                 size="sm"
//                                 className="lg:w-full"
//                                 onChange={(el) => handleChange}
//                             />
//                         </div>
//                         <DataTable
//                             columns={columns}
//                             data={data}
//                             loading={loading}
//                             pagingData={tableData}
//                             onPaginationChange={handlePaginationChange}
//                             onSelectChange={handleSelectChange}
//                             onSort={handleSort}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default ProductModal;