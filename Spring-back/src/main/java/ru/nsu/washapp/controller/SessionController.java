package ru.nsu.washapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nsu.washapp.dto.CreateSessionRequest;
import ru.nsu.washapp.dto.PageResponse;
import ru.nsu.washapp.dto.WashSessionResponse;
import ru.nsu.washapp.service.SessionService;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    /**
     * 7.1 Создание (старт) сессии
     * POST /api/v1/sessions
     */
    @PostMapping
    public ResponseEntity<WashSessionResponse> start(@Valid @RequestBody CreateSessionRequest request) {
        WashSessionResponse created = sessionService.start(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * 7.2 Завершение сессии
     * POST /api/v1/sessions/{id}/finish
     */
    @PostMapping("/{id}/finish")
    public WashSessionResponse finish(@PathVariable Long id) {
        return sessionService.finish(id);
    }

    /**
     * 7.3 Получение сессии по id
     * GET /api/v1/sessions/{id}
     */
    @GetMapping("/{id}")
    public WashSessionResponse getById(@PathVariable Long id) {
        return sessionService.getById(id);
    }

    /**
     * 7.4 Список сессий текущего пользователя
     * GET /api/v1/sessions/my?page=0&size=20&status=ACTIVE
     */
    @GetMapping("/my")
    public PageResponse<WashSessionResponse> my(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return sessionService.mySessions(status, pageable);
    }
}
