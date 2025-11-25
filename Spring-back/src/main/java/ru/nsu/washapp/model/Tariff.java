package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "tariff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tariff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 150)
    private String name;


    @Column(name = "price_per_minute", nullable = false)
    private Double pricePerMinute;


    private String description;


    @Column(nullable = false)
    private Boolean active = true;
}