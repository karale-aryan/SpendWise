package com.spendwise.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Expense entity.
 * Used for both request and response payloads.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseDTO {

    /**
     * Expense ID (only in responses)
     */
    private Long id;

    /**
     * Expense amount
     */
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    /**
     * Expense category
     */
    @NotBlank(message = "Category is required")
    @Size(min = 1, max = 50, message = "Category must be between 1 and 50 characters")
    private String category;

    /**
     * Expense description (optional)
     */
    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    /**
     * Date of expense
     */
    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    private LocalDate date;

    /**
     * Timestamp when expense was created (only in responses)
     */
    private LocalDateTime createdAt;

    /**
     * Timestamp when expense was last updated (only in responses)
     */
    private LocalDateTime updatedAt;

}
