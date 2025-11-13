package ru.nsu.washapp.controller;

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
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        System.out.println(">>> Login endpoint reached: " + user.getEmail());
        var existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Found user: " + existingUser.getEmail());

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String jwt = jwtService.generateToken(existingUser);
        System.out.println("Generated JWT: " + jwt);

        return Map.of("token", jwt);
    }


}
