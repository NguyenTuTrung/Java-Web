package org.example.demo.mapper.staff.response;

import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StaffResponseMapper extends IMapperBasic<Staff, StaffResponseDTO> {

}
