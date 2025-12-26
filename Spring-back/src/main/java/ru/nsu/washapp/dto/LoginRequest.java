package ru.nsu.washapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email cannot be empty")
    @Size(min = 3, max = 320, message = "Email length must be between 3 and 320 characters")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;
}
