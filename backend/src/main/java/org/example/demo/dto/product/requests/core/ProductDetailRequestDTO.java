package org.example.demo.dto.product.requests.core;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.requests.properties.*;
import org.example.demo.entity.product.properties.*;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailRequestDTO {

    private String code;
    private Double price;
    private Integer quantity;
    private Integer mass;
    private Boolean deleted;
    private SizeRequestDTO size;
    private ColorRequestDTO color;
    private ProductRequestDTO product;
    private TextureRequestDTO texture;
    private OriginRequestDTO origin;
    private BrandRequestDTO brand;
    private CollarRequestDTO collar;
    private SleeveRequestDTO sleeve;
    private StyleRequestDTO style;
    private MaterialRequestDTO material;
    private ThicknessRequestDTO thickness;
    private ElasticityRequestDTO elasticity;
    private List<ImageRequestDTO> images; //
}
