package org.example.demo.dto.cart.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateCartDetailDTO {
    private Integer cartId;
    private Integer productDetailId;
    private Integer quantity;
}
