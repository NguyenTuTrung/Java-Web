package org.example.demo.mapper.history.request;

import org.example.demo.dto.history.request.HistoryRequestDTO;
import org.example.demo.entity.order.properties.History;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HistoryRequestMapper extends IMapperBasic<History, HistoryRequestDTO> {

}
