package ru.nsu.washapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.nsu.washapp.dto.LoginResponse;
import ru.nsu.washapp.dto.RegisterResponse;
import ru.nsu.washapp.dto.UserSummary;
import ru.nsu.washapp.dto.RegisterRequest;
import ru.nsu.washapp.dto.LoginRequest;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.model.Role;
import ru.nsu.washapp.model.User;
import ru.nsu.washapp.repository.UserRepository;

import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public RegisterResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "EMAIL_ALREADY_USED",
                    "Email уже используется",
                    null
            );
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "VALIDATION_ERROR",
                    "Некорректные данные запроса",
                    Map.of("confirm_password", "Passwords do not match")
            );
        }

        User user = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getCreatedAt()
        );
    }

    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        User existingUser = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.UNAUTHORIZED,
                        "INVALID_CREDENTIALS",
                        "Неверная пара email/пароль",
                        null
                ));

        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "INVALID_CREDENTIALS",
                    "Неверная пара email/пароль",
                    null
            );
        }

        String jwt = jwtService.generateToken(existingUser);
        return new LoginResponse(
                jwt,
                "Bearer",
                jwtService.getAccessTokenTtlSeconds(),
                new UserSummary(
                        existingUser.getId(),
                        existingUser.getEmail(),
                        existingUser.getRole().name()
                )
        );
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
