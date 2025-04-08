package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.MaterialResponseDTO;
import org.example.demo.dto.product.response.properties.OriginResponseDTO;
import org.example.demo.entity.product.properties.Material;
import org.example.demo.entity.product.properties.Origin;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OriginResponseMapper  {
    Origin toEntity(OriginResponseDTO dto);
    List<Origin> toListEntity(List<OriginResponseDTO> dtoList);
    OriginResponseDTO toOverViewDTO(Origin e);
}
