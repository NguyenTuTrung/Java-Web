package org.example.demo.mapper.order.core.request;

import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.mapper.IMapperBasic;
import org.example.demo.mapper.customer.request.CustomerRequestMapper;
import org.mapstruct.Mapper;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Mapper(componentModel = "spring", uses = {CustomerRequestMapper.class})
public interface OrderRequestMapper extends IMapperBasic<Order, OrderRequestDTO> {

}
