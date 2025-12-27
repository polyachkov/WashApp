package ru.nsu.washapp.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCarWashRequest {
    @NotBlank(message = "Name cannot be empty")
    @Size(min = 1, max = 200, message = "Name length must be between 1 and 200 characters")
    private String name;

    @NotBlank(message = "Address cannot be empty")
    @Size(min = 1, max = 500, message = "Address length must be between 1 and 500 characters")
    private String address;

    @NotNull(message = "Latitude cannot be null")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @NotNull(message = "Longitude cannot be null")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;
}
