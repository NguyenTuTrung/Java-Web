package org.example.demo.dto.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerListDTO {

    private int id;
    private String code;
    private String name;
    private String email;
    private String phone;
    private String gender;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    private AddressDTO defaultAddress;

    private String status;
}
