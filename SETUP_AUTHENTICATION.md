# Guide de configuration - Authentification cohérente

## Changements effectués

### 1. API Gateway

#### Dépendances (pom.xml)
- ❌ Supprimé : `spring-boot-starter-oauth2-resource-server`
- ❌ Supprimé : `spring-security-oauth2-jose`
- ✅ Ajouté : `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (version 0.11.5)
- ✅ Ajouté : `lombok`

#### Configuration (application.yml)
- ✅ Ajouté routes pour `/api/auth/**` → `user-service:8081/auth/**`
- ✅ Ajouté routes pour `/api/users/**` → `user-service:8081/users/**`
- ✅ Ajouté routes pour `/api/roles/**` → `user-service:8081/roles/**`
- ✅ Configuration JWT (secret et expiration)

#### Nouveaux fichiers
- ✅ `JwtUtil.java` : Validation des tokens JWT
- ✅ `JwtAuthenticationFilter.java` : Filtre d'authentification pour Spring Cloud Gateway
- ✅ `SecurityConfig.java` : Configuration de sécurité mise à jour

### 2. User Service

#### Configuration (application.properties)
- ✅ Ajouté : `jwt.secret` (clé secrète partagée)
- ✅ Ajouté : `jwt.expiration` (durée de validité)

#### Modifications
- ✅ `JwtUtil.java` : Utilise maintenant la clé secrète configurable au lieu d'une clé aléatoire

### 3. Frontend

Aucun changement nécessaire - le frontend est déjà configuré correctement :
- ✅ `AuthService` : Gère le login et stocke le token
- ✅ `AuthInterceptor` : Ajoute le token aux requêtes
- ✅ `AuthGuard` : Protège les routes

## Démarrage rapide

### Option 1 : Docker Compose (Recommandé)

```bash
# 1. Construire les images
docker-compose build

# 2. Démarrer tous les services
docker-compose up -d

# 3. Vérifier que tout fonctionne
docker-compose ps
```

### Option 2 : Développement local

#### Terminal 1 - User Service
```bash
cd user-service
mvn clean install
mvn spring-boot:run
```

#### Terminal 2 - API Gateway
```bash
cd api-gateway
mvn clean install
mvn spring-boot:run
```

#### Terminal 3 - Frontend
```bash
cd frontend
npm install
npm start
```

## Configuration du secret JWT

### Développement

Le secret par défaut est déjà configuré dans les fichiers :
```
your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm
```

### Production

**Important** : Changez le secret en production !

#### Méthode 1 : Variables d'environnement

```bash
# Générer un secret fort
SECRET=$(openssl rand -base64 32)

# Démarrer avec le secret
JWT_SECRET=$SECRET docker-compose up -d
```

#### Méthode 2 : Fichier .env

Créez un fichier `.env` à la racine :

```env
JWT_SECRET=your-production-secret-key-here
JWT_EXPIRATION=86400000
```

Puis démarrez :

```bash
docker-compose --env-file .env up -d
```

#### Méthode 3 : Modifier les fichiers de configuration

**user-service/src/main/resources/application.properties**
```properties
jwt.secret=${JWT_SECRET:your-secret-key-here}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

**api-gateway/src/main/resources/application.yml**
```yaml
jwt:
  secret: ${JWT_SECRET:your-secret-key-here}
  expiration: ${JWT_EXPIRATION:86400000}
```

## Vérification de l'installation

### 1. Vérifier que les services sont démarrés

```bash
# Vérifier les logs
docker-compose logs api-gateway
docker-compose logs user-service

# Vérifier les ports
curl http://localhost:8080  # API Gateway
curl http://localhost:8081  # User Service (direct)
```

### 2. Tester l'authentification

```bash
# Test de login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'

# Réponse attendue :
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGc...",
#     "user": {...}
#   }
# }
```

### 3. Tester un endpoint protégé

```bash
# Remplacer <TOKEN> par le token reçu
curl http://localhost:8080/api/users \
  -H "Authorization: Bearer <TOKEN>"

# Réponse attendue : Liste des utilisateurs
```

### 4. Tester le frontend

1. Ouvrir http://localhost:80 (ou http://localhost:4200 en dev)
2. Se connecter avec les credentials par défaut
3. Vérifier que le dashboard s'affiche
4. Vérifier dans les DevTools que le token est stocké dans localStorage

## Résolution des problèmes

### Erreur : "401 Unauthorized"

**Cause** : Token invalide ou expiré

**Solutions** :
1. Vérifier que le secret JWT est identique dans API Gateway et User Service
2. Vérifier que le token est bien envoyé dans le header Authorization
3. Se reconnecter pour obtenir un nouveau token

### Erreur : "Cannot resolve configuration property 'jwt.secret'"

**Cause** : Configuration manquante

**Solution** : Vérifier que `application.properties` (user-service) et `application.yml` (api-gateway) contiennent :
```properties
jwt.secret=your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm
jwt.expiration=86400000
```

### Erreur : "The specified key byte array is X bits which is not secure enough"

**Cause** : Le secret JWT est trop court

**Solution** : Utiliser un secret d'au moins 256 bits (32 caractères) :
```bash
# Générer un secret valide
openssl rand -base64 32
```

### Les services ne communiquent pas

**Cause** : Problème de réseau Docker

**Solution** :
```bash
# Recréer le réseau
docker-compose down
docker-compose up -d
```

### Le frontend ne peut pas se connecter

**Cause** : CORS ou proxy mal configuré

**Solution** : Vérifier `frontend/proxy.conf.json` :
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Checklist de déploiement

### Avant de déployer en production

- [ ] Changer le secret JWT (utiliser un secret fort et unique)
- [ ] Configurer HTTPS
- [ ] Activer les logs de sécurité
- [ ] Configurer un système de monitoring
- [ ] Tester le flow complet d'authentification
- [ ] Vérifier que les secrets ne sont pas dans le code source
- [ ] Configurer des backups de la base de données
- [ ] Mettre en place un rate limiting
- [ ] Documenter les credentials d'administration

### Variables d'environnement requises

```bash
# JWT
JWT_SECRET=<secret-fort-256-bits>
JWT_EXPIRATION=86400000

# Base de données (user-service)
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-userdb:3306/user_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<password-fort>

# Base de données (alert-service)
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-alertdb:3306/alert_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<password-fort>
```

## Support

Pour plus d'informations, consultez :
- `AUTHENTICATION_FLOW.md` : Architecture détaillée
- `api-gateway/README.md` : Documentation de l'API Gateway
- `user-service/README.md` : Documentation du User Service
- `frontend/README.md` : Documentation du Frontend

## Commandes utiles

```bash
# Reconstruire un service spécifique
docker-compose build api-gateway
docker-compose up -d api-gateway

# Voir les logs en temps réel
docker-compose logs -f api-gateway user-service

# Redémarrer tous les services
docker-compose restart

# Nettoyer et redémarrer
docker-compose down -v
docker-compose up -d

# Vérifier la configuration
docker-compose config
```
