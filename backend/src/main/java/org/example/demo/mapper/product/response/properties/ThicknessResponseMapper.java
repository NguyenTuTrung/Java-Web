package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.TextureResponseDTO;
import org.example.demo.dto.product.response.properties.ThicknessResponseDTO;
import org.example.demo.entity.product.properties.Texture;
import org.example.demo.entity.product.properties.Thickness;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ThicknessResponseMapper {
    Thickness toEntity(ThicknessResponseDTO dto);
    List<Thickness> toListEntity(List<ThicknessResponseDTO> dtoList);
    ThicknessResponseDTO toOverViewDTO(Thickness e);

}
