package org.example.demo.dto.product.response.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.event.response.EventResponseDTO;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.entity.product.properties.Size;
import org.example.demo.util.event.EventUtil;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductResponseOverDTO {
    private Integer productId;
    private String productCode;
    private String productName;
    private Long countColor;
    private Long countSize;
    private Long discountPercent;
    private Double price;
    private List<String> image;
    private List<String> mass;
    private Double averageDiscountPercentEvent;
    private List<Color> listColor = new ArrayList<>();
    private List<Size> listSize = new ArrayList<>();
    private List<EventResponseDTO> listEvent = new ArrayList<>();

    public ProductResponseOverDTO(Integer productId, String productCode, String productName, Long countColor, Long countSize, Double price) {
        this.productId = productId;
        this.productCode = productCode;
        this.productName = productName;
        this.countColor = countColor;
        this.countSize = countSize;
        this.price = price;
    }
}
