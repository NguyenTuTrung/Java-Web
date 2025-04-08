import { Product } from "./product.type"

export interface Cart {
    _id: string
    quantity: number
    product: Product
   
  }
  