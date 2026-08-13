package com.cyberwatch.controller;

import com.cyberwatch.entity.AlertStatus;
import com.cyberwatch.entity.SecurityAlert;
import com.cyberwatch.service.SecurityAlertService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    public SecurityAlertController(
            SecurityAlertService securityAlertService
    ) {
        this.securityAlertService = securityAlertService;
    }

    @GetMapping
    public List<SecurityAlert> getAllAlerts() {
        return securityAlertService.getAllAlerts();
    }

    @GetMapping("/{id}")
    public SecurityAlert getAlertById(
            @PathVariable Long id
    ) {
        return securityAlertService.getAlertById(id);
    }

    @PostMapping
    public ResponseEntity<SecurityAlert> createAlert(
            @RequestBody SecurityAlert alert
    ) {
        SecurityAlert savedAlert =
                securityAlertService.createAlert(alert);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedAlert);
    }

    @PatchMapping("/{id}/status")
    public SecurityAlert updateStatus(
            @PathVariable Long id,
            @RequestParam AlertStatus status
    ) {
        return securityAlertService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(
            @PathVariable Long id
    ) {
        securityAlertService.deleteAlert(id);

        return ResponseEntity.noContent().build();
    }
}