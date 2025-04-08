package org.example.demo.dto.cart.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartDetailResponseDTO {
    private Integer id;
    private String code;
    private String address;
    private String phone;
    private String recipientName;
    //
    private String provinceId;
    private String provinceName;
    private String districtId;
    private String districtName;
    private String wardId;
    private String wardName;
    //
    private Boolean deleted;
    private Double total;
    private Double deliveryFee;
    private Double discount;
    private Double subTotal;
    private Integer quantity;
    private ProductDetailResponseDTO productDetailResponseDTO;
}