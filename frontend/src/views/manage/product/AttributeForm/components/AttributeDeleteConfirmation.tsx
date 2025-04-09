import { toast } from 'react-toastify';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import {
    toggleDeleteConfirmation,
    deleteAttribute,
    getAttributes,
    useAppDispatch,
    useAppSelector,
} from '../store';

type ProductDeleteConfirmationProps = {
    lablel:string;
    apiFunc: any;
    apiDelete: (param: { id: string; }) => Promise<{ status: number; }>
};

const ProductDeleteConfirmation = ({ apiFunc, apiDelete, lablel }: ProductDeleteConfirmationProps) => {
    const dispatch = useAppDispatch();
    const dialogOpen = useAppSelector(
        (state) => state.salesAttributeList.data.deleteConfirmation
    );
    const selectedProduct = useAppSelector(
        (state) => state.salesAttributeList.data.selectedAttribute
    );

    const tableData = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    );

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false));
    };
    
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesAttributeList.data.tableData
    )

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false));
        const success = await deleteAttribute(apiDelete, { id: selectedProduct });
        if (success) {
            const requestData = { pageIndex, pageSize, sort, query };
            dispatch(getAttributes({ apiFunc, requestData }));
            toast.success('Cập nhật trạng thái thành công');
        } else {
            toast.error('Lỗi cập nhật trạng thái. Vui lòng thử lại.');
        }

    };


    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title={`Xóa ${lablel}`  }
            confirmButtonColor="red-600"
            cancelText='Hủy'
            confirmText='Xác nhận'
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                Bạn có chắc chắn muốn ngừng sử dụng {lablel} này không? Tất cả sản phẩm chi tiết liên quan
                đến {lablel} này cũng sẽ bị xóa.
            </p>
        </ConfirmDialog>
    );
};

export default ProductDeleteConfirmation;
