package ru.nsu.washapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.nsu.washapp.dto.BoxResponse;
import ru.nsu.washapp.dto.CreateBoxRequest;
import ru.nsu.washapp.dto.PageResponse;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.model.CarWash;
import ru.nsu.washapp.model.Role;
import ru.nsu.washapp.model.User;
import ru.nsu.washapp.model.WashBox;
import ru.nsu.washapp.repository.CarWashRepository;
import ru.nsu.washapp.repository.WashBoxRepository;

@Service
@RequiredArgsConstructor
public class BoxService {

    private final WashBoxRepository washBoxRepository;
    private final CarWashRepository carWashRepository;

    public PageResponse<BoxResponse> listByCarWashId(Long carWashId, Pageable pageable) {
        Page<BoxResponse> page = washBoxRepository
                .findAllByCarWash_Id(carWashId, pageable)
                .map(this::toResponse);

        return PageResponse.from(page);
    }

    public BoxResponse create(CreateBoxRequest request) {
        requireAdmin();

        CarWash carWash = carWashRepository.findById(request.getCarWashId())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "CAR_WASH_NOT_FOUND",
                        "Car wash not found",
                        null
                ));

        WashBox box = WashBox.builder()
                .carWash(carWash)
                .number(request.getNumber())
                .status(request.getStatus())
                .build();

        try {
            WashBox saved = washBoxRepository.save(box);
            return toResponse(saved);
        } catch (DataIntegrityViolationException e) {
            // уникальность (carwash_id, number) из БД
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "BOX_ALREADY_EXISTS",
                    "Box with this number already exists for this car wash",
                    null
            );
        }
    }

    private BoxResponse toResponse(WashBox box) {
        return new BoxResponse(
                box.getId(),
                box.getCarWash().getId(),
                box.getNumber(),
                box.getStatus()
        );
    }

    private void requireAdmin() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User user)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", null);
        }
        // в твоём проекте authority = role.name() (без ROLE_)
        if (user.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "Forbidden", null);
        }
    }
}
