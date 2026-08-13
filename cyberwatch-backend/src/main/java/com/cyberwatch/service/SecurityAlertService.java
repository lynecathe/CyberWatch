package com.cyberwatch.service;

import com.cyberwatch.entity.AlertStatus;
import com.cyberwatch.entity.SecurityAlert;
import com.cyberwatch.repository.SecurityAlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityAlertService {

    private final SecurityAlertRepository securityAlertRepository;

    public SecurityAlertService(
            SecurityAlertRepository securityAlertRepository
    ) {
        this.securityAlertRepository = securityAlertRepository;
    }

    public List<SecurityAlert> getAllAlerts() {
        return securityAlertRepository.findAll();
    }

    public SecurityAlert getAlertById(Long id) {
        return securityAlertRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Alert not found")
                );
    }

    public SecurityAlert createAlert(SecurityAlert alert) {
        if (alert.getStatus() == null) {
            alert.setStatus(AlertStatus.NEW);
        }

        return securityAlertRepository.save(alert);
    }

    public SecurityAlert updateStatus(
            Long id,
            AlertStatus status
    ) {
        SecurityAlert alert = getAlertById(id);

        alert.setStatus(status);

        return securityAlertRepository.save(alert);
    }

    public void deleteAlert(Long id) {
        if (!securityAlertRepository.existsById(id)) {
            throw new IllegalArgumentException("Alert not found");
        }

        securityAlertRepository.deleteById(id);
    }
}
