import { Link } from 'react-router-dom'
import path from '../../constants/path'
import { formatCurrency, generateNameId } from '../../utils/util'
import ProductRating from '../../components/ProductRating/Product'
import { Product as ProductType } from '../../types/product.type'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link  to={`${path.home}${generateNameId({name : product.name, id : product._id})} `}>
      <div className='overflow-hidden bg-white shadow rounded-sm hover:translate-y-[-0.0625rem] hover:shadow-md duration-100 transition-transform'>
        <div className='w-full pt-[100%] relative'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
          />
        </div>
        <div className='p-2  overflow-hidden'>
          <div className='min-h-[1.75] line-clamp-2'>
            {product.name}          </div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] truncate text-gray-500'>{formatCurrency(product.price_before_discount)}</div>
            <div className='text-orange truncate ml-1'>
              <span className='text-xs'>Đ</span>
              <span>{product.price}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end '>
            <div className='flex items-center'>
           <ProductRating rating={product.rating} />
              <div className='ml-2 text-sm'>
                <span>{product.sold}</span>
                <span className='ml-1'>Đã bán</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}