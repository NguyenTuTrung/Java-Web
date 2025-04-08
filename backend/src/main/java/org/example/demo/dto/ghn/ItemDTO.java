package org.example.demo.dto.ghn;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ItemDTO {
    private String name;
    private Integer quantity;
    private Integer height;
    private Integer weight;
    private Integer length;
    private Integer width;
}
