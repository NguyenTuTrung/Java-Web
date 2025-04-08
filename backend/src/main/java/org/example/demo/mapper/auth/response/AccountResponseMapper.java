package org.example.demo.mapper.auth.response;

import org.example.demo.dto.auth.response.AccountResponseDTO;
import org.example.demo.entity.security.Account;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.customer.response.CustomerResponseMapper;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CustomerResponseMapper.class, StaffResponseMapper.class})
public interface AccountResponseMapper extends IMapperBasic<Account , AccountResponseDTO> {
}
