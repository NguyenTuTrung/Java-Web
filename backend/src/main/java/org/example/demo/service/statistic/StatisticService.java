package org.example.demo.service.statistic;

import org.example.demo.dto.statistic.response.StatisticOverviewResponse;
import org.example.demo.dto.statistic.response.StatisticOverviewResponseImpl;
import org.example.demo.dto.statistic.response.TopProductObject;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticService {
    @Autowired
    private OrderRepository orderRepository;

    public List<StatisticOverviewResponse> calculateRevenueAnyDay(LocalDateTime from, LocalDateTime to) {
        List<StatisticOverviewResponse> orderList = orderRepository.findAllByStatusAndCreatedDateBetweenOrderByCreatedDateDesc(Status.DELIVERED, from, to.plusDays(1));
        List<StatisticOverviewResponse> result = orderList.stream().map(order -> {
            return new StatisticOverviewResponseImpl(order.getCreateDate(), order.getTotalRevenue(), order.getQuantityOrder());
        }).collect(Collectors.toList());

        return result;
    }

    public List<?> getRevenueAndQuantityByTimePeriod(
            LocalDateTime from,
            LocalDateTime to,
            String timePeriod) {
        LocalDate fromDate = from.toLocalDate();
        LocalDate toDate = to.toLocalDate();
        return switch (timePeriod) {
            case "daily" -> orderRepository.findAllStatisticByDay(Status.DELIVERED, from, to.plusDays(1));
            case "monthly" -> orderRepository.findAllStatisticByMonth(Status.DELIVERED, from, to.plusDays(1));
            case "yearly" -> orderRepository.findAllStatisticByYear(Status.DELIVERED, from, to.plusDays(1));
            default -> throw new IllegalArgumentException("Invalid time period");
        };
    }

    public Page<TopProductObject> findTopSeller(Pageable pageable){
        return orderRepository.findAllTopProduct(pageable);
    }

}
