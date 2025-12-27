package ru.nsu.washapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.nsu.washapp.model.CarWash;

public interface CarWashRepository extends JpaRepository<CarWash, Long> {
    Page<CarWash> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
            String name,
            String address,
            Pageable pageable
    );
}
