package org.example.demo.mapper.product.request.core;

import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Qualifier;

@Mapper(componentModel = "spring")
@Qualifier("productDetailResponseMapperCore")
public interface ProductDetailRequestMapper extends IMapperBasic<ProductDetail, ProductDetailRequestDTO> {
}
