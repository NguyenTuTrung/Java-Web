package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.OriginResponseDTO;
import org.example.demo.dto.product.response.properties.SizeResponseDTO;
import org.example.demo.entity.product.properties.Origin;
import org.example.demo.entity.product.properties.Size;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SizeResponseMapper {
    Size toEntity(SizeResponseDTO dto);
    List<Size> toListEntity(List<SizeResponseDTO> dtoList);
    SizeResponseDTO toOverViewDTO(Size e);
}
