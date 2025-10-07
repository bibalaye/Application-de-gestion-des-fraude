# Diagrammes d'authentification

## Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Angular)                       │
│                         Port: 80 / 4200                          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ AuthService  │  │AuthInterceptor│  │  AuthGuard   │          │
│  │              │  │ 