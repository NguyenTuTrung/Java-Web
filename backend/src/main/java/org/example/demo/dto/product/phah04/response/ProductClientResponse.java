package org.example.demo.dto.product.phah04.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductClientResponse {
    private Integer id;
    private String code;
    private String name;
    private boolean deleted;
    private Integer quantity;
    private Double price;
    private String sizeName;
    private String colorName;
    private String productName;
    private String textureName;
    private String originName;
    private String brandName;
    private String collarName;
    private String sleeveName;
    private String materialName;
    private String thicknessName;
    private Double weightName;
}
