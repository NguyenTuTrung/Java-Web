import { Product, ProductList, ProductListConfig } from "../types/product.type"
import { SuccesRessponse } from "../types/ultils.type"
import http from "../utils/http"


const URL = 'productDetails'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccesRessponse<ProductList>>(`${URL}/abc`, {
      params
    })
  },
  getProductDetail(id: number) {
    return http.get<SuccesRessponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi