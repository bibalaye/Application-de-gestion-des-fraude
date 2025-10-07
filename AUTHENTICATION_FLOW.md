# Architecture d'authentification - Application de gestion des fraudes

## Vue d'ensemble

L'application utilise une authentification JWT cohérente entre les trois composants principaux :
- **Frontend** (Angular)
- **API Gateway** (Spring Cloud Gateway)
- **User Service** (Spring Boot)

## Flow d'authentification complet

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend  │         │ API Gateway │         │ User Service │
│  (Angular)  │         │   :8080     │         │    :8081     │
└──────┬──────┘         └──────┬──────┘         └──────┬───────┘
       │                       │                        │
       │ 1. POST /api/auth/login                       │
       │    {username, password}                        │
       ├──────────────────────>│                        │
       │                       │                        │
       │                       │ 2. POST /auth/login    │
       │                       │    {username, password}│
       │                       ├───────────────────────>│
       │                       │                        │
       │                       │                        │ 3. Validate
       │                       │                        │    credentials
       │                       │                        │
       │                       │ 4. JWT Token + User    │
       │                       │<───────────────────────┤
       │                       │                        │
       │ 5. JWT Token + User   │                        │
       │<──────────────────────┤                        │
       │                       │                        │
       │ 6. Store token in     │                        │
       │    localStorage       │                        │
       │                       │                        │
       │ 7. GET /api/users     │                        │
       │    Authorization: Bearer <token>               │
       ├──────────────────────>│                        │
       │                       │                        │
       │                       │ 8. Validate JWT        │
       │                       │    (JwtAuthenticationFilter)
       │                       │                        │
       │                       │ 9. GET /users          │
       │                       │    (if token valid)    │
       │                       ├───────────────────────>│
       │                       │                        │
       │                       │ 10. Users data         │
       │                       │<───────────────────────┤
       │                       │                        │
       │ 11. Users data        │                        │
       │<──────────────────────┤                        │
       │                       │                        │
```

## Configuration JWT partagée

### Secret et expiration

Les deux services (API Gateway et User Service) utilisent la même configuration :

```yaml
jwt:
  secret: your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm
  expiration: 86400000  # 24 heures
```

### Algorithme

- **Algorithme** : HS256 (HMAC with SHA-256)
- **Bibliothèque** : JJWT (io.jsonwebtoken)

## Composants

### 1. Frontend (Angular)

#### AuthService (`frontend/src/app/services/auth.service.ts`)

```typescript
login(username: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
    .pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
}

getToken(): string | null {
  return localStorage.getItem('token');
}
```

#### AuthInterceptor (`frontend/src/app/interceptors/auth.interceptor.ts`)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};
```

#### AuthGuard (`frontend/src/app/guards/auth.guard.ts`)

Protège les routes qui nécessitent une authentification.

### 2. API Gateway (Spring Cloud Gateway)

#### JwtUtil (`api-gateway/src/main/java/com/example/apigateway/config/JwtUtil.java`)

- Valide les tokens JWT
- Extrait le username et les authorities
- Vérifie l'expiration

#### JwtAuthenticationFilter (`api-gateway/src/main/java/com/example/apigateway/config/JwtAuthenticationFilter.java`)

- Intercepte toutes les requêtes
- Vérifie la présence du header Authorization
- Valide le token JWT
- Ajoute l'authentification au contexte de sécurité

#### SecurityConfig (`api-gateway/src/main/java/com/example/apigateway/config/SecurityConfig.java`)

```java
.authorizeExchange(exchanges -> exchanges
    .pathMatchers("/api/auth/**").permitAll()  // Public
    .anyExchange().authenticated()              // Protected
)
```

### 3. User Service (Spring Boot)

#### JwtUtil (`user-service/src/main/java/com/example/userservice/config/JwtUtil.java`)

- Génère les tokens JWT lors du login
- Inclut le username et les authorities dans le token

#### AuthService (`user-service/src/main/java/com/example/userservice/service/AuthService.java`)

```java
public AuthenticationResponse authenticateUser(LoginRequest request) {
    // Authenticate with Spring Security
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(), 
            request.getPassword()
        )
    );
    
    // Load user details
    UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
    
    // Generate JWT token
    String token = jwtUtil.generateToken(userDetails);
    
    return new AuthenticationResponse(token, user);
}
```

## Structure du JWT Token

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload
```json
{
  "sub": "username",
  "authorities": ["ROLE_USER", "ROLE_ADMIN"],
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

## Routes API Gateway

### Endpoints publics (sans authentification)
- `POST /api/auth/register` → `user-service:8081/auth/register`
- `POST /api/auth/login` → `user-service:8081/auth/login`
- `POST /api/auth/logout` → `user-service:8081/auth/logout`

### Endpoints protégés (authentification requise)
- `/api/users/**` → `user-service:8081/users/**`
- `/api/roles/**` → `user-service:8081/roles/**`
- `/api/alerts/**` → `alert-service:8082/alerts/**`
- `/api/ingest/**` → `ingestion-service:8083/ingest/**`

## Gestion des erreurs

### Frontend
- **401 Unauthorized** : Redirection vers `/login`
- Token expiré : Suppression du token et redirection

### API Gateway
- **401 Unauthorized** : Token manquant, invalide ou expiré
- **403 Forbidden** : Permissions insuffisantes

### User Service
- **401 Unauthorized** : Credentials invalides
- **400 Bad Request** : Données de requête invalides

## Configuration Docker

### docker-compose.yml

Les services partagent la même configuration JWT via des variables d'environnement :

```yaml
services:
  user-service:
    environment:
      JWT_SECRET: ${JWT_SECRET:-your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm}
      JWT_EXPIRATION: ${JWT_EXPIRATION:-86400000}

  api-gateway:
    environment:
      JWT_SECRET: ${JWT_SECRET:-your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm}
      JWT_EXPIRATION: ${JWT_EXPIRATION:-86400000}
```

## Sécurité

### Bonnes pratiques implémentées

1. **Secret fort** : Clé de 256 bits minimum pour HS256
2. **Expiration** : Tokens valides 24 heures
3. **HTTPS** : Recommandé en production
4. **HttpOnly cookies** : Alternative possible pour plus de sécurité
5. **Refresh tokens** : À implémenter pour une meilleure UX

### Points d'attention

1. **Secret partagé** : Le même secret doit être utilisé par API Gateway et User Service
2. **Synchronisation horaire** : Les serveurs doivent avoir la même heure pour la validation d'expiration
3. **Stockage frontend** : localStorage est vulnérable aux attaques XSS (considérer httpOnly cookies)

## Tests

### Test du flow complet

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Réponse
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": {"id": 1, "name": "ROLE_ADMIN"}
  }
}

# 2. Utiliser le token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN"

# 3. Test sans token (doit retourner 401)
curl http://localhost:8080/api/users
```

## Déploiement

### Variables d'environnement en production

```bash
# .env file
JWT_SECRET=your-very-strong-secret-key-for-production-use-at-least-256-bits
JWT_EXPIRATION=86400000
```

### Docker Compose avec .env

```bash
docker-compose --env-file .env up -d
```

## Maintenance

### Rotation du secret JWT

1. Générer un nouveau secret fort
2. Mettre à jour les variables d'environnement
3. Redémarrer les services (API Gateway et User Service)
4. Les utilisateurs devront se reconnecter

### Monitoring

- Surveiller les tentatives de login échouées
- Logger les tokens invalides
- Alerter sur les pics d'erreurs 401

## Évolutions futures

1. **Refresh tokens** : Permettre le renouvellement sans re-login
2. **OAuth2** : Support des providers externes (Google, GitHub)
3. **MFA** : Authentification multi-facteurs
4. **Rate limiting** : Protection contre le brute force
5. **Token blacklist** : Révocation de tokens avant expiration
