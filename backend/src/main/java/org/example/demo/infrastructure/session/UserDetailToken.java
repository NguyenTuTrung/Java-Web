package org.example.demo.infrastructure.session;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


// test sửa thoải mái =))
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetailToken {
    private String fullName;
    private String email;
    private Integer id;
    private String role;
}
