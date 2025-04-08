package org.example.demo.dto.staff.request;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffRequestDTO {

    private Integer id;

    private String code;

    private String name;

    private String email;

    private String phone;

    private String citizenId;

    private String address;
    private String province;
    private String district;
    private String ward;
    private String note;

    private Boolean deleted;
    private Boolean gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDay;

    private String status;

    @JsonProperty("role_id")
    private Integer roleId = 52;
}