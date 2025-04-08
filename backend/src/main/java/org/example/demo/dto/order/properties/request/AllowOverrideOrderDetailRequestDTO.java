package org.example.demo.dto.order.properties.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AllowOverrideOrderDetailRequestDTO {
    @NotNull(message = "NotNull")
    @PositiveOrZero(message = "PositiveOrZero")
    private Integer productDetailId;

    @NotNull(message = "NotNull")
    @PositiveOrZero(message = "PositiveOrZero")
    private Integer orderId;
}
