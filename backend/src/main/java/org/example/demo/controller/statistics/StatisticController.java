package org.example.demo.controller.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.statistic.response.StatisticOverviewResponse;
import org.example.demo.mapper.product.response.properties.ProductResponseMapper;
import org.example.demo.service.statistic.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author PHAH04
 */
@RestController
@RequestMapping(value = "statistics")
public class StatisticController {

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class OverViewRequest {
        private LocalDateTime from;
        private LocalDateTime to;
        private String timePeriod;
    }

    @Autowired
    private StatisticService statisticService;

    @Autowired
    private ProductResponseMapper productResponseMapper;

    @PostMapping(value = "overview")
    public ResponseEntity<List<StatisticOverviewResponse>> fetchOverviewHeader(@RequestBody OverViewRequest overViewRequest) {
        return ResponseEntity.ok(statisticService.calculateRevenueAnyDay(overViewRequest.getFrom(), overViewRequest.getTo()));
    }

    @PostMapping(value = "v2/overview")
    public ResponseEntity<List<?>> fetchOverviewHeaders(@RequestBody OverViewRequest overViewRequest) {
        return ResponseEntity.ok(statisticService.getRevenueAndQuantityByTimePeriod(overViewRequest.getFrom(), overViewRequest.getTo(), overViewRequest.getTimePeriod()));
    }

    @GetMapping(value = "top-seller")
    public ResponseEntity<?> findTopSeller(@PageableDefault(page = 0, size = 5) Pageable pageable){
        return ResponseEntity.ok(statisticService.findTopSeller(pageable));
    }

}
