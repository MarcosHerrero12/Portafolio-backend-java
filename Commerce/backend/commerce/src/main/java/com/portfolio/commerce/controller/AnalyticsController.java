package com.portfolio.commerce.controller;

import com.portfolio.commerce.dto.SalesStatsDTO;
import com.portfolio.commerce.entity.User;
import com.portfolio.commerce.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/seller/stats")
    public ResponseEntity<SalesStatsDTO> getSellerStats(@AuthenticationPrincipal User seller) {
        return ResponseEntity.ok(analyticsService.getSellerStats(seller.getId()));
    }
}
