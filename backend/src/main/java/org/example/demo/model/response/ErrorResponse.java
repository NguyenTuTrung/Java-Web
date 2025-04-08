package org.example.demo.model.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class ErrorResponse {
    private String message;
    private String status = "error";


    public ErrorResponse(String s) {
    }
}