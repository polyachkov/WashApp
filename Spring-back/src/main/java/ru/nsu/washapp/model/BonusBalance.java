package ru.nsu.washapp.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "bonus_balance", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BonusBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @OneToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;


    @Column(nullable = false)
    private Integer balance;
}