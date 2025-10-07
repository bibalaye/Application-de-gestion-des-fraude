# Alert Service

## Project Overview

This project is a Spring Boot application that provides a RESTful API for managing alerts. It is designed to be used as a backend service for a frontend application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Java 17
* Maven
* MySQL

### Installing

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/alert-service.git
   ```
2. Configure the database connection in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your-database
   spring.datasource.username=your-username
   spring.datasource.password=your-password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## API Endpoints

The following endpoints are available:

| Method | Endpoint                      | Description                                     |
|--------|-------------------------------|-------------------------------------------------|
| GET    | `/api/alerts`                 | Get all alerts                                  |
| GET    | `/api/alerts/{id}`            | Get an alert by ID                              |
| POST   | `/api/alerts`                 | Create a new alert                              |
| PUT    | `/api/alerts/{id}/qualify`    | Qualify an alert as "CLOTUREE_FRAUDE" or "CLOTUREE_NON_FRAUDE" |

### Get All Alerts

* **URL:** `/api/alerts`
* **Method:** `GET`
* **Success Response:**
  * **Code:** 200 OK
  * **Content:** `[{ "id": 1, "status": "EN_ATTENTE", "creationDate": "2025-07-03T10:00:00", "transactionId": 123, "comments": null }]`

### Get Alert by ID

* **URL:** `/api/alerts/{id}`
* **Method:** `GET`
* **URL Params:** `id=[integer]`
* **Success Response:**
  * **Code:** 200 OK
  * **Content:** `{ "id": 1, "status": "EN_ATTENTE", "creationDate": "2025-07-03T10:00:00", "transactionId": 123, "comments": null }`
* **Error Response:**
  * **Code:** 404 Not Found

### Create Alert

* **URL:** `/api/alerts`
* **Method:** `POST`
* **Data Params:**
  ```json
  {
    "transactionId": 456
  }
  ```
* **Success Response:**
  * **Code:** 201 Created
  * **Content:** `{ "id": 2, "status": "EN_ATTENTE", "creationDate": "2025-07-03T11:00:00", "transactionId": 456, "comments": null }`

### Qualify Alert

* **URL:** `/api/alerts/{id}/qualify`
* **Method:** `PUT`
* **URL Params:** `id=[integer]`
* **Query Params:**
  * `status=[string]` (must be either "CLOTUREE_FRAUDE" or "CLOTUREE_NON_FRAUDE")
  * `comments=[string]` (optional)
* **Success Response:**
  * **Code:** 200 OK
  * **Content:** `{ "id": 1, "status": "CLOTUREE_FRAUDE", "creationDate": "2025-07-03T10:00:00", "transactionId": 123, "comments": "This is a fraudulent transaction." }`
* **Error Response:**
  * **Code:** 404 Not Found

## Data Models

### Alert

| Field          | Type      | Description                                     |
|----------------|-----------|-------------------------------------------------|
| id             | Long      | The unique identifier for the alert.            |
| status         | String    | The status of the alert. Can be "EN_ATTENTE", "CLOTUREE_FRAUDE", or "CLOTUREE_NON_FRAUDE". |
| creationDate   | Date      | The date and time when the alert was created.   |
| transactionId  | Long      | The ID of the associated transaction.           |
| comments       | String    | Optional comments about the alert.              |

## Running the Application

You can run the application using the following Maven command:

```bash
mvn spring-boot:run
```

## Building for Production

You can build the application for production using the following Maven command:

```bash
mvn clean install
```

This will create a JAR file in the `target` directory that you can run using the following command:

```bash
java -jar target/alert-service-0.0.1-SNAPSHOT.jar
```

## Technologies Used

* [Spring Boot](https://spring.io/projects/spring-boot) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [MySQL](https://www.mysql.com/) - Database
