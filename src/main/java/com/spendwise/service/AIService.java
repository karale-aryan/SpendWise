package com.spendwise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spendwise.dto.AIAnalysisResponseDTO;
import com.spendwise.entity.Expense;
import com.spendwise.entity.User;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for AI-powered financial analysis using OpenAI.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

        private final WebClient openAIWebClient;
        private final ExpenseRepository expenseRepository;
        private final UserRepository userRepository;
        private final ObjectMapper objectMapper;

        @Value("${openai.model:gpt-3.5-turbo}")
        private String model;

        @Value("${openai.temperature:0.4}")
        private double temperature;

        /**
         * Analyze user's monthly expenses using OpenAI.
         *
         * @return AI-generated financial analysis
         */
        @Transactional(readOnly = true)
        public AIAnalysisResponseDTO analyzeExpenses() {
                User currentUser = getCurrentUser();
                LocalDate now = LocalDate.now();
                Integer month = now.getMonthValue();
                Integer year = now.getYear();

                // Fetch monthly expenses
                List<Expense> expenses = expenseRepository.findByUserId(currentUser.getId())
                                .stream()
                                .filter(e -> e.getDate().getMonthValue() == month && e.getDate().getYear() == year)
                                .collect(Collectors.toList());

                // Calculate summary
                double totalSpending = expenses.stream()
                                .mapToDouble(Expense::getAmount)
                                .sum();

                Map<String, Double> categoryBreakdown = expenses.stream()
                                .collect(Collectors.groupingBy(
                                                Expense::getCategory,
                                                Collectors.summingDouble(Expense::getAmount)));

                // Build AI prompt
                String userPrompt = buildPrompt(totalSpending, categoryBreakdown, expenses.size());

                try {
                        // Call OpenAI API
                        String aiResponse = callOpenAI(userPrompt);

                        // Parse and return structured response
                        return parseAIResponse(aiResponse);
                } catch (Exception e) {
                        log.error("Error calling OpenAI API", e);
                        return buildFallbackResponse(totalSpending, categoryBreakdown);
                }
        }

        /**
         * Build prompt for OpenAI with expense data.
         */
        private String buildPrompt(double total, Map<String, Double> breakdown, int count) {
                StringBuilder prompt = new StringBuilder();
                prompt.append("Analyze this monthly spending data:\n\n");
                prompt.append("Total Spending: $").append(String.format("%.2f", total)).append("\n");
                prompt.append("Number of Transactions: ").append(count).append("\n\n");
                prompt.append("Category Breakdown:\n");

                breakdown.forEach((category, amount) -> prompt.append("- ").append(category).append(": $")
                                .append(String.format("%.2f", amount)).append("\n"));

                prompt.append("\nProvide analysis in this exact JSON format:\n");
                prompt.append("{\n");
                prompt.append("  \"summary\": \"brief overview\",\n");
                prompt.append("  \"overspendingCategories\": [\"category1\", \"category2\"],\n");
                prompt.append("  \"recommendations\": [\"tip1\", \"tip2\", \"tip3\"],\n");
                prompt.append("  \"nextMonthPrediction\": \"forecast\"\n");
                prompt.append("}");

                return prompt.toString();
        }

        /**
         * Call OpenAI Chat Completion API.
         */
        private String callOpenAI(String userPrompt) {
                String systemPrompt = "You are a professional financial advisor AI. " +
                                "Analyze user spending and return structured JSON output with: " +
                                "summary (brief overview), overspendingCategories (categories exceeding typical spending), "
                                +
                                "recommendations (3-5 actionable tips), and nextMonthPrediction (forecast based on trends). "
                                +
                                "Return ONLY valid JSON, no additional text.";

                String requestBody = String.format("""
                                {
                                  "model": "%s",
                                  "temperature": %.1f,
                                  "messages": [
                                    {"role": "system", "content": "%s"},
                                    {"role": "user", "content": "%s"}
                                  ]
                                }
                                """, model, temperature,
                                systemPrompt.replace("\"", "\\\""),
                                userPrompt.replace("\"", "\\\"").replace("\n", "\\n"));

                try {
                        String response = openAIWebClient.post()
                                        .uri("/v1/chat/completions")
                                        .bodyValue(requestBody)
                                        .retrieve()
                                        .bodyToMono(String.class)
                                        .timeout(Duration.ofSeconds(30))
                                        .block();

                        // Extract content from OpenAI response
                        JsonNode root = objectMapper.readTree(response);
                        return root.path("choices").get(0)
                                        .path("message").path("content").asText();
                } catch (Exception e) {
                        log.error("OpenAI API call failed", e);
                        throw new RuntimeException("Failed to get AI analysis", e);
                }
        }

        /**
         * Parse AI response JSON into DTO.
         */
        private AIAnalysisResponseDTO parseAIResponse(String aiResponse) {
                try {
                        return objectMapper.readValue(aiResponse, AIAnalysisResponseDTO.class);
                } catch (Exception e) {
                        log.error("Failed to parse AI response", e);
                        throw new RuntimeException("Failed to parse AI response", e);
                }
        }

        /**
         * Build fallback response if AI call fails.
         */
        private AIAnalysisResponseDTO buildFallbackResponse(double total, Map<String, Double> breakdown) {
                List<String> topCategories = breakdown.entrySet().stream()
                                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                                .limit(2)
                                .map(Map.Entry::getKey)
                                .collect(Collectors.toList());

                return AIAnalysisResponseDTO.builder()
                                .summary("Unable to generate AI analysis at this time. Total spending: $" +
                                                String.format("%.2f", total))
                                .overspendingCategories(topCategories)
                                .recommendations(List.of(
                                                "Track your expenses regularly",
                                                "Set a monthly budget",
                                                "Review spending patterns weekly"))
                                .nextMonthPrediction("Based on current trends, maintain similar spending levels")
                                .build();
        }

        /**
         * Get current logged-in user.
         */
        private User getCurrentUser() {
                UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                                .getAuthentication()
                                .getPrincipal();

                return userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        /**
         * Get chat response from AI.
         */
        public com.spendwise.dto.ChatResponseDTO getChatResponse(com.spendwise.dto.ChatRequestDTO request) {
                try {
                        String aiResponse = callChatOpenAI(request.getMessages());
                        return com.spendwise.dto.ChatResponseDTO.builder()
                                        .message(aiResponse)
                                        .build();
                } catch (Exception e) {
                        log.error("Error in AI Chat", e);
                        return com.spendwise.dto.ChatResponseDTO.builder()
                                        .message("I apologize, but I am unable to respond at the moment. Please try again later.")
                                        .build();
                }
        }

        /**
         * Call OpenAI Chat Completion API for conversation.
         */
        private String callChatOpenAI(List<com.spendwise.dto.ChatRequestDTO.ChatMessage> messages) {
                String systemPrompt = "You are a helpful financial assistant for the SpendWise application. " +
                                "You help users with budgeting, expense tracking, and financial advice. " +
                                "Be concise, friendly, and professional.";

                List<Map<String, String>> apiMessages = new ArrayList<>();
                apiMessages.add(Map.of("role", "system", "content", systemPrompt));

                for (com.spendwise.dto.ChatRequestDTO.ChatMessage msg : messages) {
                        apiMessages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
                }

                try {
                        Map<String, Object> requestBodyMap = Map.of(
                                        "model", model,
                                        "temperature", 0.7,
                                        "messages", apiMessages);

                        String requestBody = objectMapper.writeValueAsString(requestBodyMap);

                        String response = openAIWebClient.post()
                                        .uri("/v1/chat/completions")
                                        .bodyValue(requestBody)
                                        .retrieve()
                                        .bodyToMono(String.class)
                                        .timeout(Duration.ofSeconds(30))
                                        .block();

                        JsonNode root = objectMapper.readTree(response);
                        return root.path("choices").get(0)
                                        .path("message").path("content").asText();
                } catch (Exception e) {
                        log.error("OpenAI Chat API call failed", e);
                        throw new RuntimeException("Failed to get AI chat response", e);
                }
        }
}
