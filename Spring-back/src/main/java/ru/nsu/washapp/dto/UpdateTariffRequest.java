package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateTariffRequest(
        @Size(max = 150) String name,

        @JsonProperty("price_per_minute")
        @DecimalMin(value = "0.00", inclusive = false, message = "price_per_minute must be > 0")
        BigDecimal pricePerMinute,

        String description,

        Boolean active
) {}
