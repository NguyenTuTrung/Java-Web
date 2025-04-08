import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import { FaFileDownload } from "react-icons/fa";
import ProductTableSearch from './ProductTableSearch'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useEffect, useMemo, useRef, ReactNode, ChangeEvent } from 'react'
import {
    exportToExcel,
    useAppDispatch,
    useAppSelector,
    getProducts
} from '../store'
import { useHasRole } from '@/utils/permission'
const ProductTableTools = () => {
    const dispatch = useAppDispatch()


    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesProductList.data.tableData
    )
    const productDetailList = useAppSelector(
        (state) => state.salesProductList.data.product
    )
    useEffect(() => {
        dispatch(getProducts({ pageIndex, pageSize, sort, query, fetchAll: true }))
    }, [])
    const handleExport = () => {
        exportToExcel(productDetailList);
        toast.success('Xuất thành công file sản phẩm.');
    };
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-grow mb-4 lg:mb-0">
                <ProductTableSearch />
            </div>
            <div className="flex-shrink-0 flex">
                <div
                    className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                >
                    <Button block size="sm" onClick={handleExport} icon={<FaFileDownload />}>
                        Xuất Excel
                    </Button>

                </div>

                <div hidden={!useHasRole(["ROLE_ADMIN"])}>
                    <Link
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/admin/manage/product/product-new"
                    >
                        <Button
                            size='sm'
                            block
                            variant="solid"
                            style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                            className='flex items-center justify-center gap-2 button-bg-important'
                            icon={<HiPlusCircle />}
                        >
                            Thêm Sản Phẩm
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default ProductTableTools
