package com.cyberwatch.controller;

import com.cyberwatch.dto.AnalystResponse;
import com.cyberwatch.dto.UserResponse;
import com.cyberwatch.entity.Role;
import com.cyberwatch.entity.User;
import com.cyberwatch.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    /*
     * Return all CyberWatch users.
     * Passwords are never returned.
     */
    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    /*
     * Return analysts only.
     */
    @GetMapping("/analysts")
    public List<AnalystResponse> getAnalysts() {

        return userRepository
                .findByRole(Role.ANALYST)
                .stream()
                .map(user -> new AnalystResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt()
                ))
                .toList();
    }

    /*
     * Change a user's role.
     *
     * An administrator cannot remove
     * their own ADMIN role.
     */
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateRole(
            @PathVariable Long id,
            @RequestParam Role role,
            Authentication authentication
    ) {

        User user = userRepository
                .findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "User not found"
                        )
                );

        String connectedUserEmail =
                authentication.getName();

        boolean modifyingOwnAccount =
                user.getEmail()
                        .equalsIgnoreCase(
                                connectedUserEmail
                        );

        if (
                modifyingOwnAccount &&
                user.getRole() == Role.ADMIN &&
                role != Role.ADMIN
        ) {
            throw new IllegalArgumentException(
                    "You cannot remove your own ADMIN role"
            );
        }

        user.setRole(role);

        User savedUser =
                userRepository.save(user);

        return ResponseEntity.ok(
                toUserResponse(savedUser)
        );
    }

    private UserResponse toUserResponse(
            User user
    ) {

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}