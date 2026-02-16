package com.spendwise.repository;

import com.spendwise.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Budget entity operations.
 * Provides custom queries for monthly budget management.
 */
@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    /**
     * Find budget for a specific user, month, and year.
     *
     * @param userId the user's ID
     * @param month  the month (1-12)
     * @param year   the year
     * @return optional containing the budget if found
     */
    Optional<Budget> findByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);

    /**
     * Check if a budget exists for a specific user, month, and year.
     *
     * @param userId the user's ID
     * @param month  the month (1-12)
     * @param year   the year
     * @return true if budget exists
     */
    boolean existsByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);

}
