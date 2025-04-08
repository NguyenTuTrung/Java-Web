package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.StyleResponseDTO;
import org.example.demo.dto.product.response.properties.TextureResponseDTO;
import org.example.demo.entity.product.properties.Style;
import org.example.demo.entity.product.properties.Texture;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TextureResponseMapper  {
    Texture toEntity(TextureResponseDTO dto);
    List<Texture> toListEntity(List<TextureResponseDTO> dtoList);
    TextureResponseDTO toOverViewDTO(Texture e);

}
