package org.example.demo.dto.auth.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ForgotPasswordDTO {
    private String email;
    private String verificationCode;
    private String newPassword;
}