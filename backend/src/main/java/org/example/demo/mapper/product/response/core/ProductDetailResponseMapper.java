package org.example.demo.mapper.product.response.core;

import org.example.demo.dto.product.phah04.response.ProductOverviewResponse;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.event.response.EventResponseMapper;
import org.example.demo.mapper.product.response.properties.ProductResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.List;

@Mapper(componentModel = "spring", uses = {EventResponseMapper.class, ProductResponseMapper.class})
@Qualifier("productDetailResponseMapperPhah04")
public interface ProductDetailResponseMapper extends IMapperBasic<ProductDetail, ProductDetailResponseDTO> {


    @Mapping(target = "sizeName", source = "size.name")
    @Mapping(target = "colorName", source = "color.name")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "textureName", source = "texture.name")
    @Mapping(target = "originName", source = "origin.name")
    @Mapping(target = "brandName", source = "brand.name")
    @Mapping(target = "collarName", source = "collar.name")
    @Mapping(target = "sleeveName", source = "sleeve.name")
    @Mapping(target = "materialName", source = "material.name")
    @Mapping(target = "thicknessName", source = "thickness.name")
    @Mapping(target = "elasticityName", source = "elasticity.name")
    @Mapping(target = "eventResponseDTOS", source = "productDetail.product.events")
    @Mapping(target = "nowAverageDiscountPercentEvent", source = "productDetail.product.nowAverageDiscountPercentEvent")
    ProductOverviewResponse toOverviewDTOPhah04(ProductDetail productDetail);
    List<ProductOverviewResponse> toOverviewDTOPhah04(List<ProductDetail> productDetailList);
}
