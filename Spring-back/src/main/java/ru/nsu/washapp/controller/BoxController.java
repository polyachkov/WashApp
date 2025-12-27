package ru.nsu.washapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nsu.washapp.dto.BoxResponse;
import ru.nsu.washapp.dto.CreateBoxRequest;
import ru.nsu.washapp.dto.PageResponse;
import ru.nsu.washapp.service.BoxService;

@RestController
@RequiredArgsConstructor
public class BoxController {

    private final BoxService boxService;

    /**
     * Вариант 1:
     * GET /api/v1/boxes?car_wash_id=10
     */
    @GetMapping("/api/v1/boxes")
    public PageResponse<BoxResponse> list(
            @RequestParam("car_wash_id") Long carWashId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return boxService.listByCarWashId(carWashId, pageable);
    }

    /**
     * Вариант 2:
     * GET /api/v1/car-washes/{carWashId}/boxes
     */
    @GetMapping("/api/v1/car-washes/{carWashId}/boxes")
    public PageResponse<BoxResponse> listByCarWash(
            @PathVariable Long carWashId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return boxService.listByCarWashId(carWashId, pageable);
    }

    /**
     * (ADMIN) POST /api/v1/boxes
     */
    @PostMapping("/api/v1/boxes")
    public ResponseEntity<BoxResponse> create(@Valid @RequestBody CreateBoxRequest request) {
        BoxResponse created = boxService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
