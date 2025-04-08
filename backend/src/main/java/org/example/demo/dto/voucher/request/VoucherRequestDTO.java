package org.example.demo.dto.voucher.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.voucher.enums.Type;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherRequestDTO {
    private String code;

    @NotNull(message = "Name must not be empty!")
    private String name;

    @NotNull(message = "Quantity must not be empty!")
    private Integer quantity;

    private String status;

    @NotNull(message = "Min amount must not be empty!")
    private Integer minAmount;

    @NotNull(message = "Max percent must not be empty!")
    private Integer maxPercent;

    @NotNull(message = "Please select the voucher type!")
    private Type typeTicket;

    @NotNull(message = "Start date must not be empty!")
    private LocalDate startDate;

    @NotNull(message = "End date must not be empty!")
    private LocalDate endDate;

    private Boolean deleted = false;

    private List<Integer> customers;
}
