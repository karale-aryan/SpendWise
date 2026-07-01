package com.spendwise.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for monitoring application status.
 */
@RestController
@RequestMapping("/api/public")
public class HealthController {

    /**
     * Health check endpoint.
     *
     * @return health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "SpendWise");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

}
