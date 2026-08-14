package com.cyberwatch.service;

import com.cyberwatch.entity.Incident;
import com.cyberwatch.entity.IncidentSeverity;
import com.cyberwatch.entity.IncidentStatus;
import com.cyberwatch.entity.SecurityAlert;
import com.cyberwatch.repository.IncidentRepository;
import com.cyberwatch.repository.SecurityAlertRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final SecurityAlertRepository securityAlertRepository;

    public IncidentService(
            IncidentRepository incidentRepository,
            SecurityAlertRepository securityAlertRepository
    ) {
        this.incidentRepository = incidentRepository;
        this.securityAlertRepository = securityAlertRepository;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Incident not found")
                );
    }

    public Incident createIncident(Incident incident) {

        if (incident.getStatus() == null) {
            incident.setStatus(IncidentStatus.OPEN);
        }

        return incidentRepository.save(incident);
    }

   public Incident createIncidentFromAlert(Long alertId) {

    if (incidentRepository.existsByAlertId(alertId)) {
        throw new IllegalStateException(
                "An incident already exists for this alert"
        );
    }

    SecurityAlert alert = securityAlertRepository
            .findById(alertId)
            .orElseThrow(
                    () -> new IllegalArgumentException("Alert not found")
            );

    IncidentSeverity severity =
            IncidentSeverity.valueOf(
                    alert.getSeverity().name()
            );

    Incident incident = Incident.builder()
            .title(alert.getTitle())
            .description(alert.getDescription())
            .severity(severity)
            .status(IncidentStatus.OPEN)
            .alert(alert)
            .build();

    return incidentRepository.save(incident);
}
    public Incident updateStatus(
            Long id,
            IncidentStatus status
    ) {

        Incident incident = getIncidentById(id);

        incident.setStatus(status);

        return incidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {

        if (!incidentRepository.existsById(id)) {
            throw new IllegalArgumentException("Incident not found");
        }

        incidentRepository.deleteById(id);
    }
}