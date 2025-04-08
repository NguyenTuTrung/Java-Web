import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductDetailTable from './components/ProductDetailTable'
import ProductTableTools from './components/ProductDetailTableTools'
injectReducer('salesProductDetailList', reducer)
injectReducer('productDetailUpdate', reducer)
injectReducer('datas', reducer);

const ProductDetailList = () => {
  

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <h3 className="mb-4 lg:mb-0">SẢN PHẨM CHI TIẾT</h3>
            <div className='mb-5 mt-5'>
                <ProductTableTools />

            </div>
            <ProductDetailTable />
        </AdaptableCard>
    )
}

export default ProductDetailList
