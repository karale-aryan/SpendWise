package com.spendwise.controller;

import com.spendwise.dto.DashboardResponseDTO;
import com.spendwise.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for dashboard analytics.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get complete dashboard data for current month.
     * Includes spending analytics, category breakdown, and financial health score.
     *
     * @return dashboard response with all analytics
     */
    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard() {
        DashboardResponseDTO dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }

}
