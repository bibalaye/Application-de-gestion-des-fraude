package ugb.miage.ingestion.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AlertDTO {
    // Cette classe doit correspondre à ce que l'endpoint /alerts attend
    // (ici, les champs de l'entité Alert sans id, createdAt, status)
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
}