package com.portfolio.commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesStatsDTO {
    private BigDecimal totalRevenue;
    private Long totalSales;
    private List<DailySalesDTO> dailyRevenue;
    private List<ProductSalesDTO> topProducts;

    @Data
    @AllArgsConstructor
    public static class DailySalesDTO {
        private String date;
        private BigDecimal revenue;
    }

    @Data
    @AllArgsConstructor
    public static class ProductSalesDTO {
        private String name;
        private Long quantity;
    }
}
