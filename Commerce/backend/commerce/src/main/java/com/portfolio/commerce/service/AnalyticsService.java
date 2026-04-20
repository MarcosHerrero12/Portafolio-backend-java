package com.portfolio.commerce.service;

import com.portfolio.commerce.dto.SalesStatsDTO;
import com.portfolio.commerce.entity.OrderItem;
import com.portfolio.commerce.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderItemRepository orderItemRepository;

    public SalesStatsDTO getSellerStats(Long sellerId) {
        List<OrderItem> items = orderItemRepository.findPaidItemsBySeller(sellerId);

        BigDecimal totalRevenue = items.stream()
                .map(oi -> oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Long totalSales = (long) items.size();

        // Agrupar por fecha
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, BigDecimal> dailyRevenueMap = items.stream()
                .collect(Collectors.groupingBy(
                        oi -> oi.getOrder().getOrderDate().format(formatter),
                        Collectors.mapping(
                                oi -> oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())),
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        List<SalesStatsDTO.DailySalesDTO> dailyRevenue = dailyRevenueMap.entrySet().stream()
                .map(e -> new SalesStatsDTO.DailySalesDTO(e.getKey(), e.getValue()))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());

        // Top productos
        Map<String, Long> productSalesMap = items.stream()
                .collect(Collectors.groupingBy(
                        oi -> oi.getProduct().getName(),
                        Collectors.summingLong(OrderItem::getQuantity)
                ));

        List<SalesStatsDTO.ProductSalesDTO> topProducts = productSalesMap.entrySet().stream()
                .map(e -> new SalesStatsDTO.ProductSalesDTO(e.getKey(), e.getValue()))
                .sorted((a, b) -> b.getQuantity().compareTo(a.getQuantity()))
                .limit(5)
                .collect(Collectors.toList());

        return SalesStatsDTO.builder()
                .totalRevenue(totalRevenue)
                .totalSales(totalSales)
                .dailyRevenue(dailyRevenue)
                .topProducts(topProducts)
                .build();
    }
}
