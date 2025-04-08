package org.example.demo.dto.history.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.demo.entity.voucher.enums.Type;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class VoucherRequest {

    @NotNull(message = "Code must not be empty!")
    private String code;

    @NotNull(message = "Name must not be empty!")
    private String name;

    @NotNull(message = "Quantity must not be empty!")
    private Integer quantity;

    @NotNull(message = "Status must not be empty!")
    private String status;

    @NotNull(message = "Min amount must not be empty!")
    private Integer minAmount;

    @NotNull(message = "Max percent must not be empty!")
    private Integer maxPercent;

    @NotNull(message = "Please select the voucher type!")
    private Type typeTicket;

    @NotNull(message = "Start date must not be empty!")
    private LocalDateTime startDate;

    @NotNull(message = "End date must not be empty!")
    private LocalDateTime endDate;

    private Boolean deleted = false;

    @NotNull(message = "Please select at least one customer!")
    private List<Integer> customers;
}