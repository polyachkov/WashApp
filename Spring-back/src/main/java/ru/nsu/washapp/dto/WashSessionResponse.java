package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record WashSessionResponse(
        Long id,

        @JsonProperty("user_id")
        Long userId,

        @JsonProperty("box_id")
        Long boxId,

        @JsonProperty("tariff_id")
        Long tariffId,

        @JsonProperty("started_at")
        OffsetDateTime startedAt,

        @JsonProperty("ended_at")
        OffsetDateTime endedAt,

        @JsonProperty("total_amount")
        BigDecimal totalAmount,

        String status
) {}
