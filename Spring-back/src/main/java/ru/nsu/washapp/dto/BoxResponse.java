package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BoxResponse(
        Long id,
        @JsonProperty("car_wash_id") Long carWashId,
        Integer number,
        String status
) {
}
