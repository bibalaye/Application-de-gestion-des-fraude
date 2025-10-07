package com.example.userservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data; // Si vous utilisez Lombok
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType; // Importez FetchType
import java.time.LocalDateTime; // Importez LocalDateTime
import jakarta.persistence.Column; // Importez Column

@Entity
@Table(name = "users") // Nom de la table dans MySQL
@Data // Génère getters, setters, toString, etc. (Lombok)
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true) // Ajoutez cette annotation
    private String username;
    @Column(unique = true) // Ajoutez cette annotation
    private String email;
    private String password;
    @ManyToOne(fetch = FetchType.EAGER) // Ajoutez FetchType.EAGER ici
    private Role role;
    private String status;
    private LocalDateTime createdAt; // Changez String en LocalDateTime
    private LocalDateTime updatedAt; // Changez String en LocalDateTime
    private LocalDateTime lastLogin; // Changez String en LocalDateTime
    private LocalDateTime lastPasswordChange; // Changez String en LocalDateTime
}