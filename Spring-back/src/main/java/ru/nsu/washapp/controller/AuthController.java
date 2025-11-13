package ru.nsu.washapp.controller;

import jakarta.validation.Valid;
import ru.nsu.washapp.dto.RegisterRequest;
import ru.nsu.washapp.dto.LoginRequest;
import ru.nsu.washapp.model.User;
import ru.nsu.washapp.model.Role;
import ru.nsu.washapp.repository.UserRepository;
import ru.nsu.washapp.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }

    @PostMapping("/login")
    public Map<String, String> login(@Valid @RequestBody LoginRequest request) {
        var existingUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Found user: " + existingUser.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String jwt = jwtService.generateToken(existingUser);
        System.out.println("Generated JWT: " + jwt);

        return Map.of("token", jwt);
    }
}
