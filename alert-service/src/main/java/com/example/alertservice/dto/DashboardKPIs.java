package com.example.alertservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardKPIs {
    private long newAlerts;
    private long inInvestigation;
    private long resolvedToday;
    private double detectionRate;
    private long totalUsers; // Placeholder, ideally from user service
    private long activeUsers; // Placeholder, ideally from user service
    private long totalAlerts;
    private long fraudulentAlerts;
    private long nonFraudulentAlerts;
}
