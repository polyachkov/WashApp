package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "wash_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WashSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;


    @ManyToOne(optional = false)
    @JoinColumn(name = "box_id")
    private WashBox box;


    @ManyToOne(optional = false)
    @JoinColumn(name = "tariff_id")
    private Tariff tariff;


    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt;


    @Column(name = "ended_at")
    private OffsetDateTime endedAt;


    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;


    @Column(nullable = false, length = 50)
    private String status;
}
