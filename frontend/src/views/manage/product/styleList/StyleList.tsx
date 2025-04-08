import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesStyleOverview, apiDeleteSalesStyle, apiCreateSalesStyle, apiGetStyleById, apiPutSalesStyle } from '@/services/ProductSalesService';

const StyleList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesStyleOverview}
                apiDelete={apiDeleteSalesStyle}
                apiAdd={apiCreateSalesStyle}
                apiGetByID={apiGetStyleById}
                apiUpdate={apiPutSalesStyle}
                lablel='kiểu dáng'
            />
        </>
    )
}

export default StyleList
