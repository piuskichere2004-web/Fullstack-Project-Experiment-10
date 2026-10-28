
package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import com.example.demo.entity.User;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @Valid @RequestBody LoginRequest request) {

        User user = userRepository
                .findByUsername(request.username())
                .orElse(null);

        if (user == null ||
                !passwordEncoder.matches(
                        request.password(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password"));
        }

        LoginResponse response = new LoginResponse(
                jwtService.generateToken(user.getUsername()),
                user.getUsername(),
                user.getFullName(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
    
@GetMapping("/me")
public ResponseEntity<Object> getCurrentUser(
        org.springframework.security.core.Authentication authentication) {

    if (authentication == null ||
            !authentication.isAuthenticated()) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
    }

    User user = userRepository
            .findByUsername(authentication.getName())
            .orElse(null);

    if (user == null) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "User not found"));
    }

    return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "fullName", user.getFullName(),
            "role", user.getRole()
    ));
}

}
