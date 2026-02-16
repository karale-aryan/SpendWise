package com.spendwise.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "savings_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingsGoal extends BaseEntity {

    @NotBlank(message = "Goal name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Target amount is required")
    @Positive(message = "Target amount must be positive")
    @Column(nullable = false)
    private Double targetAmount;

    @NotNull(message = "Current amount is required")
    @PositiveOrZero(message = "Current amount must be non-negative")
    @Column(nullable = false)
    private Double currentAmount;

    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;

    private String icon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
