package org.example.demo.dto.order.core.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;

import java.time.LocalDateTime;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderOverviewResponseDTO {
    private Integer id;
    private String code;
    private String address;
    private String phone;
    private String email;
    private String recipientName;
    private Boolean deleted;
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime updatedDate;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Type type;
    @Enumerated(EnumType.STRING)
    private Boolean inStore;
    private Payment payment;
    private Double total;
    private Double totalPaid;
    private Double deliveryFee;
    private Double subTotal;
    private Double discount;
    private String customerName;
    private String staffName;
    //
    private String provinceId;
    private String provinceName;
    private String districtId;
    private String districtName;
    private String wardId;
    private String wardName;
    //
    private Boolean isPayment;
    private Double discountVoucherPercent;
    private Double voucherMinimumSubtotalRequired;
}
