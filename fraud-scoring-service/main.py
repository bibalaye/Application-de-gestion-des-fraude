# main.py
from fastapi import FastAPI, HTTPException
from schemas import TransactionInput, FraudPredictionOutput
import joblib
import pandas as pd
import numpy as np
import sklearn
import joblib
import scipy
from typing import List
app = FastAPI(title="Fraud Detection Scoring Service", version="1.0.0")

model = None
rob_scaler = None
std_scaler = None
model_version = "1.0.0"

@app.on_event("startup")
async def load_model_artifacts():
    global model, rob_scaler, std_scaler
    try:
        model = joblib.load("models/model.pkl")
        rob_scaler = joblib.load("models/robust_scaler.pkl")
        std_scaler = joblib.load("models/std_scaler.pkl")
        print("✅ Modèle et scalers chargés.")
    except Exception as e:
        print(f"❌ ERREUR de chargement : {e}")

@app.post("/predict", response_model=FraudPredictionOutput)
async def predict_fraud(transaction: TransactionInput):
    if model is None or rob_scaler is None or std_scaler is None:
        raise HTTPException(status_code=503, detail="Modèle ou scalers non chargés.")
    try:
        # Créer une copie pour le prétraitement
        input_data = transaction.model_dump()
        input_df = pd.DataFrame([input_data])
        
        # Application des scalers
        input_df['scaled_amount'] = rob_scaler.transform(input_df[['amount']])
        input_df['scaled_time'] = std_scaler.transform(input_df[['time']])
        
        # ordonnancement des colonnes pour le modèle
        feature_order = [f'V{i}' for i in range(1, 29)] + ['scaled_amount', 'scaled_time']
        input_for_model = input_df[feature_order]

        # Prédiction
        proba = model.predict_proba(input_for_model)[0, 1]
        threshold = 0.5 # À adapter
        prediction = 1 if proba >= threshold else 0

        return FraudPredictionOutput(
            is_fraud=prediction,
            fraud_probability=round(float(proba), 4),
            model_version=model_version
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur pendant la prédiction : {e}")

# Nouvel endpoint pour le traitement par lot
@app.post("/predict-batch", response_model=List[FraudPredictionOutput])
async def predict_fraud_batch(transactions: List[TransactionInput]):
    if model is None or rob_scaler is None or std_scaler is None:
        raise HTTPException(status_code=503, detail="Modèle ou scalers non chargés.")
    
    if not transactions:
        return []

    try:
        # Convertir la liste d'objets Pydantic en DataFrame Pandas
        input_data = [t.model_dump() for t in transactions]
        input_df = pd.DataFrame(input_data)
        
        # Appliquer le scaling sur les colonnes 'Time' et 'Amount' du DataFrame
        input_df['scaled_amount'] = rob_scaler.transform(input_df[['amount']])
        input_df['scaled_time'] = std_scaler.transform(input_df[['time']])
        
        # Sélectionner et ordonner les colonnes pour le modèle
        feature_order = [f'V{i}' for i in range(1, 29)] + ['scaled_amount', 'scaled_time']
        input_for_model = input_df[feature_order]

        # Prédiction des probabilités pour tout le lot en une seule fois (plus efficace)
        probabilities = model.predict_proba(input_for_model)[:, 1]
        
        # Appliquer le seuil
        THRESHOLD = 0.5 # À adapter
        predictions = (probabilities >= THRESHOLD).astype(int)

        # Préparer la liste des réponses
        results = []
        for i in range(len(transactions)):
            results.append(FraudPredictionOutput(
                is_fraud=predictions[i],
                fraud_probability=round(float(probabilities[i]), 4),
                model_version=model_version,
                # Si vous voulez l'ID, il faudrait le passer dans le TransactionInput
                #transaction_id=transactions[i].transaction_id 
            ))
            
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur pendant la prédiction par lot : {e}")    
