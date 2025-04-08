package org.example.demo.model.response;


import org.example.demo.entity.voucher.core.Voucher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;
import java.util.List;


@Projection(types = {Voucher.class})
public interface VoucherResponse {

    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getName();

    String getCode();
    LocalDateTime getStartDate();
    LocalDateTime getEndDate();
    String getStatus();

    Long getQuantity();

    Integer getMaxPercent();

    Double getMinAmount();

    String getTypeTicket();

    Integer getCustomerId();

    String getCustomerName();

    String getCustomerEmail();

}
