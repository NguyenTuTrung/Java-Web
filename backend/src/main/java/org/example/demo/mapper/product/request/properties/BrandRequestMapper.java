package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.BrandRequestDTO;
import org.example.demo.entity.product.properties.Brand;

import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandRequestMapper extends IMapperBasic<Brand, BrandRequestDTO> {
}
