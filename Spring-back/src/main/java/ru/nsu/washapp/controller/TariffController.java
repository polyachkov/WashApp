package ru.nsu.washapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nsu.washapp.dto.*;
import ru.nsu.washapp.service.TariffService;

@RestController
@RequestMapping("/api/v1/tariffs")
@RequiredArgsConstructor
public class TariffController {

    private final TariffService tariffService;

    /**
     * 6.1 GET /api/v1/tariffs
     */
    @GetMapping
    public PageResponse<TariffResponse> list(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return tariffService.list(pageable);
    }

    /**
     * 6.2 (ADMIN) POST /api/v1/tariffs
     */
    @PostMapping
    public ResponseEntity<TariffResponse> create(@Valid @RequestBody CreateTariffRequest request) {
        TariffResponse created = tariffService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * 6.3 (ADMIN) PATCH /api/v1/tariffs/{id}
     */
    @PatchMapping("/{id}")
    public TariffResponse patch(@PathVariable Long id, @Valid @RequestBody UpdateTariffRequest request) {
        return tariffService.patch(id, request);
    }
}
