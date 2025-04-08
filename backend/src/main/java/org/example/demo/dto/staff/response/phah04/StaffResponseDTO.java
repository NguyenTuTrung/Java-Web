package org.example.demo.dto.staff.response.phah04;

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
public class StaffResponseDTO {
    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;
}
