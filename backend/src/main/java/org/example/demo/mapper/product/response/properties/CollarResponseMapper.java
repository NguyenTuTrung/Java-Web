package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Collar;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CollarResponseMapper {

    Collar toEntity(CollarResponseDTO dto);
    List<Collar> toListEntity(List<CollarResponseDTO> dtoList);
    CollarResponseDTO toOverViewDTO(Collar e);
}
