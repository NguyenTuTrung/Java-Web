package org.example.demo.mapper.order.properties.response;

import org.example.demo.dto.order.properties.response.OrderDetailResponseDTO;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductDetailResponseMapper.class})
public interface OrderDetailResponseMapper extends IMapperBasic<OrderDetail, OrderDetailResponseDTO> {
    @Mapping(target = "productDetailResponseDTO", source = "productDetail")
    OrderDetailResponseDTO toDTO(OrderDetail orderDetail);
    List<OrderDetailResponseDTO> toListDTO(List<OrderDetail> orderDetails);
}
