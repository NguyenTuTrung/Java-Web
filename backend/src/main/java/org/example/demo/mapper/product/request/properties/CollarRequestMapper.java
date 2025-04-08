package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.CollarRequestDTO;
import org.example.demo.entity.product.properties.Collar;

import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CollarRequestMapper extends IMapperBasic<Collar, CollarRequestDTO> {
}
