# Architecture eLibrary - 3-tiers conteneurisée

## Vue d'ensemble

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    FRONTEND     │    │     BACKEND     │    │   BASE DE       │
│   (Angular 17)  │◄──►│  (Laravel 11)   │◄──►│   DONNÉES       │
│   Port: 4200    │    │   Port: 8000    │    │  (MySQL 8.0)    │
│                 │    │                 │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Composants indépendants

### 1. Frontend (Angular)
- **Technologie** : Angular 17 + Bootstrap 5
- **Port** : 4200
- **Responsabilités** :
  - Interface utilisateur
  - Authentification client
  - Gestion d'état (localStorage)
  - Communication API REST

### 2. Backend (Laravel)
- **Technologie** : Laravel 11 + PHP 8.2
- **Port** : 8000
- **Responsabilités** :
  - API REST
  - Authentification JWT
  - Logique métier
  - Validation des données

### 3. Base de données (MySQL)
- **Technologie** : MySQL 8.0
- **Port** : 3306
- **Responsabilités** :
  - Persistance des données
  - Intégrité référentielle
  - Transactions ACID

## Conteneurisation

Chaque composant est conteneurisé indépendamment :

- `elibrary-frontend:latest`
- `elibrary-backend:latest`  
- `mysql:8.0`

## Déploiement Kubernetes

Chaque composant déployé séparément avec :
- Deployments indépendants
- Services dédiés
- ConfigMaps pour la configuration
- Secrets pour les données sensibles