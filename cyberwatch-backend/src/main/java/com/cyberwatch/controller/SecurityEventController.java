package com.cyberwatch.controller;

import com.cyberwatch.dto.SecurityEventRequest;
import com.cyberwatch.entity.SecurityAlert;
import com.cyberwatch.service.DetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class SecurityEventController {

    private final DetectionService detectionService;

    public SecurityEventController(
            DetectionService detectionService
    ) {
        this.detectionService = detectionService;
    }

    @PostMapping
    public ResponseEntity<?> analyzeEvent(
            @RequestBody SecurityEventRequest event
    ) {

        SecurityAlert alert =
                detectionService.analyzeEvent(event);

        if (alert == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(alert);
    }
}