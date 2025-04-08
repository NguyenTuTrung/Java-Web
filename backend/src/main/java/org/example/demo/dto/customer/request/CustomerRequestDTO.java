package org.example.demo.dto.customer.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.human.customer.Address;

import java.time.LocalDate;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerRequestDTO {
    private String code;

    private String name;

    private String email;

    private String phone;

    private String password;

    private Boolean deleted;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDay;

    private List<Address> addresses;
}
