package org.example.demo.dto.address.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddressResponseDTO {
    private Integer id;

    private String phone;

    private String name;

    private String provinceId;

    private String province;

    private String districtId;

    private String district;

    private String wardId;

    private String ward;

    private String detail;

    private Boolean defaultAddress;

}
