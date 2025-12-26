package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email cannot be empty")
    @Size(min = 3, max = 320, message = "Email length must be between 3 and 320 characters")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Password must contain at least one letter and one digit"
    )
    private String password;

    @JsonProperty("confirm_password")
    @NotBlank(message = "Confirm password cannot be empty")
    @Size(min = 8, max = 72, message = "Confirm password must be between 8 and 72 characters long")
    private String confirmPassword;
}
