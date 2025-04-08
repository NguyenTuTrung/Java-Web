package org.example.demo.dto.auth.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountRequestDTO {

    private String username;
    private String password;
    private String status;
    private Boolean enabled;
    private String provider;
    private String socialId;

    @JsonProperty("role_id")
    private Integer roleId;
}
