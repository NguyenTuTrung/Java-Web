package org.example.demo.service.cart;

import org.example.demo.dto.cart.request.CartRequestDTO;

public interface CartDetailService {

    Boolean deleteCartDetail(Integer id);

    String changeQuantity(CartRequestDTO cartRequestDTO);
}
