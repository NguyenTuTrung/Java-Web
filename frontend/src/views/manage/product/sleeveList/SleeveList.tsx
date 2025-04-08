import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesSleeveOverview, apiDeleteSalesSleeve, apiCreateSalesSleeve, apiGetSleeveById, apiPutSalesSleeve } from '@/services/ProductSalesService';

const SleeveList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesSleeveOverview}
                apiDelete={apiDeleteSalesSleeve}
                apiAdd={apiCreateSalesSleeve}
                apiGetByID={apiGetSleeveById}
                apiUpdate={apiPutSalesSleeve}
                lablel='kiểu tay áo'
            />
        </>
    )
}

export default SleeveList
