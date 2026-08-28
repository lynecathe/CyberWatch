package com.cyberwatch.dto;

import com.cyberwatch.entity.Role;

import java.time.LocalDateTime;

public record AnalystResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        Role role,
        LocalDateTime createdAt
) {
}