package com.cyberwatch.service;

import com.cyberwatch.entity.Incident;
import com.cyberwatch.entity.IncidentStatus;
import com.cyberwatch.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(
            IncidentRepository incidentRepository
    ) {
        this.incidentRepository = incidentRepository;
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