package org.example.demo.dto.cart.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.example.demo.entity.cart.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.voucher.core.Voucher;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartRequestDTOV2 {
    private String code;

    private String address;

    private String phone;

    private String email;

    private String recipientName;

    private Boolean deleted;

    private Double total;

    private Double subTotal;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private Payment payment;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Integer provinceId;

    private String provinceName;

    private Integer districtId;

    private String districtName;

    private String wardId;

    private String wardName;

    private Voucher voucher;

    private Customer customer;


    private Boolean waitPayment;


    private Integer paymentMethod;

    private String tradingCode;
}
