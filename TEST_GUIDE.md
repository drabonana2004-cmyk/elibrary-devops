# 🧪 Guide de Tests - eLibrary DevOps

## 🚀 Tests Rapides (5 minutes)

### 1. Test Docker Compose Local
```bash
cd elibrary
docker-compose up -d
```

**Vérifications** :
```bash
# Services actifs
docker-compose ps

# Logs sans erreurs
docker-compose logs

# Tests endpoints
curl http://localhost:8000/api/health
curl http://localhost:4200/health
```

**Accès** :
- Frontend: http://localhost:4200
- Backend: http://localhost:8000/api/health
- Grafana: http://localhost:3000 (admin/admin123)

### 2. Test Application Fonctionnelle
1. **Frontend** : http://localhost:4200
   - ✅ Page de connexion s'affiche
   - ✅ Connexion admin/admin fonctionne
   - ✅ Dashboard admin accessible

2. **Backend API** :
```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/dashboard/stats
curl http://localhost:8000/api/books
```

3. **Base de données** :
```bash
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
# Password: secretpassword
```

## ☸️ Tests Kubernetes (15 minutes)

### 1. Préparation Cluster
```bash
# Minikube
minikube start --cpus=4 --memory=8192
minikube status

# Ou Kind
kind create cluster --name elibrary-test
kubectl cluster-info
```

### 2. Déploiement Test
```bash
# Modifier les images dans les manifests
sed -i 's/your-dockerhub-username/test/g' k8s/*/*.yaml

# Déploiement
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/monitoring/
```

### 3. Vérifications Kubernetes
```bash
# Pods en cours
kubectl get pods -n elibrary

# Services actifs
kubectl get services -n elibrary

# Logs des applications
kubectl logs -f deployment/backend-deployment -n elibrary
kubectl logs -f deployment/frontend-deployment -n elibrary
```

### 4. Tests de Connectivité
```bash
# Port-forward pour tests
kubectl port-forward svc/frontend-service 4200:80 -n elibrary &
kubectl port-forward svc/backend-service 8000:8000 -n elibrary &
kubectl port-forward svc/grafana-service 3000:3000 -n elibrary &

# Tests endpoints
curl http://localhost:4200/health
curl http://localhost:8000/api/health
curl http://localhost:3000/api/health
```

## 🔄 Tests CI/CD Pipeline

### 1. Test GitHub Actions (Local)
```bash
# Installer act pour tests locaux
# Windows: choco install act-cli
# Mac: brew install act
# Linux: curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Test du workflow
act -j test
act -j build
```

### 2. Test Pipeline Complet
```bash
# Push pour déclencher le pipeline
git add .
git commit -m "test: trigger CI/CD pipeline"
git push origin main

# Vérifier sur GitHub Actions
# https://github.com/votre-repo/actions
```

## 📊 Tests Monitoring

### 1. Prometheus
```bash
# Accès Prometheus
kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary

# Tests métriques
curl http://localhost:9090/api/v1/query?query=up
curl http://localhost:9090/api/v1/query?query=http_requests_total
```

### 2. Grafana
```bash
# Accès Grafana
kubectl port-forward svc/grafana-service 3000:3000 -n elibrary

# Login: admin/admin123
# Vérifier datasource Prometheus
# Importer dashboard eLibrary
```

## 🧪 Tests Automatisés

### 1. Tests Frontend
```bash
cd frontend
npm test
npm run e2e
```

### 2. Tests Backend
```bash
cd backend
php artisan test
```

### 3. Tests d'Intégration
```bash
# Test complet avec Docker Compose
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 🔍 Tests de Charge

### 1. Test Simple avec curl
```bash
# Test de charge basique
for i in {1..100}; do
  curl -s http://localhost:8000/api/health > /dev/null &
done
wait
```

### 2. Test avec Apache Bench
```bash
# Installer ab
# Ubuntu: sudo apt-get install apache2-utils
# Mac: brew install httpie

# Test de charge
ab -n 1000 -c 10 http://localhost:8000/api/health
ab -n 1000 -c 10 http://localhost:4200/
```

## 🚨 Tests de Récupération

### 1. Test Redémarrage Pods
```bash
# Supprimer un pod
kubectl delete pod -l app=backend -n elibrary

# Vérifier la récupération
kubectl get pods -n elibrary -w
```

### 2. Test Panne Base de Données
```bash
# Arrêter MySQL
kubectl scale deployment mysql-deployment --replicas=0 -n elibrary

# Vérifier les erreurs
kubectl logs -f deployment/backend-deployment -n elibrary

# Redémarrer MySQL
kubectl scale deployment mysql-deployment --replicas=1 -n elibrary
```

## ✅ Checklist de Tests

### Tests Fonctionnels
- [ ] Application démarre sans erreur
- [ ] Connexion utilisateur fonctionne
- [ ] Dashboard admin accessible
- [ ] API répond correctement
- [ ] Base de données accessible

### Tests Infrastructure
- [ ] Tous les pods sont Running
- [ ] Services exposent les bons ports
- [ ] PVC sont montés correctement
- [ ] Secrets sont chargés
- [ ] ConfigMaps sont appliqués

### Tests Monitoring
- [ ] Prometheus collecte les métriques
- [ ] Grafana affiche les dashboards
- [ ] Alertes fonctionnent
- [ ] Logs sont accessibles

### Tests Performance
- [ ] Temps de réponse < 2s
- [ ] Application supporte 100 utilisateurs
- [ ] Pas de fuite mémoire
- [ ] CPU reste < 80%

### Tests Sécurité
- [ ] Secrets ne sont pas exposés
- [ ] RBAC fonctionne
- [ ] Network policies appliquées
- [ ] Images scannées

## 🐛 Troubleshooting Tests

### Problèmes Courants

#### Docker Compose
```bash
# Problème: Port déjà utilisé
docker-compose down
netstat -tulpn | grep :4200

# Problème: Images non trouvées
docker-compose build --no-cache
```

#### Kubernetes
```bash
# Problème: Pods en CrashLoopBackOff
kubectl describe pod <pod-name> -n elibrary
kubectl logs <pod-name> -n elibrary

# Problème: Services inaccessibles
kubectl get endpoints -n elibrary
kubectl describe service <service-name> -n elibrary
```

#### Monitoring
```bash
# Problème: Métriques manquantes
kubectl logs -f deployment/prometheus-deployment -n elibrary

# Problème: Grafana ne démarre pas
kubectl describe pod -l app=grafana -n elibrary
```

## 📋 Rapport de Tests

### Template de Rapport
```markdown
# Rapport de Tests eLibrary

## Environnement
- OS: Windows/Linux/Mac
- Docker: version
- Kubernetes: version
- Date: $(date)

## Tests Réalisés
- [ ] Docker Compose Local
- [ ] Déploiement Kubernetes
- [ ] Pipeline CI/CD
- [ ] Monitoring
- [ ] Performance
- [ ] Sécurité

## Résultats
- ✅ Tests passés: X/Y
- ❌ Tests échoués: Z
- ⚠️ Avertissements: W

## Problèmes Identifiés
1. Description du problème
   - Solution appliquée
   - Statut: Résolu/En cours

## Recommandations
- Amélioration 1
- Amélioration 2
```

## 🎯 Tests de Production

### Avant Mise en Production
```bash
# Tests de sécurité
trivy image username/elibrary-frontend:latest
trivy image username/elibrary-backend:latest

# Tests de performance
kubectl run -i --tty load-test --image=busybox --restart=Never -- sh
# Dans le pod: wget -qO- http://frontend-service/

# Tests de sauvegarde
kubectl exec -it deployment/mysql-deployment -- mysqldump -u root -p elibrary
```

### Monitoring Production
```bash
# Métriques critiques
kubectl top nodes
kubectl top pods -n elibrary

# Alertes actives
curl http://prometheus:9090/api/v1/alerts

# Logs d'erreurs
kubectl logs --since=1h -l app=backend -n elibrary | grep ERROR
```

---

**Durée totale des tests** : 30-45 minutes  
**Fréquence recommandée** : Avant chaque déploiement  
**Automatisation** : Intégrer dans le pipeline CI/CD