package com.spendwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for budget responses with analytics.
 * Includes calculated fields for budget tracking and usage.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetResponseDTO {

    /**
     * Budget ID
     */
    private Long id;

    /**
     * Monthly budget limit
     */
    private Double monthlyLimit;

    /**
     * Month (1-12)
     */
    private Integer month;

    /**
     * Year
     */
    private Integer year;

    /**
     * Total amount spent in this month
     * Calculated from expense records
     */
    private Double totalSpent;

    /**
     * Remaining budget amount
     * Calculated as: monthlyLimit - totalSpent
     */
    private Double remainingAmount;

    /**
     * Budget usage percentage
     * Calculated as: (totalSpent / monthlyLimit) * 100
     */
    private Double usagePercentage;

    /**
     * Whether the budget has been exceeded
     * True if totalSpent > monthlyLimit
     */
    private Boolean exceeded;

    /**
     * Timestamp when budget was created
     */
    private LocalDateTime createdAt;

    /**
     * Timestamp when budget was last updated
     */
    private LocalDateTime updatedAt;

}
