import reducer from './store'
import {injectReducer} from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductTable from './components/ProductTable'
import ProductTableTools from './components/ProductTableTools'
import {Link} from "react-router-dom";

injectReducer('salesProductList', reducer)

const ProductList = () => {
    return (
        <div className="bg-white h-full">
            <div className="rounded-md card h-full card-border  p-5">
                <div className="lg:flex items-center justify-between mb-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li>
                                <div className="flex items-center">
                                    <Link to="/" className="text-gray-700 hover:text-blue-600">
                                        Trang Chủ
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <Link to="/manage" className="text-gray-700 hover:text-blue-600">
                                        Quản Lý
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-500">Sản phẩm</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                <h1 className="font-semibold text-xl mb-4 text-transform: uppercase">Quản lý sản phẩm</h1>
                <div className='mb-5 mt-6'>
                    <ProductTableTools />
                </div>
                <ProductTable />
            </div>
        </div>

    )
}

export default ProductList
