import { Category } from "../types/category.type"
import { SuccesRessponse } from "../types/ultils.type"
import http from "../utils/http"



const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccesRessponse<Category[]>>(URL)
  }
}

export default categoryApi