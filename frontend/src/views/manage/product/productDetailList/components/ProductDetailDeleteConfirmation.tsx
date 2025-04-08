
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { toast } from 'react-toastify';
import {
    deleteProductDetail,
    toggleDeleteConfirmation, 
    getProductDetails,
    useAppDispatch, 
    useAppSelector,
} from '../store'

const ProductDetailDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector( 
        (state) => state.salesProductDetailList.data.deleteConfirmation
    )
    const selectedProduct = useAppSelector(
        (state) => state.salesProductDetailList.data.selectedProductDetail
    )
   
    const tableData = useAppSelector(
        (state) => state.salesProductDetailList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteProductDetail({ id: selectedProduct })
        if (success) {
        dispatch(getProductDetails(tableData))
            toast.success('Cập nhật trạng thái thành công');
        }else{
            toast.error('Lỗi cập nhật trạng thái. Vui lòng thử lại.');
        }
    }
 
    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title="Xóa sản phẩm"
            cancelText='Hủy'
            confirmText='Xác nhận'
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Bạn có chắc chắn muốn ngừng bán sản phẩm này không? Tất thông tin sản phẩm liên quan
                đến sản phẩm này cũng sẽ bị xóa.
            </p>
        </ConfirmDialog>
    )
}

export default ProductDetailDeleteConfirmation
