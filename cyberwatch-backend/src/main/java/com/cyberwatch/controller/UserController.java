package com.cyberwatch.controller;

import com.cyberwatch.entity.Role;
import com.cyberwatch.entity.User;
import com.cyberwatch.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cyberwatch.dto.AnalystResponse;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

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

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user
    ) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }
}