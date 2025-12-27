package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record TariffResponse(
        Long id,
        String name,
        @JsonProperty("price_per_minute") BigDecimal pricePerMinute,
        String description,
        Boolean active
) {}
