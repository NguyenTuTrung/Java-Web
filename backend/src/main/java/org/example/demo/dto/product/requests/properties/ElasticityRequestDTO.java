package org.example.demo.dto.product.requests.properties;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ElasticityRequestDTO {
    private Integer id;
    private String code;
    private String name;
    private Boolean deleted;

}
