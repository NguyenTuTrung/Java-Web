package org.example.demo.mapper.address.response;

import org.example.demo.dto.address.response.AddressResponseDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressResponseMapper extends IMapperBasic<Address, AddressResponseDTO> {

}
