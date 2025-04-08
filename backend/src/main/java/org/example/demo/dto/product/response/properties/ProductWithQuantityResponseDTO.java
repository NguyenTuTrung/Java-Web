package org.example.demo.dto.product.response.properties;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.example.demo.entity.product.properties.Product;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {Product.class})
public interface ProductWithQuantityResponseDTO {
    Integer getId();
    String getCode();
    String getName();
    Boolean getDeleted();
    Integer getQuantity();
    @JsonFormat(pattern = "dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    LocalDateTime getCreatedDate();
    @JsonFormat(pattern = "dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    LocalDateTime getModifiedDate();


}
