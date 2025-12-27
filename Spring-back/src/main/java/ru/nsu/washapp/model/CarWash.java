package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "car_wash")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarWash {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 200)
    private String name;


    @Column(nullable = false, length = 500)
    private String address;


    private Double latitude;
    private Double longitude;


    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now(ZoneOffset.UTC);
        }
    }
}
