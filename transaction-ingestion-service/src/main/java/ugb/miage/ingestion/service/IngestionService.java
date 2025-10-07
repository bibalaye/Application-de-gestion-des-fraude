package ugb.miage.ingestion.service;

import ugb.miage.ingestion.dto.FraudPredictionDTO;
import ugb.miage.ingestion.dto.TransactionDTO;
import ugb.miage.ingestion.dto.AlertDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class IngestionService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${scoring.service.url.single}") // URL pour transaction unique (si on la garde)
    private String scoringServiceUrlSingle;
    
    @Value("${scoring.service.url.batch}")  // URL pour le traitement par lot
    private String scoringServiceUrlBatch;


    // Nouvelle méthode pour le traitement par lot
    public List<FraudPredictionDTO> processTransactionBatch(List<TransactionDTO> transactions) {
        if (transactions == null || transactions.isEmpty()) {
            return List.of(); // Retourne une liste vide si l'entrée est vide
        }

        try {
            HttpEntity<List<TransactionDTO>> requestEntity = new HttpEntity<>(transactions);
            
            // On utilise exchange() avec ParameterizedTypeReference pour gérer une liste en réponse
            ResponseEntity<List<FraudPredictionDTO>> response = restTemplate.exchange(
                scoringServiceUrlBatch,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<List<FraudPredictionDTO>>() {}
            );

            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("Erreur lors de l'appel au service de scoring pour un lot: " + e.getMessage());
            throw new RuntimeException("Le service de scoring est indisponible pour le traitement par lot.", e);
        }
    }
    @Value("${alerting.service.url}")
    private String alertingServiceUrl;

    // Seuil de fraude, pourrait être dans application.properties
    private static final double FRAUD_THRESHOLD = 0.5; // À ajuster selon votre modèle

    public FraudPredictionDTO processAndAlertTransaction(TransactionDTO transaction) {
        // 1. Appeler le service de scoring
        FraudPredictionDTO prediction = restTemplate.postForObject(
            scoringServiceUrlSingle, // Supposons l'endpoint pour transaction unique
            transaction, 
            FraudPredictionDTO.class
        );

        // 2. Vérifier si une alerte doit être créée
        if (prediction != null && prediction.getFraud_probability() >= FRAUD_THRESHOLD) {
            System.out.println("Fraude détectée ! Création de l'alerte...");
            createAlert(transaction, prediction.getFraud_probability());
        }

        return prediction;
    }
    public List<FraudPredictionDTO> processAndAlertTransactionBatch(List<TransactionDTO> transactions) {
        // 1. Appeler le service de scoring pour le traitement par lot
        List<FraudPredictionDTO> predictions = processTransactionBatch(transactions);

        // 2. Vérifier chaque prédiction et créer des alertes si nécessaire
        if (predictions != null) {
            for (int i = 0; i < predictions.size(); i++) {
                FraudPredictionDTO prediction = predictions.get(i);
                if (prediction != null && prediction.getFraud_probability() >= FRAUD_THRESHOLD) {
                    System.out.println("Fraude détectée pour la transaction " + i + " ! Création de l'alerte...");
                    createAlert(transactions.get(i), prediction.getFraud_probability());
                }
            }
        }

        return predictions;
    }
    
    private void createAlert(TransactionDTO transaction, double probability) {
        // Construire le corps de la requête pour le service d'alertes
        AlertDTO alertData = AlertDTO.builder()
                .time(transaction.getTime())
                .amount(transaction.getAmount())
                .v1(transaction.getV1())
                .v2(transaction.getV2())
                .v3(transaction.getV3())
                .v4(transaction.getV4())
                .v5(transaction.getV5())
                .v6(transaction.getV6())
                .v7(transaction.getV7())
                .v8(transaction.getV8())
                .v9(transaction.getV9())
                .v10(transaction.getV10())
                .v11(transaction.getV11())
                .v12(transaction.getV12())
                .v13(transaction.getV13())
                .v14(transaction.getV14())
                .v15(transaction.getV15())
                .v16(transaction.getV16())
                .v17(transaction.getV17())
                .v18(transaction.getV18())
                .v19(transaction.getV19())
                .v20(transaction.getV20())
                .v21(transaction.getV21())
                .v22(transaction.getV22())
                .v23(transaction.getV23())
                .v24(transaction.getV24())
                .v25(transaction.getV25())
                .v26(transaction.getV26())
                .v27(transaction.getV27())
                .v28(transaction.getV28())
                .fraudProbability(probability)
                .build();
        try {
            // Appeler le service d'alertes pour créer l'alerte
            restTemplate.postForObject(alertingServiceUrl, alertData, String.class); // On peut ignorer la réponse
            System.out.println("Alerte créée avec succès.");
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'alerte: " + e.getMessage());
            // Dans un vrai système, on ajouterait cette tâche à une file de re-tentative
        }
    }
}