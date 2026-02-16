package com.spendwise.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Budget entity representing monthly budget limits for users.
 * Each user can have one budget per month/year combination.
 */
@Entity
@Table(name = "budgets", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "month", "year" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget extends BaseEntity {

    /**
     * Monthly budget limit amount
     */
    @NotNull(message = "Monthly limit is required")
    @Positive(message = "Monthly limit must be positive")
    @Column(nullable = false)
    private Double monthlyLimit;

    /**
     * Month (1-12)
     */
    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    @Column(nullable = false)
    private Integer month;

    /**
     * Year
     */
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be 2000 or later")
    @Column(nullable = false)
    private Integer year;

    /**
     * User who owns this budget
     * Many budgets can belong to one user
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
