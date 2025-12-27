package ru.nsu.washapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.nsu.washapp.model.WashSession;

@Repository
public interface WashSessionRepository extends JpaRepository<WashSession, Long> {

    boolean existsByUser_IdAndStatus(Long userId, String status);

    Page<WashSession> findAllByUser_Id(Long userId, Pageable pageable);

    Page<WashSession> findAllByUser_IdAndStatus(Long userId, String status, Pageable pageable);
}
