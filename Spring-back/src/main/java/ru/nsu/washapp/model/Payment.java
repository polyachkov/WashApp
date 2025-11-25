package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payment", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"session_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @OneToOne(optional = false)
    @JoinColumn(name = "session_id")
    private WashSession session;


    @Column(nullable = false)
    private Double amount;


    @Column(nullable = false, length = 50)
    private String method;


    @Column(name = "timestamp", nullable = false)
    private OffsetDateTime timestamp;


    @Column(nullable = false, length = 50)
    private String status;
}