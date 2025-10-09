package com.example.alertservice.service;

import com.example.alertservice.dto.DashboardKPIs;
import com.example.alertservice.dto.UserKPIs;
import com.example.alertservice.model.Alert;
import com.example.alertservice.Repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${user.service.url:http://user-service:8081}")
    private String userServiceUrl;

    public Alert createAlert(Alert alertData) {
        alertData.setCreatedAt(LocalDateTime.now());
        alertData.setStatus("NOUVELLE");
        return alertRepository.save(alertData);
    }
    
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }
    public Alert getAlertById(Long id) {
        return alertRepository.findById(id).orElse(null);
    }
    public Alert qualifyAlert(Long id, String status, String comments) {
        Alert alert = alertRepository.findById(id).orElse(null);
        if (alert != null) {
            alert.setStatus(status);
            alert.setComments(comments);
            alert.setUpdatedAt(LocalDateTime.now());
            return alertRepository.save(alert);
        }
        return null;
    }

    public DashboardKPIs getDashboardKPIs() {
        List<Alert> allAlerts = alertRepository.findAll();
        long newAlerts = allAlerts.stream()
                .filter(alert -> "NOUVELLE".equals(alert.getStatus()))
                .count();
        long inInvestigation = allAlerts.stream()
                .filter(alert -> "EN_COURS".equals(alert.getStatus()))
                .count();

        LocalDate today = LocalDate.now();
        long resolvedToday = allAlerts.stream()
                .filter(alert -> ("CLOTUREE_FRAUDE".equals(alert.getStatus()) || "CLOTUREE_NON_FRAUDE".equals(alert.getStatus()))
                        && alert.getUpdatedAt() != null
                        && alert.getUpdatedAt().toLocalDate().isEqual(today))
                .count();

        long totalAlerts = allAlerts.size();
        long fraudulentAlerts = allAlerts.stream()
                .filter(alert -> "CLOTUREE_FRAUDE".equals(alert.getStatus()))
                .count();
        long nonFraudulentAlerts = allAlerts.stream()
                .filter(alert -> "CLOTUREE_NON_FRAUDE".equals(alert.getStatus()))
                .count();

        double detectionRate = (totalAlerts > 0) ? (double) fraudulentAlerts / totalAlerts * 100 : 0;

        // Fetch user KPIs from user-service
        UserKPIs userKPIs = fetchUserKPIs();
        
        return new DashboardKPIs(
                newAlerts,
                inInvestigation,
                resolvedToday,
                detectionRate,
                userKPIs.getTotalUsers(),
                userKPIs.getActiveUsers(),
                userKPIs.getInactiveUsers(),
                userKPIs.getNewUsersToday(),
                userKPIs.getAdminUsers(),
                userKPIs.getRegularUsers(),
                totalAlerts,
                fraudulentAlerts,
                nonFraudulentAlerts
        );
    }
    
    private UserKPIs fetchUserKPIs() {
        try {
            String url = userServiceUrl + "/users/dashboard/kpis";
            return restTemplate.getForObject(url, UserKPIs.class);
        } catch (Exception e) {
            // Return default values if user-service is unavailable
            return new UserKPIs(0, 0, 0, 0, 0, 0);
        }
    }
}