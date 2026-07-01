package com.spendwise.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class SavingsGoalDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Target amount is required")
    @Positive(message = "Target amount must be positive")
    private Double targetAmount;

    @NotNull(message = "Current amount is required")
    @PositiveOrZero(message = "Current amount must be positive or zero")
    private Double currentAmount;

    private LocalDate deadline;
    private String icon;
}
