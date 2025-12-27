package ru.nsu.washapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.nsu.washapp.dto.CreateSessionRequest;
import ru.nsu.washapp.dto.PageResponse;
import ru.nsu.washapp.dto.WashSessionResponse;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.model.Role;
import ru.nsu.washapp.model.Tariff;
import ru.nsu.washapp.model.User;
import ru.nsu.washapp.model.WashBox;
import ru.nsu.washapp.model.WashSession;
import ru.nsu.washapp.repository.TariffRepository;
import ru.nsu.washapp.repository.UserRepository;
import ru.nsu.washapp.repository.WashBoxRepository;
import ru.nsu.washapp.repository.WashSessionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
public class SessionService {

    // статусы боксов (из ТЗ)
    private static final String BOX_AVAILABLE = "AVAILABLE";
    private static final String BOX_BUSY = "BUSY";

    // статусы сессий (черновик из ТЗ)
    private static final String SESSION_ACTIVE = "ACTIVE";
    private static final String SESSION_FINISHED = "FINISHED";

    private final WashSessionRepository washSessionRepository;
    private final WashBoxRepository washBoxRepository;
    private final TariffRepository tariffRepository;
    private final UserRepository userRepository;

    /**
     * 7.1 POST /api/v1/sessions
     */
    @Transactional
    public WashSessionResponse start(CreateSessionRequest request) {
        User user = getRequiredCurrentUser();

        WashBox box = washBoxRepository.findById(request.getBoxId())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "BOX_NOT_FOUND",
                        "Box not found",
                        null
                ));

        if (!BOX_AVAILABLE.equalsIgnoreCase(box.getStatus())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "BOX_NOT_AVAILABLE",
                    "Box is not available",
                    null
            );
        }

        Tariff tariff = tariffRepository.findById(request.getTariffId())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "TARIFF_NOT_FOUND",
                        "Tariff not found",
                        null
                ));

        if (tariff.getActive() != null && !tariff.getActive()) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "TARIFF_INACTIVE",
                    "Tariff is inactive",
                    null
            );
        }

        // бизнес-правило: 1 активная сессия на пользователя
        if (washSessionRepository.existsByUser_IdAndStatus(user.getId(), SESSION_ACTIVE)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "ACTIVE_SESSION_EXISTS",
                    "User already has an active session",
                    null
            );
        }

        // делаем бокс занятым
        box.setStatus(BOX_BUSY);
        washBoxRepository.save(box);

        WashSession session = WashSession.builder()
                .user(user)
                .box(box)
                .tariff(tariff)
                .startedAt(OffsetDateTime.now(ZoneOffset.UTC))
                .endedAt(null)
                .totalAmount(null)
                .status(SESSION_ACTIVE)
                .build();

        WashSession saved = washSessionRepository.save(session);
        return toResponse(saved);
    }

    /**
     * 7.2 POST /api/v1/sessions/{id}/finish
     */
    @Transactional
    public WashSessionResponse finish(Long sessionId) {
        User currentUser = getRequiredCurrentUser();

        WashSession session = washSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "SESSION_NOT_FOUND",
                        "Session not found",
                        null
                ));

        requireOwnerOrAdmin(currentUser, session);

        if (!SESSION_ACTIVE.equalsIgnoreCase(session.getStatus())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "SESSION_NOT_ACTIVE",
                    "Session is not active",
                    null
            );
        }

        OffsetDateTime endedAt = OffsetDateTime.now(ZoneOffset.UTC);
        session.setEndedAt(endedAt);

        // считаем минуты (округление вверх до целой минуты)
        long seconds = Duration.between(session.getStartedAt(), endedAt).getSeconds();
        long minutes = (seconds + 59) / 60; // ceil
        if (minutes < 1) minutes = 1;

        BigDecimal pricePerMinute = session.getTariff().getPricePerMinute();
        BigDecimal total = pricePerMinute
                .multiply(BigDecimal.valueOf(minutes))
                .setScale(2, RoundingMode.HALF_UP);

        session.setTotalAmount(total);
        session.setStatus(SESSION_FINISHED);

        // возвращаем бокс в AVAILABLE
        WashBox box = session.getBox();
        box.setStatus(BOX_AVAILABLE);
        washBoxRepository.save(box);

        WashSession saved = washSessionRepository.save(session);
        return toResponse(saved);
    }

    /**
     * 7.3 GET /api/v1/sessions/{id}
     */
    public WashSessionResponse getById(Long id) {
        User currentUser = getRequiredCurrentUser();

        WashSession session = washSessionRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "SESSION_NOT_FOUND",
                        "Session not found",
                        null
                ));

        requireOwnerOrAdmin(currentUser, session);
        return toResponse(session);
    }

    /**
     * 7.4 GET /api/v1/sessions/my
     */
    public PageResponse<WashSessionResponse> mySessions(String status, Pageable pageable) {
        User user = getRequiredCurrentUser();

        Page<WashSessionResponse> page;
        if (status == null || status.isBlank()) {
            page = washSessionRepository.findAllByUser_Id(user.getId(), pageable).map(this::toResponse);
        } else {
            page = washSessionRepository.findAllByUser_IdAndStatus(user.getId(), status, pageable).map(this::toResponse);
        }

        return PageResponse.from(page);
    }

    private WashSessionResponse toResponse(WashSession s) {
        return new WashSessionResponse(
                s.getId(),
                s.getUser().getId(),
                s.getBox().getId(),
                s.getTariff().getId(),
                s.getStartedAt(),
                s.getEndedAt(),
                s.getTotalAmount(),
                s.getStatus()
        );
    }

    private void requireOwnerOrAdmin(User currentUser, WashSession session) {
        boolean isOwner = session.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Forbidden", null);
        }
    }

    // скопировано по стилю из UserService (чтобы единообразно)
    private User getRequiredCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null);
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }

        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new ApiException(
                            HttpStatus.UNAUTHORIZED,
                            "UNAUTHORIZED",
                            "Unauthorized",
                            null
                    ));
        }

        throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null);
    }
}
