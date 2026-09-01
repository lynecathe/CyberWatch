package com.cyberwatch.dto;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password
) {
}