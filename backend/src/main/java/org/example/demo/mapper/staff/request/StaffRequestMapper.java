
package org.example.demo.mapper.staff.request;


import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffRequestMapper extends IMapperBasic<Staff, StaffRequestDTO> {

    @Override
    Staff toEntity(StaffRequestDTO dto);

//    @Override
//    @Mapping(target = "role", ignore = true) // Ignore role if not used
//    StaffRequestDTO toDTO(Staff entity);

    // Use MapStruct's `@MappingTarget` to update an existing Staff entity
    @Mapping(target = "id", ignore = true)         // Don't overwrite the ID
    @Mapping(target = "deleted", ignore = true)
    // Don't overwrite the deleted flag
    void updateEntity(StaffRequestDTO dto, @MappingTarget Staff entity);

    @AfterMapping
    default void handleNulls(StaffRequestDTO dto, @MappingTarget Staff entity) {
        if (dto.getPhone() == null) {
            entity.setPhone(null);  // For example, handle null cases for specific fields
        }
        // Add similar logic for other fields if necessary
    }
}

