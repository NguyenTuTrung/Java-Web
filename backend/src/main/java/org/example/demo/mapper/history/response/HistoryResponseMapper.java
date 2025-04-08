package org.example.demo.mapper.history.response;

import org.example.demo.dto.history.response.HistoryResponseDTO;
import org.example.demo.entity.order.properties.History;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.auth.response.AccountResponseMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {AccountResponseMapper.class})
public interface HistoryResponseMapper extends IMapperBasic<History, HistoryResponseDTO> {

}
