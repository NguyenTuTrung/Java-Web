package org.example.demo.dto.product.response.properties;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.event.EventDTO;
import org.example.demo.entity.event.Event;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductResponseDTO {
    private Integer id;
    private String code;
    private String name;
    private Boolean deleted;
    private String description;
    private double nowAverageDiscountPercentEvent;
    @JsonFormat( shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;
    @JsonFormat( shape = JsonFormat.Shape.STRING)
    private  LocalDateTime updatedDate;
    private List<EventDTO> eventDTOList = new ArrayList<>();

}
