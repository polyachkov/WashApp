package ru.nsu.washapp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ru.nsu.washapp.dto.UpdatePasswordRequest;
import ru.nsu.washapp.dto.UserResponse;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.exception.GlobalExceptionHandler;
import ru.nsu.washapp.service.JwtService;
import ru.nsu.washapp.service.UserService;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.http.HttpStatus;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @Test
    void getCurrentUser_returns200AndBody() throws Exception {
        UserResponse response = new UserResponse(
                1L,
                "user@example.com",
                "USER",
                Instant.parse("2025-11-20T14:21:16Z")
        );
        when(userService.getCurrentUserProfile()).thenReturn(response);

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.created_at").exists());
    }

    @Test
    void updatePassword_returns200AndBody() throws Exception {
        UserResponse response = new UserResponse(
                1L,
                "user@example.com",
                "USER",
                Instant.parse("2025-11-20T14:21:16Z")
        );
        when(userService.updatePassword(any(UpdatePasswordRequest.class))).thenReturn(response);

        String body = """
                {
                  "old_password": "oldPass123",
                  "new_password": "newPass123"
                }
                """;

        mockMvc.perform(patch("/api/v1/users/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.created_at").exists());
    }

    @Test
    void updatePassword_validationError_returnsStructuredError() throws Exception {
        String body = """
                {
                  "old_password": "",
                  "new_password": "short"
                }
                """;

        mockMvc.perform(patch("/api/v1/users/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.error.details.old_password").exists());
    }

    @Test
    void updatePassword_invalidCredentials_returnsStructuredError() throws Exception {
        when(userService.updatePassword(any(UpdatePasswordRequest.class)))
                .thenThrow(new ApiException(
                        HttpStatus.UNAUTHORIZED,
                        "INVALID_CREDENTIALS",
                        "Old password does not match",
                        null
                ));

        String body = """
                {
                  "old_password": "oldPass123",
                  "new_password": "newPass123"
                }
                """;

        mockMvc.perform(patch("/api/v1/users/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("INVALID_CREDENTIALS"));
    }
}
