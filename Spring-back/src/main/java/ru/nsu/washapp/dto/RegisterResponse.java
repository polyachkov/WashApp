package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record RegisterResponse(
        Long id,
        String email,
        String role,
        @JsonProperty("created_at") Instant createdAt
) {
}
