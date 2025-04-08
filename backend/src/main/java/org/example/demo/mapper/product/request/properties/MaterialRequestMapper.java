package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.MaterialRequestDTO;
import org.example.demo.entity.product.properties.Material;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MaterialRequestMapper extends IMapperBasic<Material, MaterialRequestDTO> {
}
