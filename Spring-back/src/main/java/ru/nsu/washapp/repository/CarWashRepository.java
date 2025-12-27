package ru.nsu.washapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nsu.washapp.model.CarWash;

@Repository
public interface CarWashRepository extends JpaRepository<CarWash, Long> {
}
