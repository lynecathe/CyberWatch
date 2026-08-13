package com.cyberwatch.dto;

import com.cyberwatch.entity.Role;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        Role role
) {
}