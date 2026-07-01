package com.spendwise.service;

import com.spendwise.dto.DashboardResponseDTO;
import com.spendwise.entity.Budget;
import com.spendwise.entity.Expense;
import com.spendwise.entity.User;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for dashboard analytics and financial health scoring.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    /**
     * Get complete dashboard data for current month.
     *
     * @return dashboard response with analytics
     */
    @Transactional(readOnly = true)
    public DashboardResponseDTO getDashboardData() {
        User currentUser = getCurrentUser();
        LocalDate now = LocalDate.now();
        Integer month = now.getMonthValue();
        Integer year = now.getYear();

        // Fetch all expenses for current month
        List<Expense> expenses = expenseRepository.findByUserId(currentUser.getId())
                .stream()
                .filter(e -> e.getDate().getMonthValue() == month && e.getDate().getYear() == year)
                .collect(Collectors.toList());

        // Calculate total monthly spending
        Double totalSpending = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        // Category-wise breakdown using stream grouping
        Map<String, Double> categoryBreakdown = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)));

        // Fetch budget (optional)
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(currentUser.getId(), month, year)
                .orElse(null);

        Double monthlyBudget = budget != null ? budget.getMonthlyLimit() : null;
        Double remainingAmount = budget != null ? budget.getMonthlyLimit() - totalSpending : null;

        // Calculate financial health score
        Integer healthScore = calculateHealthScore(totalSpending, monthlyBudget);

        return DashboardResponseDTO.builder()
                .totalMonthlySpending(totalSpending)
                .categoryBreakdown(categoryBreakdown)
                .monthlyBudget(monthlyBudget)
                .remainingAmount(remainingAmount)
                .financialHealthScore(healthScore)
                .build();
    }

    /**
     * Calculate financial health score based on spending percentage.
     *
     * @param totalSpent total amount spent
     * @param budget     monthly budget limit
     * @return health score (0-100)
     */
    private Integer calculateHealthScore(Double totalSpent, Double budget) {
        // No budget set = perfect score
        if (budget == null || budget == 0) {
            return 100;
        }

        double percentage = (totalSpent / budget) * 100.0;

        // <=70% spending = 90+
        if (percentage <= 70) {
            return Math.min(100, 90 + (int) ((70 - percentage) / 7));
        }
        // 70-90% = 75
        if (percentage <= 90) {
            return 75;
        }
        // 90-100% = 60
        if (percentage <= 100) {
            return 60;
        }
        // 100-120% = 40
        if (percentage <= 120) {
            return 40;
        }
        // >120% = 20
        return 20;
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
