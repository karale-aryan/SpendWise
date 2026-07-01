package com.spendwise.controller;

import com.spendwise.dto.BudgetRequestDTO;
import com.spendwise.dto.BudgetResponseDTO;
import com.spendwise.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for budget management endpoints.
 * Handles monthly budget creation, updates, and analytics.
 */
@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    /**
     * Create or update a monthly budget.
     * If budget exists for the specified month/year, updates the limit.
     * Otherwise, creates a new budget.
     *
     * @param requestDTO budget request data
     * @return budget response with analytics
     */
    @PostMapping
    public ResponseEntity<BudgetResponseDTO> createOrUpdateBudget(@Valid @RequestBody BudgetRequestDTO requestDTO) {
        BudgetResponseDTO response = budgetService.createOrUpdateBudget(requestDTO);

        // Return 201 if newly created, 200 if updated
        HttpStatus status = response.getCreatedAt().equals(response.getUpdatedAt())
                ? HttpStatus.CREATED
                : HttpStatus.OK;

        return ResponseEntity.status(status).body(response);
    }

    /**
     * Get budget for the current month with analytics.
     *
     * @return budget response with totalSpent, remainingAmount, usagePercentage,
     *         exceeded
     */
    @GetMapping("/current")
    public ResponseEntity<BudgetResponseDTO> getCurrentMonthBudget() {
        BudgetResponseDTO response = budgetService.getCurrentMonthBudget();
        return ResponseEntity.ok(response);
    }

    /**
     * Get budget for a specific month and year with analytics.
     *
     * @param month the month (1-12)
     * @param year  the year
     * @return budget response with analytics
     */
    @GetMapping("/{month}/{year}")
    public ResponseEntity<BudgetResponseDTO> getBudgetByMonthAndYear(
            @PathVariable Integer month,
            @PathVariable Integer year) {
        BudgetResponseDTO response = budgetService.getBudgetByMonthAndYear(month, year);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete budget for a specific month and year.
     *
     * @param month the month (1-12)
     * @param year  the year
     * @return 204 No Content
     */
    @DeleteMapping("/{month}/{year}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Integer month,
            @PathVariable Integer year) {
        budgetService.deleteBudget(month, year);
        return ResponseEntity.noContent().build();
    }

}
