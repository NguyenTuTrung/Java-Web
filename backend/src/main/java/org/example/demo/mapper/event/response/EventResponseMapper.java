package org.example.demo.mapper.event.response;

import org.example.demo.dto.event.response.EventResponseDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EventResponseMapper extends IMapperBasic<Event, EventResponseDTO> {
}
