package com.cyberwatch.dto;

public record SecurityEventRequest(
        String eventType,
        String sourceIp,
        String destinationIp,
        Integer attempts
) {
}