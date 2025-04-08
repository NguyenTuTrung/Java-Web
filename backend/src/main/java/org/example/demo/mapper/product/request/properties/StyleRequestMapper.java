package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.StyleRequestDTO;
import org.example.demo.entity.product.properties.Style;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StyleRequestMapper extends IMapperBasic<Style, StyleRequestDTO> {
}
