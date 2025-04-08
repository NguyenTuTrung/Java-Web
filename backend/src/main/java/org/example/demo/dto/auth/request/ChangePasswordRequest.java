package org.example.demo.dto.auth.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ChangePasswordRequest {
    String currentPassword;
    String newPassword;
}
