package com.cyberwatch.dto;

import com.cyberwatch.entity.Role;

public record LoginResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        Role role,
        String token
) {
}