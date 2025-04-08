package org.example.demo.dto.voucher.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponseDTO {

    private Integer id;
    private String name;
    private String code;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long quantity;
    private Integer maxPercent;
    private Double minAmount;
    private String typeTicket;
    private boolean deleted;
    private Integer countOrders;
}
