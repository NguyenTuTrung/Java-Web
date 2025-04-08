import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesCollarOverview, apiDeleteSalesCollar, apiCreateSalesCollar, apiGetCollarById, apiPutSalesCollar } from '@/services/ProductSalesService';

const CollarList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesCollarOverview}
                apiDelete={apiDeleteSalesCollar}
                apiAdd={apiCreateSalesCollar}
                apiGetByID={apiGetCollarById}
                apiUpdate={apiPutSalesCollar}
                lablel='kiểu cổ áo'
            />
        </>
    )
}

export default CollarList
