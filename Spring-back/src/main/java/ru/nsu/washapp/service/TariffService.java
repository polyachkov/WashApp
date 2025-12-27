package ru.nsu.washapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import ru.nsu.washapp.dto.*;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.model.Role;
import ru.nsu.washapp.model.Tariff;
import ru.nsu.washapp.model.User;
import ru.nsu.washapp.repository.TariffRepository;
import ru.nsu.washapp.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class TariffService {

    private final TariffRepository tariffRepository;
    private final UserRepository userRepository;

    public PageResponse<TariffResponse> list(Pageable pageable) {
        Page<TariffResponse> page = tariffRepository
                .findAll(pageable)
                .map(this::toResponse);

        return PageResponse.from(page);
    }

    public TariffResponse create(CreateTariffRequest request) {
        requireAdmin();

        Tariff tariff = Tariff.builder()
                .name(request.name())
                .pricePerMinute(request.pricePerMinute())
                .description(request.description())
                .active(request.active())
                .build();

        Tariff saved = tariffRepository.save(tariff);
        return toResponse(saved);
    }

    public TariffResponse patch(Long id, UpdateTariffRequest request) {
        requireAdmin();

        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "TARIFF_NOT_FOUND",
                        "Tariff not found",
                        null
                ));

        if (request.name() != null) tariff.setName(request.name());
        if (request.pricePerMinute() != null) tariff.setPricePerMinute(request.pricePerMinute());
        if (request.description() != null) tariff.setDescription(request.description());
        if (request.active() != null) tariff.setActive(request.active());

        Tariff saved = tariffRepository.save(tariff);
        return toResponse(saved);
    }

    private TariffResponse toResponse(Tariff t) {
        return new TariffResponse(
                t.getId(),
                t.getName(),
                t.getPricePerMinute(),
                t.getDescription(),
                t.getActive()
        );
    }

    private void requireAdmin() {
        User user = getRequiredCurrentUser();
        if (user.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Forbidden", null);
        }
    }

    private User getRequiredCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null);
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User u) {
            return u;
        }

        if (principal instanceof UserDetails ud) {
            return userRepository.findByEmail(ud.getUsername())
                    .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null));
        }

        throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null);
    }
}
