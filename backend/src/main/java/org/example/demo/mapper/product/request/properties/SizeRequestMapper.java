package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.SizeRequestDTO;
import org.example.demo.entity.product.properties.Size;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SizeRequestMapper extends IMapperBasic<Size, SizeRequestDTO> {
}
