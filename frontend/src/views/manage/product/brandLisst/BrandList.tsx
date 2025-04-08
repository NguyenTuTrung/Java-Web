import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesBrandOverview, apiDeleteSalesBrand, apiCreateSalesBrand, apiGetBrandById, apiPutSalesBrand } from '@/services/ProductSalesService';

const BrandList = () => {
    return (
        <>
            <AttributeForm 
                apiFunc={apiGetSalesBrandOverview}
                apiDelete={apiDeleteSalesBrand}
                apiAdd={apiCreateSalesBrand}
                apiGetByID={apiGetBrandById}
                apiUpdate={apiPutSalesBrand}
                lablel='thương hiệu'
            />
        </>
    )
}

export default BrandList
 