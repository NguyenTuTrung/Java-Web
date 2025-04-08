package org.example.demo.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SuccessResponse {
    private String message;
    private String status = "success";

    public SuccessResponse(String passwordResetSuccessfully) {
    }
}
