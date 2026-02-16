package com.spendwise.service;

import com.spendwise.entity.RecurringExpense;
import com.spendwise.entity.User;
import com.spendwise.repository.RecurringExpenseRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecurringExpenseService {

    private final RecurringExpenseRepository repository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<RecurringExpense> getAllRecurringExpenses() {
        return repository.findByUserId(getCurrentUser().getId());
    }

    @Transactional
    public RecurringExpense addRecurringExpense(RecurringExpense expense) {
        expense.setUser(getCurrentUser());
        return repository.save(expense);
    }

    @Transactional
    public void deleteRecurringExpense(Long id) {
        RecurringExpense expense = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (!expense.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        repository.delete(expense);
    }
}
