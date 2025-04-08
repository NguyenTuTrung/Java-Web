package org.example.demo.model.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.demo.entity.voucher.enums.Type;
import org.example.demo.infrastructure.common.PageableRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class VoucherRequest extends PageableRequest {

    private String code;

    @NotBlank(message = "Name must not be empty!")
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

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "Start date must not be empty!")
    private LocalDateTime startDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "End date must not be empty!")
    private LocalDateTime endDate;


    private Boolean deleted = false;

    private List<Integer> customers;
}
