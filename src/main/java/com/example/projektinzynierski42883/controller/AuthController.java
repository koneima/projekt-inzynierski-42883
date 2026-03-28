package com.example.projektinzynierski42883.controller;

import com.example.projektinzynierski42883.model.User;
import com.example.projektinzynierski42883.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.projektinzynierski42883.dto.LoginRequest;
import com.example.projektinzynierski42883.dto.RegisterRequest;
import com.example.projektinzynierski42883.dto.UserResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email jest wymagany.");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Hasło musi mieć minimum 6 znaków.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Hasła nie są takie same.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Użytkownik z takim emailem już istnieje.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setCompany(request.getCompany());
        user.setRole(request.getRole() == null || request.getRole().isBlank() ? "User" : request.getRole());
        user.setPassword(request.getPassword()); // do projektu OK, produkcyjnie trzeba hashować

        User saved = userRepository.save(user);

        UserResponse response = new UserResponse(
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getCompany(),
                saved.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (!user.getPassword().equals(request.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Nieprawidłowy email lub hasło.");
                    }

                    UserResponse response = new UserResponse(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getEmail(),
                            user.getCompany(),
                            user.getRole()
                    );

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Nieprawidłowy email lub hasło."));
    }
}