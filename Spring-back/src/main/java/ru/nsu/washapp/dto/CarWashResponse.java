package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class CarWashResponse {
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;

    @JsonProperty("created_at")
    private OffsetDateTime createdAt;
}
