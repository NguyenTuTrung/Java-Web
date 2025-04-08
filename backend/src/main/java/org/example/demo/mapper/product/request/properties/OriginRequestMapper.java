package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.OriginRequestDTO;
import org.example.demo.entity.product.properties.Origin;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OriginRequestMapper extends IMapperBasic<Origin, OriginRequestDTO> {
}
