import ProductForm, {
    FormModel,
    SetSubmitting,
} from '@/views/manage/product/ProductForm'
import {
    DetailedProduct,
} from '@/views/manage/product/ProductForm/store'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateSalesProductDetail } from '@/services/ProductSalesService'

const ProductNew = () => {
    const navigate = useNavigate()

    const addProducts = async (data: DetailedProduct[]) => {
        try {

        const response = await apiCreateSalesProductDetail<boolean, FormModel>(data)
        return response.data
        } catch (error) {
            console.error('Error adding products:', error);
            toast.push(
                <Notification
                    title={'Error'} 
                    duration={2500}
                >
                    Không thể thêm sản phẩm. Vui lòng thử lại.
                </Notification>,
                {
                    placement: 'top-center',
                }
            );
            return false; // Trả về false nếu có lỗi
        }
    } 

    const handleFormSubmit = async (
        formData:   DetailedProduct[] , // Có thể là một đối tượng hoặc mảng
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true);
        const success = await addProducts(formData)
        setSubmitting(false);
            if (success) {
                toast.push(
                    <Notification
                        title={'Successfully added'}
                        type="success"
                        duration={2500}
                    >
                        Thêm thành công sản phẩm
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                );
                navigate('/admin/manage/product/');
            }
       
    };


    const handleDiscard = () => {
        navigate('/admin/manage/product/')
    }

    return (
        <>
            <ProductForm
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default ProductNew
 