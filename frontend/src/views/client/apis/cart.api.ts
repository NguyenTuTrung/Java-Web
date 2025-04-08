import { Cart } from "../types/cart.type";
import { SuccesRessponse } from "../types/ultils.type";
import http from "../utils/http";

const URL = 'cart';

const cartApi = {
  // Add a product to the cart
  addToCart(body: { cartId: number; quantity: number; productDetail: number }) {
    return http.post<SuccesRessponse<Cart>>(`${URL}/add-to-cart`, body);
  },

  // Retrieve all cart items for a specific customer
  getListCart(idCustomer: number) {
    return http.get<SuccesRessponse<Cart[]>>(`${URL}/${idCustomer}`);
  },

  // Delete a specific cart item by its ID
  deleteCart(id: number) {
    return http.delete<SuccesRessponse<null>>(`${URL}/${id}`);
  },

  // Update the details of a specific cart item
  updateCart(body: { cartId: number; quantity: number; productDetail: number }) {
    return http.put<SuccesRessponse<Cart>>(`${URL}`, body);
  },

  // Delete all cart items for a specific customer
  deleteAllCart(idCustomer: number) {
    return http.delete<SuccesRessponse<null>>(`${URL}/delete-all/${idCustomer}`);
  },
};

export default cartApi;
