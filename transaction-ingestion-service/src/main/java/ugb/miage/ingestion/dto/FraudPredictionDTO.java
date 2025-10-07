package ugb.miage.ingestion.dto;

import lombok.Data;

@Data
public class FraudPredictionDTO {
    // Correspond au FraudPredictionOutput du service FastAPI
    private int is_fraud;
    private double fraud_probability;
    private String model_version;
}