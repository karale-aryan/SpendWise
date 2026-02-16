package com.spendwise.controller;

import com.spendwise.dto.SavingsGoalDTO;
import com.spendwise.service.SavingsGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    @PostMapping
    public ResponseEntity<SavingsGoalDTO> createGoal(@Valid @RequestBody SavingsGoalDTO dto) {
        return ResponseEntity.ok(savingsGoalService.createGoal(dto));
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoalDTO>> getAllGoals() {
        return ResponseEntity.ok(savingsGoalService.getAllGoals());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoalDTO> updateGoal(@PathVariable Long id, @Valid @RequestBody SavingsGoalDTO dto) {
        return ResponseEntity.ok(savingsGoalService.updateGoal(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        savingsGoalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
