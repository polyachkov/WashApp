package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "wash_box", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"carwash_id", "number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WashBox {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "carwash_id")
    private CarWash carWash;


    @Column(nullable = false)
    private Integer number;


    @Column(nullable = false, length = 50)
    private String status;
}