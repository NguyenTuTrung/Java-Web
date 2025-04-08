package org.example.demo.dto.statistic.response;

import java.time.LocalDateTime;

public class StatisticOverviewResponseImpl implements StatisticOverviewResponse {
    private final LocalDateTime createDate;
    private final Integer month;
    private final Integer year;
    private final Integer quantityOrder;
    private final Double totalRevenue;

    public StatisticOverviewResponseImpl(LocalDateTime createDate, Double totalRevenue, Integer quantityOrder) {
        this.createDate = createDate;
        this.totalRevenue = totalRevenue;
        this.quantityOrder = quantityOrder;
        this.month = createDate.getMonthValue(); // Lấy tháng từ createDate
        this.year = createDate.getYear(); // Lấy năm từ createDate
    }

    @Override
    public LocalDateTime getCreateDate() {
        return createDate;
    }

    @Override
    public Integer getMonth() {
        return month;
    }

    @Override
    public Integer getYear() {
        return year;
    }

    @Override
    public Integer getQuantityOrder() {
        return quantityOrder;
    }

    @Override
    public Double getTotalRevenue() {
        return totalRevenue;
    }
}
