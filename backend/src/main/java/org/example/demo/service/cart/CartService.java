package org.example.demo.service.cart;

import org.example.demo.dto.cart.request.CartRequestDTO;
import org.example.demo.dto.cart.response.CartResponseDTO;
import org.example.demo.infrastructure.common.ResponseObject;

import java.util.List;

public interface CartService {
    List<CartResponseDTO> getListCart(Integer idCustomer);

    ResponseObject create(CartRequestDTO requestDTO);

    ResponseObject update(CartRequestDTO requestDTO);
    ResponseObject deleteById(Integer idCartDetail);

    ResponseObject deleteAll(Integer idCustomer);
}
