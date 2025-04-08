package org.example.demo.mapper.product.request.properties;

import org.example.demo.dto.product.requests.properties.ElasticityRequestDTO;
import org.example.demo.entity.product.properties.Elasticity;

import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ElasticityRequestMapper extends IMapperBasic<Elasticity, ElasticityRequestDTO> {
}
