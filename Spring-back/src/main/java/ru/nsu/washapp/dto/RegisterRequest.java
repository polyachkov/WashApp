package ru.nsu.washapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 5, message = "Password must be at least 5 characters long")
    private String password;
}