import { Link } from 'react-router-dom'
import { OrderTable } from './component/core/OrderTable'

const OrderManage = () => {
    return (
        <div className="bg-white h-full">
            <div className="p-5 rounded-md card h-full card-border">
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
                                    <span className="text-gray-500">Hóa đơn</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div>
                    <OrderTable></OrderTable>
                </div>
            </div>
        </div>
    )
}

export default OrderManage