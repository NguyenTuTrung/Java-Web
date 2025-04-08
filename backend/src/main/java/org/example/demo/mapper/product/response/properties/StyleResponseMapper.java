package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.SleeveResponseDTO;
import org.example.demo.dto.product.response.properties.StyleResponseDTO;
import org.example.demo.entity.product.properties.Sleeve;
import org.example.demo.entity.product.properties.Style;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StyleResponseMapper  {
    Style toEntity(StyleResponseDTO dto);
    List<Style> toListEntity(List<StyleResponseDTO> dtoList);
    StyleResponseDTO toOverViewDTO(Style e);
}
