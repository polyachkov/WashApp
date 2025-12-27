package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateTariffRequest(
        @NotBlank @Size(max = 150) String name,

        @JsonProperty("price_per_minute")
        @NotNull
        @DecimalMin(value = "0.00", inclusive = false, message = "price_per_minute must be > 0")
        BigDecimal pricePerMinute,

        String description,

        @NotNull Boolean active
) {}
