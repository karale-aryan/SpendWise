package com.spendwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for dashboard response with spending analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDTO {

    /**
     * Total spending for current month
     */
    private Double totalMonthlySpending;

    /**
     * Category-wise spending breakdown
     * Key: category name, Value: total amount
     */
    private Map<String, Double> categoryBreakdown;

    /**
     * Monthly budget limit (null if not set)
     */
    private Double monthlyBudget;

    /**
     * Remaining budget amount (null if no budget)
     * Can be negative if over budget
     */
    private Double remainingAmount;

    /**
     * Financial health score (0-100)
     * Based on spending vs budget percentage
     */
    private Integer financialHealthScore;

}
