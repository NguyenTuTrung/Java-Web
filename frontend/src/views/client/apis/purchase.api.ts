import { Purchase, PurchaseListStatus } from '../types/purchase.type'
import { SuccesRessponse } from "../types/ultils.type"
import http from "../utils/http"
const URL = 'cart'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccesRessponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccesRessponse<Purchase[]>>(`${URL}`, {
      params
    })
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    return http.post<SuccesRessponse<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccesRessponse<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccesRessponse<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIds
    })
  }
}

export default purchaseApi