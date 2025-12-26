package ru.nsu.washapp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ru.nsu.washapp.dto.LoginResponse;
import ru.nsu.washapp.dto.RegisterResponse;
import ru.nsu.washapp.dto.UserSummary;
import ru.nsu.washapp.exception.GlobalExceptionHandler;
import ru.nsu.washapp.service.AuthService;
import ru.nsu.washapp.service.JwtService;
import ru.nsu.washapp.service.UserService;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserService userService;

    @Test
    void register_returns201AndBody() throws Exception {
        RegisterResponse response = new RegisterResponse(
                1L,
                "user@example.com",
                "USER",
                Instant.parse("2025-11-20T14:21:16Z")
        );
        when(authService.register(any())).thenReturn(response);

        String body = """
                {
                  "email": "user@example.com",
                  "password": "passw0rd",
                  "confirm_password": "passw0rd"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.created_at").exists());
    }

    @Test
    void login_returns200AndBody() throws Exception {
        LoginResponse response = new LoginResponse(
                "jwt-string",
                "Bearer",
                3600L,
                new UserSummary(1L, "user@example.com", "USER")
        );
        when(authService.login(any())).thenReturn(response);

        String body = """
                {
                  "email": "user@example.com",
                  "password": "passw0rd"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").value("jwt-string"))
                .andExpect(jsonPath("$.token_type").value("Bearer"))
                .andExpect(jsonPath("$.expires_in").value(3600))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.user.email").value("user@example.com"))
                .andExpect(jsonPath("$.user.role").value("USER"));
    }

    @Test
    void register_validationError_returnsStructuredError() throws Exception {
        String body = """
                {
                  "email": "user@example.com",
                  "password": "short",
                  "confirm_password": ""
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.error.details.confirm_password").exists());
    }

    @Test
    void login_validationError_returnsStructuredError() throws Exception {
        String body = """
                {
                  "email": "not-an-email",
                  "password": ""
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.error.details.email").exists());
    }
}
