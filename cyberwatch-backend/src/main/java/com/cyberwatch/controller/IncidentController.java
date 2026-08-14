package com.cyberwatch.controller;

import com.cyberwatch.entity.Incident;
import com.cyberwatch.entity.IncidentStatus;
import com.cyberwatch.service.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(
            IncidentService incidentService
    ) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public Incident getIncidentById(
            @PathVariable Long id
    ) {
        return incidentService.getIncidentById(id);
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(
            @RequestBody Incident incident
    ) {
        Incident savedIncident =
                incidentService.createIncident(incident);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedIncident);
    }

    @PatchMapping("/{id}/status")
    public Incident updateStatus(
            @PathVariable Long id,
            @RequestParam IncidentStatus status
    ) {
        return incidentService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(
            @PathVariable Long id
    ) {
        incidentService.deleteIncident(id);

        return ResponseEntity.noContent().build();
    }
    @PostMapping("/from-alert/{alertId}")
public ResponseEntity<Incident> createIncidentFromAlert(
        @PathVariable Long alertId
) {
    Incident incident =
            incidentService.createIncidentFromAlert(alertId);

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(incident);
}
}