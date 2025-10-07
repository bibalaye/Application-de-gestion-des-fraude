package ugb.miage.ingestion.controller;

import ugb.miage.ingestion.dto.FraudPredictionDTO;
import ugb.miage.ingestion.dto.TransactionDTO;
import ugb.miage.ingestion.service.IngestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/ingest")
public class IngestionController {
    @Autowired
    private IngestionService ingestionService;

    // Endpoint pour une seule transaction (on peut le garder)
    @PostMapping("/transaction")
    public ResponseEntity<FraudPredictionDTO> ingestAndScoreTransaction(@RequestBody TransactionDTO transaction) {
        return ResponseEntity.ok(ingestionService.processAndAlertTransaction(transaction));
    }

    // Nouvel endpoint pour traiter un lot de transactions
    @PostMapping("/transactions")
    public ResponseEntity<List<FraudPredictionDTO>> ingestAndScoreTransactionBatch(@RequestBody List<TransactionDTO> transactions) {
        return ResponseEntity.ok(ingestionService.processAndAlertTransactionBatch(transactions));
    }
}