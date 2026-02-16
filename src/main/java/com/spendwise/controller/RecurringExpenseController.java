package com.spendwise.controller;

import com.spendwise.entity.RecurringExpense;
import com.spendwise.service.RecurringExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-expenses")
@RequiredArgsConstructor
public class RecurringExpenseController {

    private final RecurringExpenseService service;

    @GetMapping
    public ResponseEntity<List<RecurringExpense>> getAll() {
        return ResponseEntity.ok(service.getAllRecurringExpenses());
    }

    @PostMapping
    public ResponseEntity<RecurringExpense> add(@RequestBody RecurringExpense expense) {
        return ResponseEntity.ok(service.addRecurringExpense(expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteRecurringExpense(id);
        return ResponseEntity.ok().build();
    }
}
