package com.spendwise.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for budget creation and update requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetRequestDTO {

    /**
     * Monthly budget limit
     */
    @NotNull(message = "Monthly limit is required")
    @Positive(message = "Monthly limit must be positive")
    private Double monthlyLimit;

    /**
     * Month (1-12), defaults to current month if not provided
     */
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer month;

    /**
     * Year, defaults to current year if not provided
     */
    @Min(value = 2000, message = "Year must be 2000 or later")
    private Integer year;

}
