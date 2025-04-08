package org.example.demo.dto.product.response.core;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.dto.product.response.properties.*;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.entity.product.properties.Size;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailNonEventResponseDTO {
    private Integer id;
    private String code;
    private String name;
    private Double price;
    private Integer quantity;
    private Integer mass;
    private Boolean deleted;
    private Size size;
    private Color color;
    private ProductResponseNonEventDTO product;
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
