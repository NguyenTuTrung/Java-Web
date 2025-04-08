package org.example.demo.dto.product.phah04.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.response.EventResponseDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.product.properties.Image;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductOverviewResponse {
    private Integer id;
    private String code;
    private String name;
    private boolean deleted;
    private Integer quantity;
    private Double price;
    private Integer mass;
    private String sizeName;
    private String colorName;
    private String productName;
    private String textureName;
    private String originName;
    private String brandName;
    private String collarName;
    private String sleeveName;
    private String materialName;
    private String thicknessName;
    private String elasticityName;
    private Double nowAverageDiscountPercentEvent;
    private Event event;
    private List<Image> images = new ArrayList<>();
    private List<EventResponseDTO> eventResponseDTOS = new ArrayList<>();

}
