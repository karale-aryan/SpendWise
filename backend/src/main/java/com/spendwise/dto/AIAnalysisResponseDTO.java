package com.spendwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for AI-powered financial analysis response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIAnalysisResponseDTO {

    /**
     * Brief summary of spending analysis
     */
    private String summary;

    /**
     * Categories where user is overspending
     */
    private List<String> overspendingCategories;

    /**
     * Personalized financial recommendations
     */
    private List<String> recommendations;

    /**
     * Prediction for next month's spending
     */
    private String nextMonthPrediction;

}
