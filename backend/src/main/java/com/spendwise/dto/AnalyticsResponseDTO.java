package com.spendwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsResponseDTO {
    // Map<Month-Year, Amount> for trend chart
    private Map<String, Double> monthlyTrend;

    // Map<Category, Amount> for pie chart
    private Map<String, Double> categoryBreakdown;

    // Total spent in range (e.g. last 6 months)
    private Double totalSpent;

    // Percentage change from last month
    private Double monthOverMonthChange;
}
