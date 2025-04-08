package org.example.demo.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {

    private int id;

    private String name;

    private String phone;

    private Integer provinceId;

    private String province;

    private Integer districtId;

    private String district;

    private String wardId;

    private String ward;

    private String detail;

    private Boolean isDefault;

    private LocalDateTime createdDate;
}
