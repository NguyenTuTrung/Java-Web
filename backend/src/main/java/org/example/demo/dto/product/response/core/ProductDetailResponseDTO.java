package org.example.demo.dto.product.response.core;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.response.properties.*;
import org.example.demo.entity.product.properties.*;
import org.example.demo.util.event.EventUtil;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailResponseDTO {
    private Integer id;
    private String code;
    private String name;
    private Double price;
    private Integer quantity;
    private Integer mass;
    private Boolean deleted;
    private Size size;
    private Color color;
    private ProductResponseDTO product;
    private TextureResponseDTO texture;
    private OriginResponseDTO origin;
    private BrandResponseDTO brand;
    private CollarResponseDTO collar;
    private SleeveResponseDTO sleeve;
    private StyleResponseDTO style;
    private MaterialResponseDTO material;
    private ThicknessResponseDTO thickness;
    private ElasticityResponseDTO elasticity;
    private List<ImageResponseDTO> images;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime modifiedDate;
}
