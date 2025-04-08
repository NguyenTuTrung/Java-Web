package org.example.demo.dto.product.response.properties;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ElasticityResponseDTO {
    private Integer id;
    private String code;
    private String name;
    private Boolean deleted;
    @JsonFormat( shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;
    @JsonFormat( shape = JsonFormat.Shape.STRING)
    private  LocalDateTime modifiedDate;


}
