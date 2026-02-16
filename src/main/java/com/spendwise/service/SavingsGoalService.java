package com.spendwise.service;

import com.spendwise.dto.SavingsGoalDTO;
import com.spendwise.entity.SavingsGoal;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.SavingsGoalRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;

    @Transactional
    public SavingsGoalDTO createGoal(SavingsGoalDTO dto) {
        User user = getCurrentUser();
        SavingsGoal goal = SavingsGoal.builder()
                .name(dto.getName())
                .targetAmount(dto.getTargetAmount())
                .currentAmount(dto.getCurrentAmount())
                .deadline(dto.getDeadline())
                .icon(dto.getIcon())
                .user(user)
                .build();
        return convertToDTO(savingsGoalRepository.save(goal));
    }

    @Transactional(readOnly = true)
    public List<SavingsGoalDTO> getAllGoals() {
        return savingsGoalRepository.findByUserId(getCurrentUserId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SavingsGoalDTO updateGoal(Long id, SavingsGoalDTO dto) {
        SavingsGoal goal = getGoalEntity(id);
        goal.setName(dto.getName());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setCurrentAmount(dto.getCurrentAmount());
        goal.setDeadline(dto.getDeadline());
        goal.setIcon(dto.getIcon());
        return convertToDTO(savingsGoalRepository.save(goal));
    }

    @Transactional
    public void deleteGoal(Long id) {
        SavingsGoal goal = getGoalEntity(id);
        savingsGoalRepository.delete(goal);
    }

    private SavingsGoal getGoalEntity(Long id) {
        return savingsGoalRepository.findById(id)
                .filter(g -> g.getUser().getId().equals(getCurrentUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", "id", id));
    }

    private SavingsGoalDTO convertToDTO(SavingsGoal goal) {
        return SavingsGoalDTO.builder()
                .id(goal.getId())
                .name(goal.getName())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .deadline(goal.getDeadline())
                .icon(goal.getIcon())
                .build();
    }

    private Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
