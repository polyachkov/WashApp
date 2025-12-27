package ru.nsu.washapp.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.nsu.washapp.dto.CarWashResponse;
import ru.nsu.washapp.dto.CreateCarWashRequest;
import ru.nsu.washapp.dto.PageResponse;
import ru.nsu.washapp.dto.UpdateCarWashRequest;
import ru.nsu.washapp.service.CarWashService;

@RestController
@RequestMapping("/api/v1/car-washes")
@RequiredArgsConstructor
@Validated
public class CarWashController {

    private final CarWashService carWashService;

    @GetMapping
    public PageResponse<CarWashResponse> list(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(name = "radius_km", required = false) Double radiusKm
    ) {
        return carWashService.list(page, size, search);
    }

    @GetMapping("/{id}")
    public CarWashResponse getById(@PathVariable Long id) {
        return carWashService.getById(id);
    }

    @PostMapping
    public ResponseEntity<CarWashResponse> create(@Valid @RequestBody CreateCarWashRequest request) {
        CarWashResponse response = carWashService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    public CarWashResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCarWashRequest request
    ) {
        return carWashService.update(id, request);
    }
}
