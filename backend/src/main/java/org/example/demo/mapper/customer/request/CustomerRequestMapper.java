package org.example.demo.mapper.customer.request;

import org.example.demo.dto.customer.request.CustomerRequestDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerRequestMapper extends IMapperBasic<Customer, CustomerRequestDTO> {
}
