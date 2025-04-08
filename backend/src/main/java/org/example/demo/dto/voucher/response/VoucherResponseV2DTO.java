package org.example.demo.dto.voucher.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class VoucherResponseV2DTO {
    private Integer id;
    private String name;
    private String code;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Integer quantity;
    private Integer maxPercent;
    private Integer minAmount;
    private String typeTicket;
    private List<Integer> customers;
    private Integer countOrders;
}
