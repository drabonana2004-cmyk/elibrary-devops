# Guide Pipeline CI/CD - eLibrary

## 🚀 Pipeline créé avec 5 jobs

### 1. **Test** - Validation du code
- ✅ Tests frontend (Node.js 18)
- ✅ Validation backend (PHP 8.2)
- ✅ Validation manifests Kubernetes

### 2. **Build** - Construction des images
- 🐳 Build image Frontend → Docker Hub
- 🐳 Build image Backend → Docker Hub
- 📦 Cache optimisé GitHub Actions

### 3. **Deploy** - Déploiement Kubernetes
- ☸️ Déploiement sur cluster K8s
- 🔄 Rollout automatique
- ⏱️ Timeout de 5 minutes

### 4. **Integration Tests** - Tests post-déploiement
- 🌐 Test connectivité Frontend
- 🔗 Test connectivité Backend
- ✅ Validation déploiement

### 5. **Notify** - Notification résultats
- 📢 Statut du déploiement
- 📊 Résumé des tests

## 📋 Configuration requise

### Secrets GitHub à configurer :

1. **DOCKER_USERNAME** : Nom d'utilisateur Docker Hub
2. **DOCKER_PASSWORD** : Token Docker Hub (pas le mot de passe)
3. **KUBE_CONFIG** : Configuration Kubernetes en base64

### Obtenir KUBE_CONFIG :
```bash
# Windows
type %USERPROFILE%\.kube\config | base64 -w 0

# Linux/Mac
cat ~/.kube/config | base64 -w 0
```

## 🔄 Déclencheurs du pipeline

- ✅ **Push** sur `main` → Déploiement complet
- ✅ **Push** sur `develop` → Tests uniquement
- ✅ **Pull Request** → Tests de validation

## 📊 Workflow

```
Push main → Test → Build → Deploy → Integration Tests → Notify
     ↓         ↓       ↓        ↓            ↓           ↓
   Code OK   Images   K8s     Tests       Status    Notification
```

## 🎯 Résultat attendu

Après chaque push sur `main` :
1. Code testé automatiquement
2. Images Docker buildées et poussées
3. Application déployée sur Kubernetes
4. Tests d'intégration exécutés
5. Notification du statut

**Pipeline CI/CD complet et automatisé !** 🚀