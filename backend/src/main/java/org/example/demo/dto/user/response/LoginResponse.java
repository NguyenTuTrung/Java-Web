package org.example.demo.dto.user.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("token")
    private String token;

    @JsonProperty("refresh_token")
    private String refreshToken;
    private String tokenType = "Bearer";
    //user's detail
    private Integer id;
    private String username;

    private List<String> roles;
}
