# Service de Scoring de Fraude (Fraud Detection Scoring Service)

![Python Version](https://img.shields.io/badge/python-3.10+-blue.svg)
![Framework](https://img.shields.io/badge/framework-FastAPI-green.svg)
![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du service](#lancement-du-service)
  - [Localement avec Uvicorn](#localement-avec-uvicorn)
  - [Avec Docker](#avec-docker)
- [Utilisation de l'API](#utilisation-de-lapi)
  - [Endpoint: `/predict`](#endpoint-predict)
  - [Endpoint: `/predict-batch`](#endpoint-predict-batch)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Vue d'ensemble

Ce service expose une API RESTful pour évaluer le risque de fraude pour des transactions financières. Il utilise un modèle de Machine Learning pré-entraîné pour retourner un score de probabilité de fraude et une classification binaire (fraude / non-fraude) en temps réel.

Le service est construit avec FastAPI pour des performances élevées et est entièrement conteneurisable avec Docker pour un déploiement simplifié.

## Fonctionnalités

- **Prédiction en temps réel** : Obtenez un score de fraude pour une transaction unique.
- **Traitement par lot (Batch)** : Évaluez plusieurs transactions en un seul appel API pour une meilleure efficacité.
- **Modèle de ML intégré** : Utilise un modèle `scikit-learn` chargé au démarrage.
- **Prétraitement des données** : Applique automatiquement les transformations (scaling) nécessaires aux données d'entrée.
- **Conteneurisation** : Prêt pour le déploiement via Docker.

## Architecture

Le service est basé sur une architecture simple et robuste :

1.  **API Gateway (FastAPI)** : Reçoit les requêtes HTTP, valide les données d'entrée grâce aux schémas Pydantic (`schemas.py`) et expose les endpoints de prédiction.
2.  **Moteur de Scoring (`main.py`)** :
    - Charge les artefacts du modèle (modèle de classification et scalers) au démarrage.
    - Prétraite les données de transaction entrantes pour correspondre au format attendu par le modèle.
    - Invoque le modèle pour obtenir une prédiction.
    - Formate la réponse.
3.  **Modèles (`/models`)** : Contient les fichiers sérialisés (`.pkl`) du modèle de Machine Learning et des objets de prétraitement (RobustScaler, StandardScaler).

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Python](https://www.python.org/downloads/) (version 3.10 ou supérieure)
- [Docker](https://www.docker.com/get-started) (recommandé pour le déploiement)

## Installation

1.  **Clonez le dépôt**
    ```bash
    git clone <URL_DU_REPO>
    cd fraud-scoring-service
    ```

2.  **Créez et activez un environnement virtuel** (recommandé)
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # Sur Windows: .venv\Scripts\activate
    ```

3.  **Installez les dépendances**
    ```bash
    pip install -r requirements.txt
    ```

## Lancement du service

### Localement avec Uvicorn

Pour le développement, vous pouvez lancer le service avec Uvicorn, qui rechargera automatiquement l'application lors de modifications du code.

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le service sera accessible à l'adresse `http://localhost:8000`.

### Avec Docker

Pour un environnement de production ou pour garantir la portabilité, utilisez Docker.

1.  **Construisez l'image Docker**
    ```bash
    docker build -t fraud-scoring-service .
    ```

2.  **Lancez le conteneur**
    ```bash
    docker run -p 8000:8000 --name fraud-api fraud-scoring-service
    ```

Le service sera également accessible à l'adresse `http://localhost:8000`.

## Utilisation de l'API

L'API fournit une documentation interactive (Swagger UI) accessible à l'adresse `http://localhost:8000/docs` lorsque le service est en cours d'exécution.

### Endpoint: `/predict`

Cet endpoint évalue une seule transaction.

- **Méthode** : `POST`
- **Description** : Prédit si une transaction est frauduleuse.
- **Corps de la requête** (`application/json`) :

  ```json
  {
    "time": 1500.0,
    "amount": 120.50,
    "V1": -1.359820, "V2": -0.072781, "V3": 2.536347, "V4": 1.378155,
    "V5": -0.338321, "V6": 0.462388, "V7": 0.239599, "V8": 0.098698,
    "V9": 0.363787, "V10": 0.090794, "V11": -0.551600, "V12": -0.617801,
    "V13": -0.991390, "V14": -0.311169, "V15": 1.468177, "V16": -0.470401,
    "V17": 0.207971, "V18": 0.025791, "V19": 0.403993, "V20": 0.251412,
    "V21": -0.018307, "V22": 0.277838, "V23": -0.110474, "V24": 0.066928,
    "V25": 0.128539, "V26": -0.189115, "V27": 0.133558, "V28": -0.021053
  }
  ```

- **Réponse succès** (`200 OK`) :

  ```json
  {
    "is_fraud": 0,
    "fraud_probability": 0.0012,
    "transaction_id": null,
    "model_version": "1.0.0"
  }
  ```

### Endpoint: `/predict-batch`

Cet endpoint évalue une liste de transactions en un seul appel.

- **Méthode** : `POST`
- **Description** : Prédit le statut de fraude pour une liste de transactions.
- **Corps de la requête** (`application/json`) : Un tableau d'objets `TransactionInput`.

  ```json
  [
    { "time": 1500.0, "amount": 120.50, "V1": -1.35, /* ... */, "V28": -0.02 },
    { "time": 1600.0, "amount": 89.99, "V1": 1.19, /* ... */, "V28": 0.01 }
  ]
  ```

- **Réponse succès** (`200 OK`) : Un tableau d'objets `FraudPredictionOutput`.

  ```json
  [
    {
      "is_fraud": 0,
      "fraud_probability": 0.0012,
      "transaction_id": null,
      "model_version": "1.0.0"
    },
    {
      "is_fraud": 1,
      "fraud_probability": 0.9876,
      "transaction_id": null,
      "model_version": "1.0.0"
    }
  ]
  ```

## Tests

Le projet inclut une suite de tests pour valider le comportement de l'API. Pour les exécuter, utilisez `pytest`.

```bash
pytest
```

## Structure du projet

```
.
├── Dockerfile              # Fichier de configuration pour Docker
├── main.py                 # Logique de l'API (endpoints, chargement du modèle)
├── models/                 # Répertoire pour les modèles sérialisés
│   ├── model.pkl           # Modèle de classification
│   ├── robust_scaler.pkl   # Scaler pour la variable 'amount'
│   └── std_scaler.pkl      # Scaler pour la variable 'time'
├── README.md               # Ce fichier
├── requirements.txt        # Dépendances Python
├── schemas.py              # Schémas de données Pydantic (validation)
└── test_main.py            # Tests unitaires pour l'API
```

## Contribuer

Les contributions sont les bienvenues ! Pour les changements majeurs, veuillez ouvrir une "issue" pour discuter de ce que vous souhaitez modifier.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
