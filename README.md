# Fraud Detection Microservice Application

This project is a microservice-based application for detecting fraudulent financial transactions. It is composed of several services that work together to provide a complete solution for ingesting, scoring, and managing transactions and alerts.

## Table of Contents

- [Architecture](#architecture)
- [Services](#services)
  - [API Gateway](#api-gateway)
  - [User Service](#user-service)
  - [Transaction Ingestion Service](#transaction-ingestion-service)
  - [Fraud Scoring Service](#fraud-scoring-service)
  - [Alert Service](#alert-service)
- [Getting Started](#getting-started)
- [Docker](#docker)

## Architecture

The application follows a microservice architecture, with each service responsible for a specific part of the system. The services communicate with each other through a central API Gateway, which acts as a single entry point for all client requests.

The following diagram illustrates the high-level architecture of the system:

```
[Client] -> [API Gateway] -> [User Service]
                         -> [Transaction Ingestion Service] -> [Fraud Scoring Service] -> [Alert Service]
```

## Services

### API Gateway

The API Gateway is a Spring Cloud Gateway that acts as a single entry point for the microservices-based application. It provides routing, filtering, and other cross-cutting concerns for the backend services.

**Routes:**

| Route ID              | Path                | Destination URL                      |
| --------------------- | ------------------- | ------------------------------------ |
| `user-service`        | `/api/users/**`     | `http://user-service:8081/users/**`  |
| `auth-route`          | `/api/auth/**`      | `http://user-service:8081/auth/**`   |
| `alert-service`       | `/api/alerts/**`    | `http://alert-service:8082/alerts/**`|
| `ingestion-service`   | `/api/ingest/**`    | `http://ingestion-service:8083/ingest/**` |
| `user-service-roles`  | `/api/roles/**`     | `http://user-service:8081/roles/**`  |

### User Service

The User Service is a Spring Boot application for managing users, roles, and authentication. It uses JWT for securing the API and MySQL for storing data.

**Endpoints:**

*   `POST /auth/register`: Registers a new user.
*   `POST /auth/login`: Authenticates a user.
*   `POST /auth/logout`: Logs out a user.
*   `GET /users`: Get all users.
*   `GET /users/{id}`: Get a user by ID.
*   `POST /users`: Create a new user.
*   `PUT /users/{id}`: Update a user.
*   `DELETE /users/{id}`: Delete a user by ID.
*   `GET /roles`: Get all roles.
*   `POST /roles`: Create a new role.
*   `PUT /roles/{id}`: Update a role.
*   `DELETE /roles/{id}`: Delete a role by ID.

### Transaction Ingestion Service

The Transaction Ingestion Service is a Spring Boot application designed to receive financial transactions. It serves as the entry point for transactions, validates them, and then forwards them to the Fraud Scoring Service for fraud potential evaluation.

**Endpoints:**

*   `POST /ingest/transaction`: Ingests a single transaction.
*   `POST /ingest/transactions`: Ingests a batch of transactions.

### Fraud Scoring Service

The Fraud Scoring Service is a FastAPI application that exposes a RESTful API to assess the fraud risk of financial transactions. It uses a pre-trained machine learning model to return a fraud probability score and a binary classification (fraud/non-fraud) in real-time.

**Endpoints:**

*   `POST /predict`: Evaluates a single transaction.
*   `POST /predict-batch`: Evaluates a list of transactions in a single call.

### Alert Service

The Alert Service is a Spring Boot application that provides a RESTful API for managing alerts. It is designed to be used as a backend service for a frontend application.

**Endpoints:**

*   `GET /api/alerts`: Get all alerts.
*   `GET /api/alerts/{id}`: Get an alert by ID.
*   `POST /api/alerts`: Create a new alert.
*   `PUT /api/alerts/{id}/qualify`: Qualify an alert as "CLOTUREE_FRAUDE" or "CLOTUREE_NON_FRAUDE".

## Getting Started

To get the application up and running, you will need to start each of the microservices. Each service has its own `README.md` file with detailed instructions on how to run it.

## Docker

Each service includes a `Dockerfile` to build a Docker image. You can use Docker to run the entire application in a containerized environment. A `docker-compose.yml` file is provided at the root of the project to orchestrate the services.
