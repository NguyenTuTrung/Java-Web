package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.ColorResponseDTO;
import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ColorResponseMapper  {


    Color toEntity(ColorResponseDTO dto);
    List<Color> toListEntity(List<ColorResponseDTO> dtoList);
    ColorResponseDTO toOverViewDTO(Color e);
}
