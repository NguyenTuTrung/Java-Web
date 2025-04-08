import Button from '@/components/ui/Button'
import { FaFileDownload, FaQrcode } from "react-icons/fa";

import ProductDetailTableSearch from './ProductDetailTableSearch'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import {
    generateQRCode,
    exportToExcel,
    useAppDispatch,
    useAppSelector,
} from '../store'
const ProductDetailTableTools = () => {
    const productDetailList = useAppSelector(
        (state) => state.salesProductDetailList.data.productDetailList
    )
    const handleExport = () => {
        
        exportToExcel(productDetailList);
        toast.success('Xuất thành công file sản phẩm chi tiết.');
    };
    const handleQRCode = () => {
        generateQRCode(productDetailList);
        toast.success('Tải thành công QR code sản phẩm.');
    };



    return (
        <div className="">
            <div className="flex-grow mb-4 lg:mb-0">
                <ProductDetailTableSearch />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col lg:ml-auto mt-4 lg:mt-0 lg:flex-row lg:justify-end lg:items-end">
                <div className="block lg:inline-block md:mx-2 md:mb-0 mb-4">
                    <Button block size="sm" onClick={handleExport} icon={<FaFileDownload />}>
                        Xuất Excel
                    </Button>
                </div>

                <div className="block lg:inline-block md:mx-2 md:mb-0 mb-4">
                    <Button block size="sm" onClick={handleQRCode} icon={<FaQrcode />}>
                        Xuất QR Code
                    </Button>
                </div>
            </div>
            </div>
        </div>


    )
}

export default ProductDetailTableTools
