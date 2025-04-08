package org.example.demo.mapper.cart.response;

import org.example.demo.dto.cart.response.CartResponseDTO;
import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.dto.order.core.response.OrderResponseDTO;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.order.core.Order;
import org.example.demo.mapper.address.response.AddressResponseMapper;
import org.example.demo.mapper.customer.response.CustomerResponseMapper;
import org.example.demo.mapper.event.response.EventResponseMapper;
import org.example.demo.mapper.history.response.HistoryResponseMapper;
import org.example.demo.mapper.order.properties.response.OrderDetailResponseMapper;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {AddressResponseMapper.class, HistoryResponseMapper.class, CustomerResponseMapper.class, StaffResponseMapper.class, ProductDetailResponseMapper.class, CartDetailResponseMapper.class, EventResponseMapper.class})
public interface CartResponseMapper {
    Cart toEntity(CartResponseDTO d);
    List<Cart> toListEntity(List<CartResponseDTO> d);

    @Mapping(target = "customerResponseDTO", source = "customer")
    @Mapping(target = "voucherResponseDTO", source = "voucher")
    @Mapping(target = "cartDetailResponseDTOS", source = "cartDetails")
    CartResponseDTO toDTO(Cart e);
    List<CartResponseDTO> toListDTO(List<Cart> e);


}
