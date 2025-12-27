package ru.nsu.washapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ru.nsu.washapp.dto.CarWashResponse;
import ru.nsu.washapp.dto.CreateCarWashRequest;
import ru.nsu.washapp.dto.PageResponse;
import ru.nsu.washapp.dto.UpdateCarWashRequest;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.model.CarWash;
import ru.nsu.washapp.repository.CarWashRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarWashService {

    private final CarWashRepository carWashRepository;

    public PageResponse<CarWashResponse> list(int page, int size, String search) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<CarWash> result;

        if (search == null || search.isBlank()) {
            result = carWashRepository.findAll(pageRequest);
        } else {
            String query = search.trim();
            result = carWashRepository.findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                    query,
                    query,
                    pageRequest
            );
        }

        List<CarWashResponse> content = result.map(CarWashService::toResponse).getContent();
        return new PageResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    public CarWashResponse getById(Long id) {
        CarWash carWash = carWashRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "RESOURCE_NOT_FOUND",
                        "Car wash not found",
                        null
                ));
        return toResponse(carWash);
    }

    public CarWashResponse create(CreateCarWashRequest request) {
        CarWash carWash = CarWash.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        CarWash saved = carWashRepository.save(carWash);
        return toResponse(saved);
    }

    public CarWashResponse update(Long id, UpdateCarWashRequest request) {
        if (request.getName() == null
                && request.getAddress() == null
                && request.getLatitude() == null
                && request.getLongitude() == null) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "VALIDATION_ERROR",
                    "No fields provided for update",
                    null
            );
        }

        CarWash carWash = carWashRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "RESOURCE_NOT_FOUND",
                        "Car wash not found",
                        null
                ));

        if (request.getName() != null) {
            carWash.setName(request.getName());
        }
        if (request.getAddress() != null) {
            carWash.setAddress(request.getAddress());
        }
        if (request.getLatitude() != null) {
            carWash.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            carWash.setLongitude(request.getLongitude());
        }

        CarWash saved = carWashRepository.save(carWash);
        return toResponse(saved);
    }

    private static CarWashResponse toResponse(CarWash carWash) {
        return new CarWashResponse(
                carWash.getId(),
                carWash.getName(),
                carWash.getAddress(),
                carWash.getLatitude(),
                carWash.getLongitude(),
                carWash.getCreatedAt()
        );
    }
}
