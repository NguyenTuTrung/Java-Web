package org.example.demo.dto.auth.response;


import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.customer.response.CustomerResponseDTO;
import org.example.demo.dto.staff.response.phah04.StaffResponseDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.role.Role;
import org.example.demo.entity.human.staff.Staff;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountResponseDTO {
    private Integer id;
    private String username;
    private String status;
    private Boolean enabled;
    private String roleName;
    private Role role;
    private String provider;
    private String socialId;
    private StaffResponseDTO staff;
    private CustomerResponseDTO customer;
}
