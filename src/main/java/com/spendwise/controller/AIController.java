package com.spendwise.controller;

import com.spendwise.dto.AIAnalysisResponseDTO;
import com.spendwise.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for AI-powered financial analysis.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    /**
     * Analyze user's monthly expenses using AI.
     *
     * @return AI-generated financial analysis and recommendations
     */
    @PostMapping("/analyze")
    public ResponseEntity<AIAnalysisResponseDTO> analyzeExpenses() {
        AIAnalysisResponseDTO analysis = aiService.analyzeExpenses();
        return ResponseEntity.ok(analysis);
    }

    @PostMapping("/chat")
    public ResponseEntity<com.spendwise.dto.ChatResponseDTO> chat(
            @org.springframework.web.bind.annotation.RequestBody com.spendwise.dto.ChatRequestDTO request) {
        return ResponseEntity.ok(aiService.getChatResponse(request));
    }

}
