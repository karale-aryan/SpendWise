package com.spendwise.service;

import com.spendwise.dto.AnalyticsResponseDTO;
import com.spendwise.entity.Expense;
import com.spendwise.entity.User;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public AnalyticsResponseDTO getAnalytics() {
        User user = getCurrentUser();

        // Get expenses for last 6 months
        LocalDate now = LocalDate.now();
        LocalDate sixMonthsAgo = now.minusMonths(5).withDayOfMonth(1); // Start of 6 months ago

        List<Expense> expenses = expenseRepository.findByUserId(user.getId()).stream()
                .filter(e -> !e.getDate().isBefore(sixMonthsAgo))
                .collect(Collectors.toList());

        // 1. Monthly Trend
        Map<String, Double> monthlyTrend = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        // Initialize last 6 months with 0
        for (int i = 5; i >= 0; i--) {
            LocalDate date = now.minusMonths(i);
            monthlyTrend.put(date.format(formatter), 0.0);
        }

        expenses.forEach(e -> {
            String key = e.getDate().format(formatter);
            monthlyTrend.put(key, monthlyTrend.getOrDefault(key, 0.0) + e.getAmount());
        });

        // 2. Category Breakdown (Current Month)
        Map<String, Double> categoryBreakdown = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)));

        // 3. Month Over Month Change (Last Month vs Current Month)
        // Caution: logic needs to separate current month (incomplete) vs last month?
        // Let's just do last completed month vs month before that? Or current vs last.
        // Current vs Last for simplicity.

        String currentMonthKey = now.format(formatter);
        String lastMonthKey = now.minusMonths(1).format(formatter);

        Double currentMonthTotal = monthlyTrend.getOrDefault(currentMonthKey, 0.0);
        Double lastMonthTotal = monthlyTrend.getOrDefault(lastMonthKey, 0.0);

        Double change = 0.0;
        if (lastMonthTotal > 0) {
            change = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100.0;
        }

        return AnalyticsResponseDTO.builder()
                .monthlyTrend(monthlyTrend)
                .categoryBreakdown(categoryBreakdown) // This is currently 6 months breakdown, maybe user wants just
                                                      // current month?
                // Let's make it ALL time breakdown or 6 months breakdown. 6 months seems good
                // for general spending habits.
                .totalSpent(expenses.stream().mapToDouble(Expense::getAmount).sum())
                .monthOverMonthChange(change)
                .build();
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
