package org.example.demo.dto.cart.response;

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
import org.example.demo.entity.cart.enums.Status;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Type;

import java.util.List;

/**
 * The type Staff response dto.
 * BY PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartResponseDTO {
    private Integer id;
    private String code;
    private String address;
    private String phone;
    private String email;
    private String recipientName;
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
    private Double deliveryFee;
    private Double discount;
    private Double subTotal;
    private CustomerResponseDTO customerResponseDTO;
    private VoucherResponseDTO voucherResponseDTO;
    private List<CartDetailResponseDTO> cartDetailResponseDTOS;
}
