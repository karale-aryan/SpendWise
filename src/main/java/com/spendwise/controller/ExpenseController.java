package com.spendwise.controller;

import com.spendwise.dto.ExpenseDTO;
import com.spendwise.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for expense management endpoints.
 * Handles CRUD operations for user expenses.
 */
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    /**
     * Create a new expense.
     *
     * @param expenseDTO expense data
     * @return created expense with 201 status
     */
    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO createdExpense = expenseService.createExpense(expenseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
    }

    /**
     * Get all expenses for the logged-in user.
     *
     * @return list of expenses
     */
    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        List<ExpenseDTO> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    /**
     * Get a specific expense by ID.
     *
     * @param id expense ID
     * @return expense data
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        ExpenseDTO expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expense);
    }

    /**
     * Update an existing expense.
     *
     * @param id         expense ID
     * @param expenseDTO updated expense data
     * @return updated expense
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO updatedExpense = expenseService.updateExpense(id, expenseDTO);
        return ResponseEntity.ok(updatedExpense);
    }

    /**
     * Delete an expense.
     *
     * @param id expense ID
     * @return no content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

}
