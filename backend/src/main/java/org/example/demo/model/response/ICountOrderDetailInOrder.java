package org.example.demo.model.response;

import org.example.demo.entity.order.core.Order;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Order.class})
public interface ICountOrderDetailInOrder {
    Integer getId();

    String getCode();

    Integer getQuantity();
}
