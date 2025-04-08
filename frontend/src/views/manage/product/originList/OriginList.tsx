import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesOriginOverview, apiDeleteSalesOrigin, apiCreateSalesOrigin, apiGetOriginById, apiPutSalesOrigin } from '@/services/ProductSalesService';

const OriginList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesOriginOverview}
                apiDelete={apiDeleteSalesOrigin}
                apiAdd={apiCreateSalesOrigin}
                apiGetByID={apiGetOriginById}
                apiUpdate={apiPutSalesOrigin}
                lablel='xuất xứ'
            />
        </>
    )
}

export default OriginList
