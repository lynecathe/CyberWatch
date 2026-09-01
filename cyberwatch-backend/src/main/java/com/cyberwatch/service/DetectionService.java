package com.cyberwatch.service;

import com.cyberwatch.dto.SecurityEventRequest;
import com.cyberwatch.entity.AlertSeverity;
import com.cyberwatch.entity.AlertStatus;
import com.cyberwatch.entity.MachineStatus;
import com.cyberwatch.entity.SecurityAlert;
import com.cyberwatch.repository.MachineRepository;
import org.springframework.stereotype.Service;

@Service
public class DetectionService {

    private final SecurityAlertService securityAlertService;
    private final MachineRepository machineRepository;
    private final MachineService machineService;
    private final IncidentService incidentService;

    public DetectionService(
            SecurityAlertService securityAlertService,
            MachineRepository machineRepository,
            MachineService machineService,
            IncidentService incidentService
    ) {
        this.securityAlertService = securityAlertService;
        this.machineRepository = machineRepository;
        this.machineService = machineService;
        this.incidentService = incidentService;
    }

    public SecurityAlert analyzeEvent(
            SecurityEventRequest event
    ) {

        if (event.eventType() == null) {
            return null;
        }

        String eventType =
                event.eventType().toUpperCase();

        return switch (eventType) {

            case "SSH_LOGIN_FAILED" ->
                    detectSshBruteForce(event);

            case "PORT_SCAN" ->
                    detectPortScan(event);

            case "MALICIOUS_ACTIVITY" ->
                    detectMaliciousActivity(event);

            default -> null;
        };
    }

    private SecurityAlert detectSshBruteForce(
            SecurityEventRequest event
    ) {

        if (
                event.attempts() == null ||
                event.attempts() < 10
        ) {
            return null;
        }

        SecurityAlert alert = SecurityAlert.builder()
                .title("Possible SSH brute-force attack")
                .description(
                        event.attempts()
                                + " failed SSH login attempts detected."
                )
                .sourceIp(event.sourceIp())
                .destinationIp(event.destinationIp())
                .severity(AlertSeverity.HIGH)
                .status(AlertStatus.NEW)
                .build();

        return securityAlertService.createAlert(alert);
    }

    private SecurityAlert detectPortScan(
            SecurityEventRequest event
    ) {

        SecurityAlert alert = SecurityAlert.builder()
                .title("Possible port scan detected")
                .description(
                        "Multiple ports were scanned from source IP "
                                + event.sourceIp()
                                + "."
                )
                .sourceIp(event.sourceIp())
                .destinationIp(event.destinationIp())
                .severity(AlertSeverity.HIGH)
                .status(AlertStatus.NEW)
                .build();

        return securityAlertService.createAlert(alert);
    }

    private SecurityAlert detectMaliciousActivity(
            SecurityEventRequest event
    ) {

        machineRepository
                .findByIpAddress(event.destinationIp())
                .ifPresent(
                        machine ->
                                machineService.updateStatus(
                                        machine.getId(),
                                        MachineStatus.COMPROMISED
                                )
                );

        SecurityAlert alert = SecurityAlert.builder()
                .title("Critical malicious activity detected")
                .description(
                        buildMaliciousActivityDescription(event)
                )
                .sourceIp(event.sourceIp())
                .destinationIp(event.destinationIp())
                .severity(AlertSeverity.CRITICAL)
                .status(AlertStatus.NEW)
                .build();

        SecurityAlert savedAlert =
                securityAlertService.createAlert(alert);

        /*
         * CRITICAL alerts automatically create incidents.
         */
        incidentService.createIncidentFromAlert(
                savedAlert.getId()
        );

        return savedAlert;
    }

    private String buildMaliciousActivityDescription(
            SecurityEventRequest event
    ) {

        return machineRepository
                .findByIpAddress(event.destinationIp())
                .map(machine ->
                        "Malicious activity detected on machine "
                                + machine.getHostname()
                                + " ("
                                + machine.getIpAddress()
                                + "). The machine was automatically marked as COMPROMISED."
                )
                .orElse(
                        "Potential malicious activity detected on destination "
                                + event.destinationIp()
                                + ". No registered machine matched this IP address."
                );
    }
}