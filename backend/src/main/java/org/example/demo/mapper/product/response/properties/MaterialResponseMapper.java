package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.ImageResponseDTO;
import org.example.demo.dto.product.response.properties.MaterialResponseDTO;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.entity.product.properties.Material;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MaterialResponseMapper  {

    Material toEntity(MaterialResponseDTO dto);
    List<Material> toListEntity(List<MaterialResponseDTO> dtoList);
    MaterialResponseDTO toOverViewDTO(Material e);
}
