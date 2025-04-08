package org.example.demo.dto.order.core.response;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.customer.response.CustomerResponseDTO;
import org.example.demo.dto.history.response.HistoryResponseDTO;
import org.example.demo.dto.order.properties.response.OrderDetailResponseDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.util.number.NumberUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderResponseDTO {
    private static final Logger log = LoggerFactory.getLogger(OrderResponseDTO.class);
    private Integer id;
    private String code;
    private String address;
    private String phone;
    private String email;
    private String recipientName;
    private Boolean isPayment;
    //
    private String provinceId;
    private String provinceName;
    private String districtId;
    private String districtName;
    private String wardId;
    private String wardName;
    //
    private Boolean deleted;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Type type;
    @Enumerated(EnumType.STRING)
    private Payment payment;
    private Double total;
    private Boolean inStore;
    private Double totalPaid;
    private Double deliveryFee;
    private Double discount;
    private Double subTotal;
    private Double surcharge;
    private Double refund;
    private Double totalAfterDiscountAndFee;
    private Double discountVoucherPercent;
    private Double voucherMinimumSubtotalRequired;

    private CustomerResponseDTO customerResponseDTO;
    private StaffResponseDTO staffResponseDTO;
    private VoucherResponseDTO voucherResponseDTO;
    private List<OrderDetailResponseDTO> orderDetailResponseDTOS;
    private List<HistoryResponseDTO> historyResponseDTOS;

    private LocalDateTime createdDate;



    public Double getRefund() {
        // tổng tiền sau trừ giảm giá voucher và cộng ship
        double total_after_discount_and_fee = subTotal - discount + deliveryFee;
        // tính tiền trả lại
        double range = totalPaid - total_after_discount_and_fee;
        log.info("RANGE 1: " + range);
        return range >= 0 && isPayment ? NumberUtil.roundDouble(range) : 0.0;
    }

    public Double getSurcharge() {
        // tổng tiền sau trừ giảm giá voucher và cộng ship
        double total_after_discount_and_fee = subTotal - discount + deliveryFee;
        double range = total_after_discount_and_fee - totalPaid;
        log.info("RANGE 2: " + range);
        return range >= 0 && isPayment ? NumberUtil.roundDouble(range) : 0.0;
    }

    public Double getTotalAfterDiscountAndFee() {
        return subTotal - discount + deliveryFee;
    }

    public List<OrderDetailResponseDTO> getOrderDetailResponseDTOS() {
        return orderDetailResponseDTOS.stream().filter(s -> !s.isDeleted()).toList();
    }

}
