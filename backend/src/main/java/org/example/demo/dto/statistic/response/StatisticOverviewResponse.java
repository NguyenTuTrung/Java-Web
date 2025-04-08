package org.example.demo.dto.statistic.response;

import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;

public interface StatisticOverviewResponse {
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    LocalDateTime getCreateDate();
    Integer getMonth();
    Integer getYear();
    Integer getQuantityOrder();
    Double getTotalRevenue();
}
