package org.example.demo.mapper.event;

import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.EventListDTO;
import org.example.demo.dto.product.mchien.ProductDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.repository.product.properties.ProductRepository;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class EventMapper {

    // convert Event --> EventListDTO
    public static EventListDTO toEventListDTO(Event event) {
        event.updateStatusBasedOnTime(); // cap nhat status dua tren time
        return new EventListDTO(event.getId(), event.getDiscountCode(), event.getName(), event.getDiscountPercent(), event.getStartDate(), event.getEndDate(), event.getQuantityDiscount(), event.getStatus() // tra ve trang thai da dc cap nhat
        );
    }

    // convert EventDTO --> Event
    public static Event toEventEntity(EventDTO dto) {
        Event event = new Event();
        if (dto.getId() != null) {
            event.setId(dto.getId());
        }
        event.setDiscountCode(dto.getDiscountCode());
        event.setName(dto.getName());
        event.setDiscountPercent(dto.getDiscountPercent());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setQuantityDiscount(dto.getQuantityDiscount());

        // chuyen doi ProductDTO sang Product
        if (dto.getProductDTOS() != null) {
            List<Product> products = dto.getProductDTOS().stream().map(productDTO -> {
                Product product = new Product();
                product.setId(productDTO.getId());
                product.setName(productDTO.getName());
                return product;
            }).collect(Collectors.toList());
            event.setProducts(products);
        }
        return event;
    }

    // Convert Event --> EventDTO
    public static EventDTO toEventDTO(Event event) {
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setName(event.getName());
        eventDTO.setDiscountCode(event.getDiscountCode());
        eventDTO.setDiscountPercent(event.getDiscountPercent());
        eventDTO.setStartDate(event.getStartDate());
        eventDTO.setEndDate(event.getEndDate());
        eventDTO.setQuantityDiscount(event.getQuantityDiscount());
        eventDTO.setStatus(event.getStatus());
        eventDTO.setProductDTOS(toProductDTOList(event.getProducts()));

        return eventDTO;
    }

    // Chuyển đổi một danh sách List<Product> thành List<ProductDTO>
    public static List<ProductDTO> toProductDTOList(List<Product> products) {
        if (products == null) {
            return Collections.emptyList();  // Trả về danh sách rỗng nếu không có sản phẩm
        }
        return products.stream().map(product -> new ProductDTO(product.getId(), product.getCode(), product.getName())).collect(Collectors.toList());
    }

    // Chuyen doi tung phan tu cua Product thanh ProductDTO
    public static ProductDTO toProductDTO(Product product) {
        if (product == null) {
            return null;  // Trả về null nếu product là null
        }

        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setCode(product.getCode());
        productDTO.setName(product.getName());

        return productDTO;
    }

}
