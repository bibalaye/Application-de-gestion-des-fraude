package com.example.alertservice.controller;

import com.example.alertservice.dto.DashboardKPIs;
import com.example.alertservice.model.Alert;
import com.example.alertservice.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/alerts")
public class AlertController {
    @Autowired
    private AlertService alertService;
    @GetMapping({ "", "/" })
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
        Alert alert = alertService.getAlertById(id);
        if (alert != null) {
            return ResponseEntity.ok(alert);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping({ "", "/" })
    public ResponseEntity<Alert> createAlert(@RequestBody Alert alertData) {
        return new ResponseEntity<>(alertService.createAlert(alertData), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/qualify")
    public ResponseEntity<Alert> qualifyAlert(
            @PathVariable Long id,
            @RequestParam String status, // "CLOTUREE_FRAUDE" ou "CLOTUREE_NON_FRAUDE"
            @RequestParam(required = false) String comments) {
        Alert qualifiedAlert = alertService.qualifyAlert(id, status, comments);
        if (qualifiedAlert != null) {
            return ResponseEntity.ok(qualifiedAlert);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/dashboard/kpis")
    public ResponseEntity<DashboardKPIs> getDashboardKPIs() {
        return ResponseEntity.ok(alertService.getDashboardKPIs());
    }
}