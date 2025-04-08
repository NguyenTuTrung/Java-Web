import { toast } from 'react-toastify';
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteProduct,
    getProducts,
    useAppDispatch,
    useAppSelector, 
} from '../store'

const ProductDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.salesProductList.data.deleteConfirmation
    )
    const selectedProduct = useAppSelector(
        (state) => state.salesProductList.data.selectedProduct
    )

    const tableData = useAppSelector(
        (state) => state.salesProductList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteProduct({ id: selectedProduct })
        console.log(success)
        if (success) {
            dispatch(getProducts(tableData))
            toast.success('Cập nhật trạng thái thành công');
        } else {
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
                Bạn có chắc chắn muốn ngừng bán sản phẩm này không? Tất sản phẩm chi tiết liên quan
                đến sản phẩm này cũng sẽ bị xóa. 
            </p>
        </ConfirmDialog>
    )
}

export default ProductDeleteConfirmation
