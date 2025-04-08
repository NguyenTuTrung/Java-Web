package org.example.demo.dto.order.core.request;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.voucher.core.Voucher;
import org.hibernate.validator.constraints.Length;

/**
 * The type Staff response dto.
 * BY PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderRequestDTO {

    private String code;

    private String address;

    private String phone;

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
