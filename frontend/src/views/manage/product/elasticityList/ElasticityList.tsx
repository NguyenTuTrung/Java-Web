import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesElasticityOverview, apiDeleteSalesElasticity, apiCreateSalesElasticity, apiGetElasticityById, apiPutSalesElasticity } from '@/services/ProductSalesService';

const ElasticityList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesElasticityOverview}
                apiDelete={apiDeleteSalesElasticity}
                apiAdd={apiCreateSalesElasticity}
                apiGetByID={apiGetElasticityById}
                apiUpdate={apiPutSalesElasticity}
                lablel='độ co giãn'
            />
        </>
    )
}

export default ElasticityList
