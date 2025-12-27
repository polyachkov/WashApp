package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateSessionRequest {

    @JsonProperty("box_id")
    @NotNull(message = "box_id is required")
    @Positive(message = "box_id must be positive")
    private Long boxId;

    @JsonProperty("tariff_id")
    @NotNull(message = "tariff_id is required")
    @Positive(message = "tariff_id must be positive")
    private Long tariffId;
}
