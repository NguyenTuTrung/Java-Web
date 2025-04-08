package org.example.demo.dto.auth.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationToken {
    private String code;
    private LocalDateTime expiryTime;
}
