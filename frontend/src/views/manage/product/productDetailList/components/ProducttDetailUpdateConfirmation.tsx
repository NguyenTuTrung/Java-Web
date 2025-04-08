import Button from '@/components/ui/Button';
import Loading from '@/components/shared/Loading'

import { toast } from 'react-toastify';
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import Dialog from '@/components/ui/Dialog';
import ProductDetailForm, {
    FormModel,
    SetSubmitting,
} from '@/views/manage/product/productDetailForm';
import {
    getProductDetails,
    updateProductDetailId,
    toggleUpdateConfirmation,
    useAppDispatch,
    useAppSelector,
    
} from '../store';
import isEmpty from 'lodash/isEmpty'

const ProducttDetailUpdateConfirmation = () => {
    const dispatch = useAppDispatch();

    const dialogOpen = useAppSelector(
        (state) => state.productDetailUpdate.updateProductDetailed.UpdateConfirmation
    );

    const loading = useAppSelector(
        (state) => state.productDetailUpdate.updateProductDetailed.loading
    );

    const dialogTitle = useAppSelector(
        (state) => state.productDetailUpdate.updateProductDetailed.productDetail?.product?.name
    );

    const selectedProduct = useAppSelector(
        (state) => state.productDetailUpdate.updateProductDetailed.productDetail
    );

    const tableData = useAppSelector(
        (state) => state.salesProductDetailList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleUpdateConfirmation(false));
    };


    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting 
    ) => {
        setSubmitting(true)
        const success = await updateProductDetailId(values, values.id)
        setSubmitting(false)
        if (success) {
            onDialogClose();
            dispatch(getProductDetails(tableData))
            toast.success(`Cập nhật thành công sản phẩm  ${dialogTitle} màu ${selectedProduct?.color?.name} (size ${selectedProduct?.size?.name})`);
        } else {
            onDialogClose();
            toast.error(`Lỗi cập nhật sản phẩm ${dialogTitle} màu ${selectedProduct?.color?.name} (size ${selectedProduct?.size?.name}) . Vui lòng thử lại.`);
        }
    }

    const handleDiscard = () => {
        console.log('Hủy bỏ thay đổi');
        onDialogClose(); 
    };

    return (

        <Dialog 
            isOpen={dialogOpen}
            width={'auto'}
            height={'auto'}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <div className="flex flex-col h-full justify-between">
                <h5 className="mb-4">{'Chi tiết sản phẩm ' + dialogTitle + ' màu ' + selectedProduct?.color?.name + '( size ' + selectedProduct?.size?.name +' )'  || 'Sản phẩm không tồn tại'}</h5>
                <Loading loading={loading}>
                    {!isEmpty(selectedProduct) && (

                            <ProductDetailForm
                            onFormSubmit={handleFormSubmit}
                                onDiscard={handleDiscard}
                                initialData={selectedProduct}
                            />
                    )}
                </Loading>
                {!loading && isEmpty(selectedProduct) && (
                    <div className="h-full flex flex-col items-center justify-center">
                        <DoubleSidedImage
                            src="/img/others/img-2.png"
                            darkModeSrc="/img/others/img-2-dark.png"
                            alt="No product found!"
                        />
                        <h3 className="mt-8">Không tìm thấy sản phẩm!</h3>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default ProducttDetailUpdateConfirmation;
