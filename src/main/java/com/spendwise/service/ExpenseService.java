package com.spendwise.service;

import com.spendwise.dto.ExpenseDTO;
import com.spendwise.entity.Expense;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing expense operations.
 * Implements business logic and ensures user data isolation.
 */
@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final com.spendwise.repository.ExpenseRepository expenseRepository;
    private final com.spendwise.repository.UserRepository userRepository;
    private final com.spendwise.service.EmailService emailService;
    private final com.spendwise.service.BudgetService budgetService;

    // ... (existing constructor is handled by RequiredArgsConstructor, but fields
    // must be final)
    // Wait, I need to add fields at top. I will replace the class definition start.

    /**
     * Create a new expense for the logged-in user.
     *
     * @param expenseDTO expense data
     * @return created expense DTO
     */
    @Transactional
    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        User currentUser = getCurrentUser();

        Expense expense = Expense.builder()
                .amount(expenseDTO.getAmount())
                .category(expenseDTO.getCategory())
                .description(expenseDTO.getDescription())
                .date(expenseDTO.getDate())
                .user(currentUser)
                .build();

        Expense savedExpense = expenseRepository.save(expense);

        // Check Budget
        try {
            com.spendwise.dto.BudgetResponseDTO budget = budgetService.getBudgetOptionally(
                    expense.getDate().getMonthValue(),
                    expense.getDate().getYear());

            if (budget != null && budget.getExceeded()) {
                emailService.sendBudgetAlert(
                        currentUser.getEmail(),
                        "Overall Monthly Budget", // We track overall budget
                        expense.getAmount(),
                        budget.getMonthlyLimit(),
                        budget.getTotalSpent());
            }
        } catch (Exception e) {
            // Ignore budget check errors (e.g. email failure)
        }

        return convertToDTO(savedExpense);
    }

    /**
     * Get all expenses for the logged-in user.
     *
     * @return list of expense DTOs
     */
    @Transactional(readOnly = true)
    public List<ExpenseDTO> getAllExpenses() {
        Long userId = getCurrentUserId();
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific expense by ID.
     * Ensures the expense belongs to the logged-in user.
     *
     * @param id expense ID
     * @return expense DTO
     * @throws ResourceNotFoundException if expense not found or doesn't belong to
     *                                   user
     */
    @Transactional(readOnly = true)
    public ExpenseDTO getExpenseById(Long id) {
        Long userId = getCurrentUserId();
        Expense expense = expenseRepository.findByUserIdAndId(userId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        return convertToDTO(expense);
    }

    /**
     * Update an existing expense.
     * Ensures the expense belongs to the logged-in user.
     *
     * @param id         expense ID
     * @param expenseDTO updated expense data
     * @return updated expense DTO
     * @throws ResourceNotFoundException if expense not found or doesn't belong to
     *                                   user
     */
    @Transactional
    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Long userId = getCurrentUserId();
        Expense expense = expenseRepository.findByUserIdAndId(userId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));

        // Update fields
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setDescription(expenseDTO.getDescription());
        expense.setDate(expenseDTO.getDate());

        Expense updatedExpense = expenseRepository.save(expense);
        return convertToDTO(updatedExpense);
    }

    /**
     * Delete an expense.
     * Ensures the expense belongs to the logged-in user.
     *
     * @param id expense ID
     * @throws ResourceNotFoundException if expense not found or doesn't belong to
     *                                   user
     */
    @Transactional
    public void deleteExpense(Long id) {
        Long userId = getCurrentUserId();

        // Verify ownership before deletion
        if (!expenseRepository.existsByUserIdAndId(userId, id)) {
            throw new ResourceNotFoundException("Expense", "id", id);
        }

        expenseRepository.deleteByUserIdAndId(userId, id);
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

    /**
     * Convert Expense entity to DTO.
     *
     * @param expense expense entity
     * @return expense DTO
     */
    private ExpenseDTO convertToDTO(Expense expense) {
        return ExpenseDTO.builder()
                .id(expense.getId())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .date(expense.getDate())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }

}
