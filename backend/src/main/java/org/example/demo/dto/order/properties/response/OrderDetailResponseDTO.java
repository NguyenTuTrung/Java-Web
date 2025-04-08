package org.example.demo.dto.order.properties.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDetailResponseDTO {
    private Integer id;
    private Integer quantity;
    private Double averageDiscountEventPercent;
    private Double unitPrice;
    private boolean deleted;
    private ProductDetailResponseDTO productDetailResponseDTO;
}
