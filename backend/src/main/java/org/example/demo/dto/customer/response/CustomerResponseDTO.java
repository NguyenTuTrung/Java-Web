package org.example.demo.dto.customer.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.address.response.AddressResponseDTO;
import org.example.demo.entity.human.customer.Address;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerResponseDTO {
    private Integer id;

    private String code;

    private String name;

    private String email;

    private String phone;

    private String password;

    private Boolean deleted;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDay;

    private List<AddressResponseDTO> addressResponseDTOS;
}
