package com.example.alertservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Nous stockons les détails de la transaction directement dans l'alerte pour l'investigation
    private Double time;
    private Double amount;
    private Double v1;
    private Double v2;
    private Double v3;
    private Double v4;
    private Double v5;
    private Double v6;
    private Double v7;
    private Double v8;
    private Double v9;
    private Double v10;
    private Double v11;
    private Double v12;
    private Double v13;
    private Double v14;
    private Double v15;
    private Double v16;
    private Double v17;
    private Double v18;
    private Double v19;
    private Double v20;
    private Double v21;
    private Double v22;
    private Double v23;
    private Double v24;
    private Double v25;
    private Double v26;
    private Double v27;
    private Double v28;
    private Double fraudProbability;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // e.g., "NOUVELLE", "EN_COURS", "CLOTUREE_FRAUDE", "CLOTUREE_NON_FRAUDE"
    private String comments;
    
    // Ajoutez d'autres champs
}