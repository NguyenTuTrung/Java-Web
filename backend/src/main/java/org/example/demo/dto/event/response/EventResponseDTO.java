package org.example.demo.dto.event.response;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.entity.product.properties.Product;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventResponseDTO {
    private Integer discountPercent; // phần trăm giảm giá
    private LocalDate startDate;
    private LocalDate endDate;
    private String name; // tên sự kiện
    private String description;
    private Boolean status; //
//    private List<ProductResponseDTO> productResponseDTOS;
}
