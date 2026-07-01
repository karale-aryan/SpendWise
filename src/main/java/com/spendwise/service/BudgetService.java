package com.spendwise.service;

import com.spendwise.dto.BudgetRequestDTO;
import com.spendwise.dto.BudgetResponseDTO;
import com.spendwise.entity.Budget;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Service for managing budget operations.
 * Handles budget creation, updates, and expense analytics.
 */
@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    /**
     * Create or update a budget for the logged-in user.
     * If budget exists for the month/year, it updates the limit.
     * Otherwise, creates a new budget.
     *
     * @param requestDTO budget request data
     * @return budget response with analytics
     */
    @Transactional
    public BudgetResponseDTO createOrUpdateBudget(BudgetRequestDTO requestDTO) {
        User currentUser = getCurrentUser();

        // Default to current month/year if not provided
        Integer month = requestDTO.getMonth() != null ? requestDTO.getMonth() : LocalDate.now().getMonthValue();
        Integer year = requestDTO.getYear() != null ? requestDTO.getYear() : LocalDate.now().getYear();

        // Check if budget already exists
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(currentUser.getId(), month, year)
                .orElse(null);

        if (budget != null) {
            // Update existing budget
            budget.setMonthlyLimit(requestDTO.getMonthlyLimit());
        } else {
            // Create new budget
            budget = Budget.builder()
                    .monthlyLimit(requestDTO.getMonthlyLimit())
                    .month(month)
                    .year(year)
                    .user(currentUser)
                    .build();
        }

        Budget savedBudget = budgetRepository.save(budget);
        return buildResponseDTO(savedBudget);
    }

    /**
     * Get budget for the current month with analytics.
     *
     * @return budget response with analytics
     * @throws ResourceNotFoundException if budget not found
     */
    @Transactional(readOnly = true)
    public BudgetResponseDTO getCurrentMonthBudget() {
        LocalDate now = LocalDate.now();
        return getBudgetByMonthAndYear(now.getMonthValue(), now.getYear());
    }

    /**
     * Get budget for a specific month and year with analytics.
     *
     * @param month the month (1-12)
     * @param year  the year
     * @return budget response with analytics
     * @throws ResourceNotFoundException if budget not found
     */
    @Transactional(readOnly = true)
    public BudgetResponseDTO getBudgetByMonthAndYear(Integer month, Integer year) {
        Long userId = getCurrentUserId();
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", "month/year", month + "/" + year));

        return buildResponseDTO(budget);
    }

    @Transactional(readOnly = true)
    public BudgetResponseDTO getBudgetOptionally(Integer month, Integer year) {
        Long userId = getCurrentUserId();
        return budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .map(this::buildResponseDTO)
                .orElse(null);
    }

    /**
     * Build response DTO with calculated analytics.
     *
     * @param budget the budget entity
     * @return budget response DTO with analytics
     */
    /**
     * Delete a budget for a specific month and year.
     *
     * @param month the month (1-12)
     * @param year  the year
     */
    @Transactional
    public void deleteBudget(Integer month, Integer year) {
        Long userId = getCurrentUserId();
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", "month/year", month + "/" + year));
        budgetRepository.delete(budget);
    }

    private BudgetResponseDTO buildResponseDTO(Budget budget) {
        // Calculate total spent for the month
        Double totalSpent = expenseRepository.sumAmountByUserIdAndMonthAndYear(
                budget.getUser().getId(),
                budget.getMonth(),
                budget.getYear());

        // Handle null if no expenses found
        if (totalSpent == null) {
            totalSpent = 0.0;
        }

        // Calculate analytics
        Double remainingAmount = budget.getMonthlyLimit() - totalSpent;

        Double usagePercentage = 0.0;
        if (budget.getMonthlyLimit() > 0) {
            usagePercentage = (totalSpent / budget.getMonthlyLimit()) * 100.0;
        }

        Boolean exceeded = totalSpent > budget.getMonthlyLimit();

        return BudgetResponseDTO.builder()
                .id(budget.getId())
                .monthlyLimit(budget.getMonthlyLimit())
                .month(budget.getMonth())
                .year(budget.getYear())
                .totalSpent(totalSpent)
                .remainingAmount(remainingAmount)
                .usagePercentage(usagePercentage)
                .exceeded(exceeded)
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }

    /**
     * Get the current logged-in user's ID from security context.
     *
     * @return user ID
     */
    private Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Get the current logged-in user from security context.
     *
     * @return user entity
     * @throws RuntimeException if user not found
     */
    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
