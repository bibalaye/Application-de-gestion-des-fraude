# API Gateway

API Gateway pour l'application de gestion des fraudes. Ce service sert de point d'entrée unique pour tous les microservices backend.

## Fonctionnalités

- **Routage centralisé** : Toutes les requêtes passent par le gateway
- **Authentification JWT** : Validation des tokens JWT pour les endpoints protégés
- **Sécurité** : Filtrage et validation des requêtes avant de les transmettre aux services
- **Simplification frontend** : Un seul point d'accès pour le frontend

## Architecture d'authentification

Le système utilise une authentification JWT cohérente entre tous les services :

### Flow d'authentification

1. **Login** : L'utilisateur s'authentifie via `/api/auth/login`
   - Le gateway transmet la requête au `user-service`
   - Le `user-service` valide les credentials et génère un JWT token
   - Le token est retourné au frontend

2. **Requêtes authentifiées** : Pour toutes les autres requêtes
   - Le frontend envoie le token dans le header `Authorization: Bearer <token>`
   - Le gateway valide le token JWT
   - Si valide, la requête est transmise au service approprié
   - Si invalide, une erreur 401 est retournée

### Configuration JWT

Le gateway et le user-service partagent la même configuration JWT :

```yaml
jwt:
  secret: your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm
  expiration: 86400000  # 24 heures en millisecondes
```

**Important** : En production, utilisez une clé secrète forte et stockez-la de manière sécurisée (variables d'environnement, vault, etc.)

## Routes configurées

### Endpoints publics (sans authentification)

- `/api/auth/**` → `user-service:8081/auth/**`
  - `/api/auth/register` : Inscription
  - `/api/auth/login` : Connexion
  - `/api/auth/logout` : Déconnexion

### Endpoints protégés (authentification requise)

- `/api/users/**` → `user-service:8081/users/**`
  - Gestion des utilisateurs

- `/api/roles/**` → `user-service:8081/roles/**`
  - Gestion des rôles

- `/api/alerts/**` → `alert-service:8082/alerts/**`
  - Gestion des alertes de fraude

- `/api/ingest/**` → `ingestion-service:8083/ingest/**`
  - Ingestion des transactions

## Configuration

### application.yml

```yaml
server:
  port: 8080

spring:
  cloud:
    gateway:
      routes:
        # Configuration des routes...
```

### Variables d'environnement (Docker)

```yaml
environment:
  JWT_SECRET: your-secret-key-here
  JWT_EXPIRATION: 86400000
```

## Démarrage

### Développement local

```bash
mvn spring-boot:run
```

### Docker

```bash
docker build -t api-gateway .
docker run -p 8080:8080 api-gateway
```

### Docker Compose

Le service est configuré dans `docker-compose.yml` :

```yaml
api-gateway:
  build: ./api-gateway
  container_name: api-gateway
  depends_on:
    - user-service
    - ingestion-service
    - alert-service
  ports:
    - "8080:8080"
```

## Sécurité

### Headers requis

Pour les endpoints protégés :

```
Authorization: Bearer <jwt-token>
```

### Gestion des erreurs

- **401 Unauthorized** : Token manquant, invalide ou expiré
- **403 Forbidden** : Token valide mais permissions insuffisantes
- **404 Not Found** : Route non trouvée

## Tests

Pour tester l'authentification :

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Réponse : {"token":"eyJhbGc...", "user":{...}}

# 2. Utiliser le token
curl http://localhost:8080/api/users \
  -H "Authorization: Bearer eyJhbGc..."
```

## Dépendances principales

- Spring Cloud Gateway
- Spring Security
- JJWT (JSON Web Token)
- Lombok

## Cohérence avec les autres services

### user-service
- Partage la même configuration JWT (secret, expiration)
- Génère les tokens que le gateway valide
- Gère l'authentification et les utilisateurs

### frontend
- Stocke le token JWT dans localStorage
- Envoie le token dans le header Authorization
- Intercepte les erreurs 401 pour rediriger vers login

## Notes de production

1. **Secret JWT** : Utilisez une clé forte et unique, stockée de manière sécurisée
2. **HTTPS** : Activez HTTPS en production pour protéger les tokens
3. **CORS** : Configurez CORS si le frontend est sur un domaine différent
4. **Rate Limiting** : Ajoutez un rate limiter pour prévenir les abus
5. **Monitoring** : Surveillez les tentatives d'authentification échouées
