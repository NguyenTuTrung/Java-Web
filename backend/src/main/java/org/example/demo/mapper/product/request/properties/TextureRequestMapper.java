package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.TextureRequestDTO;
import org.example.demo.entity.product.properties.Texture;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TextureRequestMapper extends IMapperBasic<Texture, TextureRequestDTO> {
}
