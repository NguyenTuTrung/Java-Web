package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageRequestMapper extends IMapperBasic<Image, ImageRequestDTO> {
}
