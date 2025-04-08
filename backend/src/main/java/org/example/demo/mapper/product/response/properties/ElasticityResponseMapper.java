package org.example.demo.mapper.product.response.properties;

import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.entity.product.properties.Elasticity;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ElasticityResponseMapper {


    Elasticity toEntity(ElasticityResponseDTO dto);
    List<Elasticity> toListEntity(List<ElasticityResponseDTO> dtoList);
    ElasticityResponseDTO toOverViewDTO(Elasticity e);
}
