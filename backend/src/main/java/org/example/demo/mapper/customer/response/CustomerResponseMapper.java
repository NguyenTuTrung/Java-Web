package org.example.demo.mapper.customer.response;

import org.example.demo.dto.customer.response.CustomerResponseDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.address.response.AddressResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {AddressResponseMapper.class})
public interface CustomerResponseMapper {
    Customer toEntity(CustomerResponseDTO d);

    List<Customer> toListEntity(List<CustomerResponseDTO> d);


    @Mapping(target = "addressResponseDTOS", source = "addresses")
    CustomerResponseDTO toDTO(Customer e);

    List<CustomerResponseDTO> toListDTO(List<Customer> e);
}
