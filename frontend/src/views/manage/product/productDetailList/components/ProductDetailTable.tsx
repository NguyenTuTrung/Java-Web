import { useEffect, useMemo, useRef, ReactNode, ChangeEvent } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useParams } from 'react-router-dom';
import Switcher from '@/components/ui/Switcher'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { FaPen, FaEye } from 'react-icons/fa'
import ProducttDetailUpdateConfirmation from './ProducttDetailUpdateConfirmation'
import ProductDetailDeleteConfirmation from './ProductDetailDeleteConfirmation'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { FiPackage } from 'react-icons/fi'
import {
    getProductDetailId,
    getProductDetails,
    getDataProductDetailQuery,
    setTableData,
    setProductId,
    toggleUpdateConfirmation,
    toggleDeleteConfirmation,
    setSelectedProductDetail,
    useAppDispatch,
    useAppSelector,
    setFilterData
} from '../store'

import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { Row } from '@tanstack/react-table';
type ChildObject = {
    code: string;
    createdDate: string;
    deleted: boolean;
    id: number;
    name: string;
};
type Image = {
    id: number;
    code: string;
    url: string;
    deleted: boolean;
    createdDate: string;
    modifiedDate: string;
};

type ProductDetail = {
    id: number;
    code: string;
    name: string;
    createdDate: string;
    product: ChildObject;
    size: ChildObject;
    color: ChildObject;
    brand?: ChildObject;
    collar?: ChildObject;
    elasticity?: ChildObject;
    material?: ChildObject;
    origin?: ChildObject;
    sleeve?: ChildObject;
    style?: ChildObject;
    texture?: ChildObject;
    thickness?: ChildObject;
    price?: number;
    quantity: number;
    images?: Image[]
    deleted: boolean;
}


const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
}

const getInventoryStatus = (quantity: number) => {
    if (quantity > 10) {
        return {
            label: 'còn hàng',
            dotClass: 'bg-emerald-500',
            textClass: 'text-emerald-500',
        };
    } else if (quantity > 0) {
        return {
            label: 'sắp hết hàng',
            dotClass: 'bg-amber-500',
            textClass: 'text-amber-500',
        };
    } else {
        return {
            label: 'hết hàng',
            dotClass: 'bg-red-500',
            textClass: 'text-red-500',
        };
    }
};

const ProductDetailColumn = ({ row }: { row: ProductDetail }) => {
    const avatar = Array.isArray(row.images) && row.images.length > 0 ? (
        <Avatar size={50} src={row.images && row.images[0]?.url} />
    ) : (
        <Avatar size={50} icon={<FiPackage />} />
    )

    return (
        <div className="flex items-center">
            {avatar}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.product?.name + " màu " + row.color?.name || ""}</span>
        </div>
    )
}

const ProductDetailTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const { id } = useParams();
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesProductDetailList.data.tableData
    )

    const loading = useAppSelector(
        (state) => state.salesProductDetailList.data.loading
    )

    const data = useAppSelector(
        (state) => state.salesProductDetailList.data.productDetailList
    )





    useEffect(() => {
        dispatch(getDataProductDetailQuery({ productId: id || '' }));
        dispatch(setProductId(id));
        dispatch(setFilterData({
            productId: 55,
            size: '',
            color: '',
            style: '',
            texture: '',
            origin: '',
            brand: '',
            collar: '',
            sleeve: '',
            material: '',
            thickness: '',
            elasticity: ''
        }));
        fetchData()

    }, [id])

    useEffect(() => {
        fetchData()
    }, [pageIndex, pageSize, sort])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )


    const fetchData = () => {
        dispatch(getProductDetails({ pageIndex, pageSize, sort, query }))

    }
    const ActionColumn = ({ row }: { row: ProductDetail }) => {
        const dispatch = useAppDispatch()
        const onUpdate = () => {
            dispatch(toggleUpdateConfirmation(true))
            dispatch(getProductDetailId({ id: row.id }));
        }
        const onDelete = () => {
            dispatch(toggleDeleteConfirmation(true))
            dispatch(setSelectedProductDetail(row.id))
        }

        const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
            onDelete()
        }
        return (
            <div className="flex justify-end text-lg">
                <FaEye
                    onClick={onUpdate}
                    size={20}
                    className="mr-3 text-2xl"
                    style={{ cursor: 'pointer' }}
                />
                <Switcher
                    className='text-sm'
                    unCheckedContent={withIcon(<RiMoonClearLine />)}
                    checkedContent={withIcon(<RiSunLine />)}
                    color="green-500"
                    checked={!row.deleted}
                    onChange={onSwitcherToggle}
                ></Switcher>

            </div>
        )
    }





    const columns: ColumnDef<ProductDetail>[] = useMemo(
        () => [
            {
                header: '#',
                id: 'index',
                cell: (props: any) => {
                    const { pageIndex, pageSize } = useAppSelector(
                        (state) => state.salesProductDetailList.data.tableData
                    );
                    const safePageIndex = pageIndex ?? 0;
                    const safePageSize = pageSize ?? 10;
                    const index = (safePageIndex - 1) * safePageSize + (props.row.index + 1); // Tính số thứ tự
                    return index;
                }
            },
            {
                header: 'Tên',
                accessorKey: 'product__name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <ProductDetailColumn row={row} />
                },
            },
            {
                header: 'Mã',
                accessorKey: 'product__code',
                cell: (props: any) => {
                    const row = props.row.original
                    return <p>{row.code}</p>
                },
            },
            {
                header: 'Màu Sắc',
                accessorKey: 'color__name',
                cell: (props: any) => {
                    const row = props.row.original
                    return (
                        <div className={'flex gap-2'}>
                            <span className=" block w-6 h-6 rounded-full"
                                  style={{
                                      backgroundColor: row.color.name
                                  }}>{

                            }
                            </span>
                            {row.color.name}
                        </div>
                    )
                },
            },
            {
                header: 'Kích Thước',
                accessorKey: 'size__name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.size.name}</span>
                },
            },
            {
                header: 'Thương hiệu',
                accessorKey: 'brand__name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className=" block h-5 rounded-xl">{row.brand.name}</span>
                },
            },
            {
                header: 'Xuất xứ',
                accessorKey: 'origin__name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <p className=" block  h-5 rounded-xl">{
                        row.origin.name
                    }
                    </p>
                },
            },
            {
                header: 'Chất liệu',
                accessorKey: 'material__name',
                cell: (props: any) => {
                    const row = props.row.original
                    return <p className=" block  h-5 rounded-xl">{
                        row.material.name
                    }
                    </p>
                },
            },
            {
                header: 'Giá',
                accessorKey: 'price',
                cell: (props: any) => {
                    const value = props.row.original.price;
                    if (typeof value !== 'number' || isNaN(value)) {
                        return <span>Không xác định</span>;
                    }

                    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                },
            },
            {
                header: 'Số Lượng',
                accessorKey: 'quantity',
                cell: (props: any) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.quantity}</span>
                },
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                cell: (props: any) => {
                    const { quantity } = props.row.original;
                    const status = getInventoryStatus(quantity);

                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={status.dotClass} />
                            <span
                                className={`capitalize font-semibold ${status.textClass}`}
                            >
                                {status.label}
                            </span>
                        </div>
                    );
                },
            },
            {
                header: 'Hành động',
                id: 'action',
                cell: (props: any) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData);
        newTableData.sort = {
            order: sort.order,
            key: (sort.key as string).replace('__', '.') // Thay thế '___' bằng dấu chấm
        };
        dispatch(setTableData(newTableData));
    };

    const handleIndeterminateCheckBoxChange = (checked: boolean, rows: Row<ProductDetail>[]) => {
        console.log('Indeterminate checkbox changed:', checked, rows);

        // Chuyển đổi các row thành mảng ProductDetail nếu cần
        const productDetails = rows.map(row => row.original);

        // Bây giờ bạn có thể sử dụng productDetails để xử lý logic của mình
        console.log('Converted ProductDetails:', productDetails);
    };
    const handleCheckBoxChange = (checked: boolean, row: ProductDetail) => {
        console.log('Checkbox changed:', checked, row);
    };



    return (
        <>
            {data.length > 0 ? (
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={data}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    loading={loading}
                    pagingData={{
                        total: tableData.total as number,
                        pageIndex: tableData.pageIndex as number,
                        pageSize: tableData.pageSize as number,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    onSort={onSort}
                    // selectable
                    onIndeterminateCheckBoxChange={handleIndeterminateCheckBoxChange}

                    onCheckBoxChange={handleCheckBoxChange}
                />
            ) : (
                <div className="flex flex-col justify-center items-center h-1/2">
                    <DoubleSidedImage
                        className="max-w-[200px]"
                        src="/img/others/image-removebg-preview-order-empty.png"
                        darkModeSrc="/img/others/image-removebg-preview-order-empty.png"
                    />
                    <div className="mt-4 text-2xl font-semibold">
                        Chưa có sản phẩm nào!!!
                    </div>
                </div>
            )
            }
            <ProducttDetailUpdateConfirmation />
            <ProductDetailDeleteConfirmation />
        </>
    )
}

export default ProductDetailTable
