package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.ProductRequestDTO;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductRequestMapper extends IMapperBasic<Product, ProductRequestDTO> {
}
