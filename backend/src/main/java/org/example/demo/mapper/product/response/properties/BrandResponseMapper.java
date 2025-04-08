package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BrandResponseMapper {

    Brand toEntity(BrandResponseDTO dto);
    List<Brand> toListEntity(List<BrandResponseDTO> dtoList);
    BrandResponseDTO toOverViewDTO(Brand e);
}
