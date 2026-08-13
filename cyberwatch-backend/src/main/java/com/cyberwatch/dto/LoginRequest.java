package com.cyberwatch.dto;

public record LoginRequest(
        String email,
        String password
) {
}