package com.cyberwatch.controller;

import com.cyberwatch.dto.LoginRequest;
import com.cyberwatch.dto.LoginResponse;
import com.cyberwatch.dto.RegisterRequest;
import com.cyberwatch.dto.UserResponse;
import com.cyberwatch.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody RegisterRequest request
    ) {
        UserResponse user = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }
    @PostMapping("/login")
public ResponseEntity<LoginResponse> login(
        @RequestBody LoginRequest request
) {
    return ResponseEntity.ok(authService.login(request));
}

}