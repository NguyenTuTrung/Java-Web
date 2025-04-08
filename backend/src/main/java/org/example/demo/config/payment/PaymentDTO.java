package org.example.demo.config.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public abstract class PaymentDTO {

    @Getter
    @AllArgsConstructor // Generate a public constructor for all fields
    @Builder
    public static class VNPayResponse {
        private final String code;
        private final String message;
        private final String paymentUrl;
    }
}
