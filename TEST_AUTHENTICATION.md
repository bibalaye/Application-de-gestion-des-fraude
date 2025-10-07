# Guide de test de l'authentification

## État actuel de l'implémentation

✅ **Frontend (Angular)**
- AuthService avec login/logout
- AuthInterceptor pour ajouter le token JWT aux requêtes
- AuthGuard pour protéger les routes
- NgRx store pour la gestion d'état
- Composant de login avec UI moderne

✅ **API Gateway (Spring Cloud Gateway)**
- JwtUtil pour valider les tokens
- JwtAuthenticationFilter pour intercepter les requêtes
- SecurityConfig avec routes publiques et protégées
- Configuration JWT cohérente avec user-service

✅ **User Service (Spring Boot)**
- JwtUtil pour générer les tokens
- AuthService pour l'authentification
- Endpoints /auth/login, /auth/register, /auth/logout
- Configuration JWT avec secret partagé

## Tests à effectuer

### 1. Démarrage des services

```bash
# Option 1: Docker Compose (recommandé)
docker-compose up -d

# Option 2: Développement local
# Terminal 1 - User Service
cd user-service
mvn spring-boot:run

# Terminal 2 - API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 3 - Frontend
cd frontend
npm start
```

### 2. Vérifier que les services sont démarrés

```bash
# Vérifier les logs
docker-compose logs -f api-gateway user-service frontend

# Vérifier les ports
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:80                     # Frontend
```

### 3. Test du login via API

```bash
# Test 1: Login avec credentials valides
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'

# Réponse attendue:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "user": {
#       "id": 1,
#       "username": "admin",
#       "email": "admin@example.com",
#       "role": {
#         "id": 1,
#         "name": "ROLE_ADMIN"
#       }
#     }
#   },
#   "message": "Login successful",
#   "timestamp": "2025-10-07T..."
# }
```

```bash
# Test 2: Login avec credentials invalides
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongpassword"
  }'

# Réponse attendue:
# {
#   "success": false,
#   "error": "Invalid credentials",
#   "timestamp": "2025-10-07T..."
# }
```

### 4. Test des endpoints protégés

```bash
# Récupérer le token du login précédent
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test 3: Accès avec token valide
curl http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN"

# Réponse attendue: Liste des utilisateurs

# Test 4: Accès sans token (doit retourner 401)
curl http://localhost:8080/api/users

# Réponse attendue:
# HTTP/1.1 401 Unauthorized

# Test 5: Accès avec token invalide (doit retourner 401)
curl http://localhost:8080/api/users \
  -H "Authorization: Bearer invalid-token"

# Réponse attendue:
# HTTP/1.1 401 Unauthorized
```

### 5. Test via le frontend

1. **Ouvrir le navigateur**
   ```
   http://localhost:80
   ```

2. **Tester le login**
   - Entrer username: `admin`
   - Entrer password: `password`
   - Cliquer sur "Se connecter"
   - Vérifier la redirection vers `/dashboard`

3. **Vérifier le token dans localStorage**
   - Ouvrir DevTools (F12)
   - Aller dans l'onglet "Application" > "Local Storage"
   - Vérifier la présence de `token` et `user`

4. **Tester la navigation**
   - Naviguer vers "Utilisateurs"
   - Naviguer vers "Rôles"
   - Naviguer vers "Alertes"
   - Vérifier que toutes les requêtes incluent le header Authorization

5. **Tester le logout**
   - Cliquer sur "Déconnexion" dans la sidebar
   - Vérifier la redirection vers `/login`
   - Vérifier que le token est supprimé du localStorage

6. **Tester le guard**
   - Se déconnecter
   - Essayer d'accéder directement à `http://localhost:80/dashboard`
   - Vérifier la redirection automatique vers `/login`

### 6. Test du flow complet

```bash
# Script de test complet
#!/bin/bash

echo "=== Test 1: Login ==="
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}')

echo $RESPONSE | jq .

TOKEN=$(echo $RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

echo -e "\n=== Test 2: Get Users (avec token) ==="
curl -s http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== Test 3: Get Users (sans token) ==="
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:8080/api/users

echo -e "\n=== Test 4: Get Roles (avec token) ==="
curl -s http://localhost:8080/api/roles \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== Test 5: Get Alerts (avec token) ==="
curl -s http://localhost:8080/api/alerts \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Sauvegarder ce script dans `test-auth.sh` et l'exécuter:
```bash
chmod +x test-auth.sh
./test-auth.sh
```

## Vérifications de sécurité

### 1. Vérifier que le secret JWT est identique

```bash
# Dans user-service/src/main/resources/application.properties
grep jwt.secret user-service/src/main/resources/application.properties

# Dans api-gateway/src/main/resources/application.yml
grep -A 1 "jwt:" api-gateway/src/main/resources/application.yml
```

Les deux doivent avoir le même secret:
```
your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm
```

### 2. Vérifier les routes publiques

Dans `api-gateway/src/main/java/com/example/apigateway/config/SecurityConfig.java`:
```java
.pathMatchers("/api/auth/**").permitAll()  // ✅ Public
.anyExchange().authenticated()              // ✅ Protected
```

### 3. Vérifier le filtre JWT

Dans `api-gateway/src/main/java/com/example/apigateway/config/JwtAuthenticationFilter.java`:
- Doit extraire le token du header Authorization
- Doit valider le token avec JwtUtil
- Doit ajouter l'authentification au contexte

### 4. Vérifier l'intercepteur frontend

Dans `frontend/src/app/interceptors/auth.interceptor.ts`:
- Doit ajouter le header `Authorization: Bearer <token>` à toutes les requêtes
- Doit être enregistré dans `app.config.ts`

## Problèmes courants et solutions

### Problème 1: 401 Unauthorized malgré un token valide

**Causes possibles:**
- Secret JWT différent entre API Gateway et User Service
- Token expiré
- Format du header Authorization incorrect

**Solutions:**
```bash
# Vérifier les secrets
grep jwt.secret user-service/src/main/resources/application.properties
grep -A 1 "jwt:" api-gateway/src/main/resources/application.yml

# Vérifier le format du token
echo $TOKEN | cut -d. -f2 | base64 -d | jq .

# Se reconnecter pour obtenir un nouveau token
```

### Problème 2: CORS errors dans le frontend

**Solution:**
Vérifier `frontend/proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Problème 3: Token non envoyé dans les requêtes

**Solution:**
Vérifier que l'intercepteur est bien enregistré dans `app.config.ts`:
```typescript
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

### Problème 4: Redirection infinie entre /login et /dashboard

**Causes possibles:**
- AuthGuard mal configuré
- Token invalide stocké dans localStorage

**Solutions:**
```typescript
// Nettoyer le localStorage
localStorage.clear();

// Vérifier AuthGuard
canActivate(): boolean {
  const isAuth = this.authService.isAuthenticated();
  if (!isAuth) {
    this.router.navigate(['/login']);
  }
  return isAuth;
}
```

## Checklist finale

- [ ] Les 3 services démarrent sans erreur
- [ ] Le login via API retourne un token JWT valide
- [ ] Les endpoints protégés retournent 401 sans token
- [ ] Les endpoints protégés fonctionnent avec un token valide
- [ ] Le login via frontend fonctionne
- [ ] Le token est stocké dans localStorage
- [ ] Les requêtes incluent le header Authorization
- [ ] Le logout supprime le token et redirige vers /login
- [ ] Le AuthGuard protège les routes
- [ ] Les secrets JWT sont identiques dans les deux services

## Prochaines étapes

Une fois l'authentification validée, vous pouvez:

1. **Ajouter le refresh token**
   - Permettre le renouvellement du token sans re-login
   - Améliorer l'expérience utilisateur

2. **Implémenter les rôles et permissions**
   - Restreindre l'accès selon les rôles (ADMIN, USER)
   - Ajouter des guards basés sur les rôles

3. **Améliorer la sécurité**
   - Utiliser httpOnly cookies au lieu de localStorage
   - Implémenter le rate limiting
   - Ajouter la validation 2FA

4. **Monitoring et logs**
   - Logger les tentatives de login
   - Surveiller les tokens invalides
   - Alerter sur les comportements suspects

5. **Tests automatisés**
   - Tests unitaires pour JwtUtil
   - Tests d'intégration pour le flow d'authentification
   - Tests E2E avec Cypress ou Playwright
