package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

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


    @Column(nullable = false, length = 150)
    private String name;


    @Column(nullable = false, length = 300)
    private String address;


    private Double latitude;
    private Double longitude;


    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}