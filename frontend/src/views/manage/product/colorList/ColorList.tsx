import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import {
    apiGetSalesColorOverview,
    apiDeleteSalesColor,
    apiGetColorById,
    apiPutSalesColor,
    apiCreateSalesColor
} from '@/services/ProductSalesService'

const ColorList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesColorOverview}
                apiDelete={apiDeleteSalesColor}
                apiAdd={apiCreateSalesColor}
                apiGetByID={apiGetColorById}
                apiUpdate={apiPutSalesColor}
                lablel='màu sắc'
            />
        </> 
    )
}

export default ColorList
