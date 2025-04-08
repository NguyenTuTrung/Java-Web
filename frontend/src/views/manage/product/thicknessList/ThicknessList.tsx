import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesThicknessOverview, apiDeleteSalesThickness, apiCreateSalesThickness, apiGetThicknessById, apiPutSalesThickness } from '@/services/ProductSalesService';

const ThicknessList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesThicknessOverview}
                apiDelete={apiDeleteSalesThickness}
                apiAdd={apiCreateSalesThickness}
                apiGetByID={apiGetThicknessById}
                apiUpdate={apiPutSalesThickness}
                lablel='độ dày'
            />
        </>
    )
}

export default ThicknessList
