package org.example.demo.dto.cart.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UseCartVoucherDTO {
    @NotNull(message = "NotNull")
    private Integer idCartId;
    @NotNull(message = "NotNull")
    private String voucherCode;
}