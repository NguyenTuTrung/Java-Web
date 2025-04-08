package org.example.demo.mapper.voucher.response;

import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VoucherResponseMapper extends IMapperBasic<Voucher, VoucherResponseDTO> {

    @Mapping(target = "countOrders", expression = "java(countOrders != null ? countOrders : 0)")
    VoucherResponseDTO toDTO(Voucher voucher, Integer countOrders);


}