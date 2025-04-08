package org.example.demo.dto.order.other;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.example.demo.entity.order.enums.Status;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RefundAndChangeStatusDTO {
    @NotNull
    private Double amount;
    @NotNull
    private String tradingCode;
    @NotNull
    private Status status;
}
