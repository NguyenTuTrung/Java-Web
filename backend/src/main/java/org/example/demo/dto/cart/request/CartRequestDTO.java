package org.example.demo.dto.cart.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequestDTO {
    private Integer id;
    private Integer quantity;
    private Integer productDetail;
}
