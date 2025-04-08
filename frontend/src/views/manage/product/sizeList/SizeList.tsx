import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesSizeOverview, apiDeleteSalesSize, apiCreateSalesSize, apiGetSizeById, apiPutSalesSize } from '@/services/ProductSalesService';

const SizeList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesSizeOverview}
                apiDelete={apiDeleteSalesSize}
                apiAdd={apiCreateSalesSize}
                apiGetByID={apiGetSizeById}
                apiUpdate={apiPutSalesSize}
                lablel='kích thước'
            />
        </>
    )
}

export default SizeList
