package ru.nsu.washapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateBoxRequest {

    @JsonProperty("car_wash_id")
    @NotNull(message = "car_wash_id is required")
    private Long carWashId;

    @NotNull(message = "number is required")
    @Min(value = 1, message = "number must be >= 1")
    private Integer number;

    @NotBlank(message = "status is required")
    @Pattern(
            regexp = "AVAILABLE|BUSY|OUT_OF_SERVICE",
            message = "status must be one of: AVAILABLE, BUSY, OUT_OF_SERVICE"
    )
    private String status;
}
