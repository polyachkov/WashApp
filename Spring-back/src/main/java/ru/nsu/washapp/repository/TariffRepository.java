package ru.nsu.washapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nsu.washapp.model.Tariff;

@Repository
public interface TariffRepository extends JpaRepository<Tariff, Long> {
}
