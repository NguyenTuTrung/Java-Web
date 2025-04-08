package org.example.demo.mapper.cart.response;

import org.example.demo.dto.cart.response.CartDetailResponseDTO;
import org.example.demo.dto.order.properties.response.OrderDetailResponseDTO;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductDetailResponseMapper.class})
public interface CartDetailResponseMapper extends IMapperBasic<CartDetail, CartDetailResponseDTO> {
    @Mapping(target = "productDetailResponseDTO", source = "productDetail")
    CartDetailResponseDTO toDTO(CartDetail cartDetail);
    List<CartDetailResponseDTO> toListDTO(List<CartDetail> cartDetails);
}
