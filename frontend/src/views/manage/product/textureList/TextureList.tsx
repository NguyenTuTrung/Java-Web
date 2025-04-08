import AttributeForm, {
} from '@/views/manage/product/AttributeForm'
import { apiGetSalesTextureOverview, apiDeleteSalesTexture, apiCreateSalesTexture, apiGetTextureById, apiPutSalesTexture } from '@/services/ProductSalesService';

const TextureList = () => {
    return (
        <>
            <AttributeForm
                apiFunc={apiGetSalesTextureOverview}
                apiDelete={apiDeleteSalesTexture}
                apiAdd={apiCreateSalesTexture}
                apiGetByID={apiGetTextureById}
                apiUpdate={apiPutSalesTexture}
                lablel='kết cấu'
            />
        </>
    )
}

export default TextureList
