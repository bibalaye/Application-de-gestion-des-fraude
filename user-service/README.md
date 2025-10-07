# User Service

This project is a Spring Boot application for managing users, roles, and authentication.

## Technologies Used

*   **Java 17**: The programming language used.
*   **Spring Boot 3.2.5**: The framework for creating the application.
*   **Spring Security**: For authentication and authorization.
*   **JWT (JSON Web Token)**: For securing the API.
*   **MySQL**: The database used to store data.
*   **Lombok**: To reduce boilerplate code.
*   **Maven**: For project dependency management.

## Project Structure

The project is structured as follows:

*   `config`: Contains the security configuration, including JWT filter.
*   `controller`: Contains the REST controllers for handling HTTP requests.
*   `dto`: Contains the Data Transfer Objects (DTOs) for requests and responses.
*   `exception`: Contains custom exception classes.
*   `model`: Contains the JPA entity classes.
*   `repository`: Contains the Spring Data JPA repositories.
*   `service`: Contains the business logic.

## Endpoints

### Authentication

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/auth/register` | Registers a new user.    |
| POST   | `/auth/login`    | Authenticates a user.    |
| POST   | `/auth/logout`   | Logs out a user.         |

#### `POST /auth/register`

Registers a new user. The request body should be a JSON object with the following fields:

*   `username`: The username of the user.
*   `password`: The password of the user.
*   `email`: The email of the user.

#### `POST /auth/login`

Authenticates a user. The request body should be a JSON object with the following fields:

*   `username`: The username of the user.
*   `password`: The password of the user.

#### `POST /auth/logout`

Logs out a user. The request body should be a JSON object with the following field:

*   `username`: The username of the user.

### Users

| Method | Endpoint      | Description               |
|--------|---------------|---------------------------|
| GET    | `/users`      | Get all users.            |
| GET    | `/users/{id}` | Get a user by ID.         |
| POST   | `/users`      | Create a new user.        |
| PUT    | `/users/{id}` | Update a user.            |
| DELETE | `/users/{id}` | Delete a user by ID.      |

### Roles

| Method | Endpoint      | Description               |
|--------|---------------|---------------------------|
| GET    | `/roles`      | Get all roles.            |
| POST   | `/roles`      | Create a new role.        |
| PUT    | `/roles/{id}` | Update a role.            |
| DELETE | `/roles/{id}` | Delete a role by ID.      |

## How to Run the Application

1.  Clone the repository.
2.  Make sure you have Java 17 and Maven installed.
3.  Configure the database connection in `src/main/resources/application.properties`.
4.  Run the application using the command `mvn spring-boot:run`.
