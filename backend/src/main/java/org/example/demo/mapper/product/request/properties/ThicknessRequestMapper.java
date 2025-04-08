package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.ThicknessRequestDTO;
import org.example.demo.entity.product.properties.Thickness;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ThicknessRequestMapper extends IMapperBasic<Thickness, ThicknessRequestDTO> {
}
