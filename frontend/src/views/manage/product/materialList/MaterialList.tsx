import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesMaterialOverview, apiDeleteSalesMaterial, apiCreateSalesMaterial, apiGetMaterialById, apiPutSalesMaterial } from '@/services/ProductSalesService';

const MaterialList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesMaterialOverview}
                apiDelete={apiDeleteSalesMaterial}
                apiAdd={apiCreateSalesMaterial}
                apiGetByID={apiGetMaterialById}
                apiUpdate={apiPutSalesMaterial}
                lablel='chất liệu'
            />
        </>
    )
}

export default MaterialList
