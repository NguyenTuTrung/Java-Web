package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.ColorRequestDTO;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorRequestMapper extends IMapperBasic<Color, ColorRequestDTO> {
}
