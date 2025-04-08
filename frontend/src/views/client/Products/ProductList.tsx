import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios';
import useQueryConfig from '../hooks/useQueryConfig';
import AsideFilter from './AsideFilter/AsideFilter'
import SortProductList from './SortProductList/SortProductList'
import { ProductList, ProductListConfig } from '../types/product.type';
import { SuccesRessponse } from '../types/ultils.type';
import Pagination from '../components/Paginate/Paginate';
import Product from './Product/Product';
import productApi from '../apis/product.api';
import categoryApi from '../apis/category.api';
import { Fragment } from 'react/jsx-runtime';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';


export default function ProductList1() {
  const queryConfig = useQueryConfig()

  const { data: productsData }: { data?: AxiosResponse<SuccesRessponse<ProductList>> } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),

    staleTime: 3 * 60 * 1000,
    // keepPreviousData: true,
  });

  const pageSize = productsData?.data?.data?.pagination?.page_size || 0;

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <Fragment>
      {/* Breadcrumb */}
      <div className="py-2 bg-gray-100">
        <div className="container mx-auto ml-20">
          <Breadcrumb />
        </div>
      </div>

      {/* Main content */}
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 gap-6">

            {/* Aside Filter */}
            <div className="col-span-3">
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>

            {/* Product list and Pagination */}
            <div className="col-span-9">
              <SortProductList queryConfig={queryConfig} pageSize={pageSize} />

              {/* Product grid */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {productsData && productsData.data.data.products.map((product) => (
                  <div className="col-span-1" key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination queryConfig={queryConfig} pageSize={pageSize} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>

  )
}
