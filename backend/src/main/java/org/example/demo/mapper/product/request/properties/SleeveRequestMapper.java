package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.SleeveRequestDTO;
import org.example.demo.entity.product.properties.Sleeve;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SleeveRequestMapper extends IMapperBasic<Sleeve, SleeveRequestDTO> {
}
