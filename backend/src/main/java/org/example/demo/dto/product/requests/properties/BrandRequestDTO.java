package org.example.demo.dto.product.requests.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BrandRequestDTO {
    private Integer id;
    private String code;
    private String name;
    private Boolean deleted;

}
