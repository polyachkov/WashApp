package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "bonus_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BonusTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;


    @Column(nullable = false)
    private Integer amount;


    private String reason;


    @ManyToOne
    @JoinColumn(name = "session_id")
    private WashSession session;


    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
