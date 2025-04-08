package org.example.demo.mapper.order.core.response;

import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.dto.order.core.response.OrderResponseDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.mapper.address.response.AddressResponseMapper;
import org.example.demo.mapper.customer.response.CustomerResponseMapper;
import org.example.demo.mapper.event.response.EventResponseMapper;
import org.example.demo.mapper.history.response.HistoryResponseMapper;
import org.example.demo.mapper.order.properties.response.OrderDetailResponseMapper;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.example.demo.mapper.product.response.properties.ProductResponseMapper;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Mapper(componentModel = "spring", uses = {AddressResponseMapper.class, HistoryResponseMapper.class, CustomerResponseMapper.class, StaffResponseMapper.class, ProductDetailResponseMapper.class, OrderDetailResponseMapper.class, EventResponseMapper.class, ProductResponseMapper.class})
public interface OrderResponseMapper {
    Order toEntity(OrderResponseDTO d);

    List<Order> toListEntity(List<OrderResponseDTO> d);

    @Mapping(target = "staffResponseDTO", source = "staff")
    @Mapping(target = "customerResponseDTO", source = "customer")
    @Mapping(target = "voucherResponseDTO", source = "voucher")
    @Mapping(target = "historyResponseDTOS", source = "histories")
    @Mapping(target = "orderDetailResponseDTOS", source = "orderDetails")
    OrderResponseDTO toDTO(Order e);
    List<OrderResponseDTO> toListDTO(List<Order> e);

    @Mapping(target = "customerName", source = "customer.name")
    @Mapping(target = "staffName", source = "staff.name")
    OrderOverviewResponseDTO toOverViewDTO(Order e);

    List<OrderOverviewResponseDTO> toListOverViewDTO(List<Order> e);
}
