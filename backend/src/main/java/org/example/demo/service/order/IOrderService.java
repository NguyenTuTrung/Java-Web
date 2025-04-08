package org.example.demo.service.order;

import org.example.demo.infrastructure.common.ResponseObject;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.entity.order.core.Order;

public interface IOrderService {

    ResponseObject createOrderClient(Order order);
    Order changeInforCustomer(Integer id, OrderRequestDTO requestDTO);

    // hung add
    Order create() throws BadRequestException;
}
