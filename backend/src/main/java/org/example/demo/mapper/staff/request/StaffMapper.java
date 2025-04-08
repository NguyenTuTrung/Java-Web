package org.example.demo.mapper.staff.request;

import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.staff.Staff;

public class StaffMapper {
    public static Staff toEntity(StaffRequestDTO dto) {
        Staff staff = new Staff();
        staff.setName(dto.getName());
        staff.setEmail(dto.getEmail());
        staff.setPhone(dto.getPhone());
        staff.setAddress(dto.getAddress());
        staff.setWard(dto.getWard());
        staff.setDistrict(dto.getDistrict());
        staff.setProvince(dto.getProvince());
        staff.setCitizenId(dto.getCitizenId());
        staff.setStatus(dto.getStatus());
        staff.setBirthDay(dto.getBirthDay());
        staff.setGender(dto.getGender());
        staff.setNote(dto.getNote());
        staff.setDeleted(dto.getDeleted());
        staff.setCode(dto.getCode());
        return staff;
    }
}

