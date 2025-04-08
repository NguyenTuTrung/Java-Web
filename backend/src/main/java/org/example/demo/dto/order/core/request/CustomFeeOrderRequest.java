package org.example.demo.dto.order.core.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomFeeOrderRequest {
    private Integer orderId;
    private Double amount;
}
