package org.example.demo.dto.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.mchien.ProductDTO;
import org.example.demo.entity.product.properties.Product;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {

    private Integer id;

    private String discountCode;

    private String name; // tên sự kiện

    private Integer discountPercent; // phần trăm giảm giá

    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime startDate;

    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime endDate;

    private Integer quantityDiscount; // so luong phai tinh dua tren san pham dc chon

    private String status;

    private List<ProductDTO> productDTOS; // danh sach ma sp dc chon
}
