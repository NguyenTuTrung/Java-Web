package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.dto.product.response.properties.ImageResponseDTO;
import org.example.demo.entity.product.properties.Elasticity;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageResponseMapper  {

    Image toEntity(ImageResponseDTO dto);
    List<Image> toListEntity(List<ImageResponseDTO> dtoList);
    ImageResponseDTO toOverViewDTO(Image e);
}
