package org.example.demo.dto.staff.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffResponseDTO {
    private Integer id;
    private String code;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String citizenId;
    private String address;
    private String province;
    private String district;
    private String ward;
    private String status;
    private Boolean gender;
    private String note;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDay;
    private Boolean deleted;
}
