package com.spendwise.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Expense entity representing user expenses.
 * Each expense is linked to a specific user and tracks spending details.
 */
@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense extends BaseEntity {

    /**
     * Expense amount in currency units
     * Must be a positive value
     */
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Column(nullable = false)
    private Double amount;

    /**
     * Expense category (e.g., Food, Transport, Entertainment)
     */
    @NotBlank(message = "Category is required")
    @Size(min = 1, max = 50, message = "Category must be between 1 and 50 characters")
    @Column(nullable = false, length = 50)
    private String category;

    /**
     * Optional description providing additional details about the expense
     */
    @Size(max = 255, message = "Description must not exceed 255 characters")
    @Column(length = 255)
    private String description;

    /**
     * Date when the expense occurred
     * Cannot be in the future
     */
    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    @Column(nullable = false)
    private LocalDate date;

    /**
     * User who owns this expense
     * Many expenses can belong to one user
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
