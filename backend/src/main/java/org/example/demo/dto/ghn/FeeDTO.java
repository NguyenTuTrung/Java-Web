package org.example.demo.dto.ghn;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FeeDTO {
    private int service_type_id;
    private int from_district_id;
    private int to_district_id;
    private String to_ward_code;
    private int height;
    private int length;
    private int weight;
    private int width;
    private int insurance_value;
    private String coupon;
    private List<ItemDTO> items;
}
