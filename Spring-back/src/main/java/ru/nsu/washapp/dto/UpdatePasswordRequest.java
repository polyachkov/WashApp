package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdatePasswordRequest {
    @JsonProperty("old_password")
    @NotBlank(message = "Old password cannot be empty")
    @Size(min = 8, max = 72, message = "Old password must be between 8 and 72 characters long")
    private String oldPassword;

    @JsonProperty("new_password")
    @NotBlank(message = "New password cannot be empty")
    @Size(min = 8, max = 72, message = "New password must be between 8 and 72 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "New password must contain at least one letter and one digit"
    )
    private String newPassword;
}
