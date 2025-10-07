# Transaction Ingestion Service

![Java](https://img.shields.io/badge/Java-17-blue.svg) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen.svg) ![Maven](https://img.shields.io/badge/Maven-4.0.0-red.svg)

## 1. Vue d'ensemble

Le **Transaction Ingestion Service** est une application backend Spring Boot conçue pour recevoir des transactions financières. Son rôle principal est de servir de point d'entrée pour les transactions, de les valider, puis de les transmettre à un service de scoring pour évaluer leur potentiel de fraude.

Ce document fournit les informations nécessaires aux développeurs frontend pour interagir avec les points d'accès (endpoints) de l'API de ce service.

## 2. Démarrage Rapide

Assurez-vous d'avoir les prérequis suivants installés sur votre machine :

*   **Java 17**
*   **Maven**
*   **Docker** (Optionnel, pour un déploiement conteneurisé)

### Exécution locale

1.  **Clonez le dépôt :**
    ```bash
    git clone <URL_DU_REPO>
    cd transaction-ingestion-service
    ```

2.  **Lancez l'application avec Maven :**
    Le projet inclut un wrapper Maven (`mvnw`), vous n'avez donc pas besoin d'une installation globale de Maven.

    *   Sur macOS/Linux :
        ```bash
        ./mvnw spring-boot:run
        ```
    *   Sur Windows :
        ```bash
        .\mvnw.cmd spring-boot:run
        ```

    Le service démarrera par défaut sur `http://localhost:8080`.

### Exécution avec Docker

1.  **Construisez l'image Docker :**
    ```bash
    docker build -t transaction-ingestion-service .
    ```

2.  **Lancez le conteneur :**
    ```bash
    docker run -p 8080:8080 transaction-ingestion-service
    ```

## 3. API Endpoints

L'API est préfixée par `/ingest`.

---

### 3.1. Ingestion d'une seule transaction

Cet endpoint permet de soumettre une seule transaction pour analyse de fraude.

*   **URL :** `/ingest/transaction`
*   **Méthode :** `POST`
*   **Description :** Reçoit un objet `TransactionDTO`, le traite et retourne une prédiction de fraude.

#### Requête

**Body (Exemple JSON)**
```json
{
  "time": 400.5,
  "amount": 150.75,
  "V1": -1.359820401,
  "V2": -0.072781143,
  "V3": 2.536346738,
  "V4": 1.378155224,
  "V5": -0.33832077,
  "V6": 0.462387778,
  "V7": 0.239598548,
  "V8": 0.098697901,
  "V9": 0.36378697,
  "V10": 0.090794172,
  "V11": -0.551599533,
  "V12": -0.617800856,
  "V13": -0.991389847,
  "V14": -0.311169354,
  "V15": 1.468176972,
  "V16": -0.470400525,
  "V17": 0.207971242,
  "V18": 0.02579058,
  "V19": 0.40399296,
  "V20": 0.251412098,
  "V21": -0.018306778,
  "V22": 0.277837576,
  "V23": -0.11047391,
  "V24": 0.066928075,
  "V25": 0.128539358,
  "V26": -0.189114844,
  "V27": 0.133558377,
  "V28": -0.021053053
}
```

#### Réponse (Succès : 200 OK)

**Body (Exemple JSON)**
```json
{
  "is_fraud": 1,
  "fraud_probability": 0.987,
  "model_version": "v1.2.3"
}
```

#### Exemple avec `curl`

```bash
curl -X POST http://localhost:8080/ingest/transaction \
-H "Content-Type: application/json" \
-d '{
  "id": "txn_12345",
  "amount": 99.99,
  "timestamp": "2024-07-21T10:30:00Z",
  "userId": "user_abc",
  "merchantId": "merchant_xyz",
  "paymentMethod": "CREDIT_CARD"
}'
```

---

### 3.2. Ingestion d'un lot de transactions

Cet endpoint est optimisé pour recevoir une liste de transactions en un seul appel.

*   **URL :** `/ingest/transactions`
*   **Méthode :** `POST`
*   **Description :** Reçoit un tableau de `TransactionDTO` et retourne une liste correspondante de prédictions de fraude.

#### Requête

**Body (Exemple JSON)**
```json
[
  {
    "time": 400.5,
    "amount": 150.75,
    "V1": -1.359820401,
    "V2": -0.072781143,
    "V3": 2.536346738,
    "V4": 1.378155224,
    "V5": -0.33832077,
    "V6": 0.462387778,
    "V7": 0.239598548,
    "V8": 0.098697901,
    "V9": 0.36378697,
    "V10": 0.090794172,
    "V11": -0.551599533,
    "V12": -0.617800856,
    "V13": -0.991389847,
    "V14": -0.311169354,
    "V15": 1.468176972,
    "V16": -0.470400525,
    "V17": 0.207971242,
    "V18": 0.02579058,
    "V19": 0.40399296,
    "V20": 0.251412098,
    "V21": -0.018306778,
    "V22": 0.277837576,
    "V23": -0.11047391,
    "V24": 0.066928075,
    "V25": 0.128539358,
    "V26": -0.189114844,
    "V27": 0.133558377,
    "V28": -0.021053053
  },
  {
    "time": 800.0,
    "amount": 25.00,
    "V1": -0.96627171,
    "V2": -0.185226008,
    "V3": 1.792993341,
    "V4": -0.86329127,
    "V5": -0.01030888,
    "V6": 1.247203168,
    "V7": 0.237608944,
    "V8": 0.377435875,
    "V9": -1.387024063,
    "V10": -0.054951982,
    "V11": -0.226487264,
    "V12": 0.17822822,
    "V13": 0.507756933,
    "V14": -0.28792375,
    "V15": -0.631418117,
    "V16": -1.059647249,
    "V17": -0.684092786,
    "V18": 1.965775009,
    "V19": -1.232622037,
    "V20": -0.208037781,
    "V21": -0.108300452,
    "V22": 0.00527359,
    "V23": -0.190320519,
    "V24": -1.175575334,
    "V25": 0.647376035,
    "V26": -0.221928843,
    "V27": 0.062722849,
    "V28": 0.061457629
  }
]
```

#### Réponse (Succès : 200 OK)

**Body (Exemple JSON)**
```json
[
  {
    "is_fraud": 1,
    "fraud_probability": 0.987,
    "model_version": "v1.2.3"
  },
  {
    "is_fraud": 0,
    "fraud_probability": 0.012,
    "model_version": "v1.2.3"
  }
]
```

#### Exemple avec `curl`

```bash
curl -X POST http://localhost:8080/ingest/transactions \
-H "Content-Type: application/json" \
-d '[
  {
    "id": "txn_12345",
    "amount": 99.99,
    "timestamp": "2024-07-21T10:30:00Z",
    "userId": "user_abc",
    "merchantId": "merchant_xyz",
    "paymentMethod": "CREDIT_CARD"
  },
  {
    "id": "txn_67890",
    "amount": 12.50,
    "timestamp": "2024-07-21T10:32:00Z",
    "userId": "user_def",
    "merchantId": "merchant_abc",
    "paymentMethod": "PAYPAL"
  }
]'
```

## 4. Modèles de Données (DTOs)

### `TransactionDTO` (Entrée)

Ce DTO représente les données d'une transaction entrante. Il contient des caractéristiques brutes, y compris des composantes principales (V1-V28) issues d'une analyse préalable (par exemple, une ACP).

| Champ    | Type   | Description                                                                 |
| -------- | ------ | --------------------------------------------------------------------------- |
| `time`   | Double | Temps écoulé (en secondes) depuis un point de référence.                    |
| `amount` | Double | Montant de la transaction.                                                  |
| `V1`     | Double | Caractéristique anonymisée (Composante Principale 1).                       |
| `V2`     | Double | Caractéristique anonymisée (Composante Principale 2).                       |
| `...`    | `...`  | ...                                                                         |
| `V28`    | Double | Caractéristique anonymisée (Composante Principale 28).                      |

### `FraudPredictionDTO` (Sortie)

Ce DTO encapsule le résultat de la prédiction de fraude retourné par le service de scoring.

| Champ               | Type   | Description                                                                 |
| ------------------- | ------ | --------------------------------------------------------------------------- |
| `is_fraud`          | Int    | Résultat de la prédiction : `1` pour fraude, `0` pour non-fraude.           |
| `fraud_probability` | Double | Score de probabilité de fraude (de 0.0 à 1.0).                              |
| `model_version`     | String | Version du modèle de machine learning utilisé pour la prédiction.           |

### `AlertDTO` (Interne)

Ce DTO est utilisé en interne pour envoyer des informations au service d'alerting lorsqu'une transaction est jugée frauduleuse. Il n'est pas directement exposé via les endpoints publics d'ingestion.

| Champ              | Type   | Description                                      |
| ------------------ | ------ | ------------------------------------------------ |
| `time`             | Double | Temps de la transaction.                         |
| `amount`           | Double | Montant de la transaction.                       |
| `v1` - `v28`       | Double | Caractéristiques anonymisées de la transaction.  |
| `fraudProbability` | Double | Probabilité de fraude calculée.                  |

## 5. Configuration

Les configurations de base se trouvent dans `src/main/resources/application.properties`. Le port par défaut du serveur est `8080`.

```properties
# Exemple de configuration
server.port=8080
```