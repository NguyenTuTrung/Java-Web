package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.SizeResponseDTO;
import org.example.demo.dto.product.response.properties.SleeveResponseDTO;
import org.example.demo.entity.product.properties.Size;
import org.example.demo.entity.product.properties.Sleeve;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SleeveResponseMapper {
    Sleeve toEntity(SleeveResponseDTO dto);
    List<Sleeve> toListEntity(List<SleeveResponseDTO> dtoList);
    SleeveResponseDTO toOverViewDTO(Sleeve e);
}
