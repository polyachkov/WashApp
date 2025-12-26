package ru.nsu.washapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.nsu.washapp.dto.UpdatePasswordRequest;
import ru.nsu.washapp.dto.UserResponse;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.model.User;
import ru.nsu.washapp.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public UserResponse getCurrentUserProfile() {
        return toUserResponse(getRequiredCurrentUser());
    }

    public UserResponse updatePassword(UpdatePasswordRequest request) {
        User user = getRequiredCurrentUser();

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "INVALID_CREDENTIALS",
                    "Old password does not match",
                    null
            );
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    private User getRequiredCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null);
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }

        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new ApiException(
                            HttpStatus.UNAUTHORIZED,
                            "UNAUTHORIZED",
                            "Unauthorized",
                            null
                    ));
        }

        throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null);
    }

    private static UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
