package ru.nsu.washapp.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.nsu.washapp.model.Role;
import ru.nsu.washapp.model.User;
import ru.nsu.washapp.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        String adminEmail = "admin@washapp.local";
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
    }
}
