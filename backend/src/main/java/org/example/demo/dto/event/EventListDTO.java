package org.example.demo.dto.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventListDTO {
    private Integer id;
    private String discountCode;
    private String name; // tên sự kiện
    private Integer discountPercent; // phần trăm giảm giá
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime startDate;
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime endDate;
    private Integer quantityDiscount = 0;
    private String status; //
}
