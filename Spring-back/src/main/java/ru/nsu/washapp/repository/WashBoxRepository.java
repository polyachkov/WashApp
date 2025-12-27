package ru.nsu.washapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nsu.washapp.model.WashBox;

@Repository
public interface WashBoxRepository extends JpaRepository<WashBox, Long> {

    // Вариант для фильтрации по car_wash_id через связь ManyToOne
    Page<WashBox> findAllByCarWash_Id(Long carWashId, Pageable pageable);
}
