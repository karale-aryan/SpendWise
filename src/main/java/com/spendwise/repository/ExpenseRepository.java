package com.spendwise.repository;

import com.spendwise.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Expense entity operations.
 * Provides custom queries to ensure user data isolation.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Find all expenses belonging to a specific user.
     *
     * @param userId the user's ID
     * @return list of expenses for the user
     */
    List<Expense> findByUserId(Long userId);

    /**
     * Find a specific expense by ID and user ID.
     * Ensures users can only access their own expenses.
     *
     * @param userId the user's ID
     * @param id     the expense ID
     * @return optional containing the expense if found and owned by user
     */
    Optional<Expense> findByUserIdAndId(Long userId, Long id);

    /**
     * Check if an expense exists for a specific user.
     * Used for ownership verification.
     *
     * @param userId the user's ID
     * @param id     the expense ID
     * @return true if expense exists and belongs to user
     */
    boolean existsByUserIdAndId(Long userId, Long id);

    /**
     * Delete an expense by ID and user ID.
     * Ensures users can only delete their own expenses.
     *
     * @param userId the user's ID
     * @param id     the expense ID
     */
    void deleteByUserIdAndId(Long userId, Long id);

    /**
     * Calculate total expenses for a user in a specific month and year.
     *
     * @param userId the user's ID
     * @param month  the month (1-12)
     * @param year   the year
     * @return total amount spent, or 0.0 if no expenses
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.user.id = :userId AND YEAR(e.date) = :year AND MONTH(e.date) = :month")
    Double sumAmountByUserIdAndMonthAndYear(@Param("userId") Long userId, @Param("month") Integer month,
            @Param("year") Integer year);

}
