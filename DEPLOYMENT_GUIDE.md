# 🚀 Guide de Déploiement eLibrary DevOps

## 📋 Prérequis

### Outils Requis
```bash
# Docker & Docker Compose
docker --version          # >= 20.10
docker-compose --version  # >= 2.0

# Kubernetes
kubectl version --client  # >= 1.25
minikube version          # ou kind, k3s

# Node.js & PHP (développement)
node --version            # >= 18.0
php --version             # >= 8.2
composer --version        # >= 2.0
```

### Comptes Requis
- **Docker Hub** : Pour le registry des images
- **GitHub** : Pour le code source et CI/CD
- **Kubernetes Cluster** : Local (minikube) ou cloud (EKS, GKE, AKS)

## 🏗️ Déploiement Local (Développement)

### 1. Cloner le Projet
```bash
git clone https://github.com/votre-username/elibrary-devops.git
cd elibrary-devops
```

### 2. Configuration Docker Compose
```bash
# Copier les variables d'environnement
cp backend/.env.example backend/.env

# Modifier les variables si nécessaire
# DB_HOST=mysql
# DB_DATABASE=elibrary
# DB_USERNAME=root
# DB_PASSWORD=secretpassword
```

### 3. Build et Démarrage
```bash
# Build des images
docker-compose build

# Démarrage des services
docker-compose up -d

# Vérification des services
docker-compose ps
```

### 4. Accès aux Services
- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8000/api
- **Grafana** : http://localhost:3000 (admin/admin123)
- **Prometheus** : http://localhost:9090

### 5. Tests de Santé
```bash
# Test backend
curl http://localhost:8000/api/health

# Test frontend
curl http://localhost:4200/health

# Test métriques
curl http://localhost:8000/api/metrics
```

## ☸️ Déploiement Kubernetes

### 1. Préparation du Cluster
```bash
# Démarrer minikube (local)
minikube start --cpus=4 --memory=8192

# Ou utiliser kind
kind create cluster --name elibrary

# Vérifier la connexion
kubectl cluster-info
```

### 2. Configuration des Images
```bash
# Modifier les noms d'images dans les manifests
sed -i 's/your-dockerhub-username/VOTRE_USERNAME/g' k8s/*/\*.yaml
```

### 3. Déploiement avec Script
```bash
# Rendre le script exécutable
chmod +x scripts/deploy.sh

# Déploiement complet
./scripts/deploy.sh local
```

### 4. Déploiement Manuel
```bash
# Créer le namespace
kubectl apply -f k8s/namespace.yaml

# Déployer MySQL
kubectl apply -f k8s/mysql/

# Attendre que MySQL soit prêt
kubectl wait --for=condition=ready pod -l app=mysql -n elibrary --timeout=300s

# Déployer Backend
kubectl apply -f k8s/backend/

# Déployer Frontend
kubectl apply -f k8s/frontend/

# Déployer Monitoring
kubectl apply -f k8s/monitoring/
```

### 5. Vérification du Déploiement
```bash
# Vérifier les pods
kubectl get pods -n elibrary

# Vérifier les services
kubectl get services -n elibrary

# Logs des applications
kubectl logs -f deployment/backend-deployment -n elibrary
kubectl logs -f deployment/frontend-deployment -n elibrary
```

### 6. Accès aux Services
```bash
# Port-forward pour accès local
kubectl port-forward svc/frontend-service 4200:80 -n elibrary &
kubectl port-forward svc/grafana-service 3000:3000 -n elibrary &
kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary &

# Ou utiliser minikube service
minikube service frontend-service -n elibrary
minikube service grafana-service -n elibrary
```

## 🔄 Configuration CI/CD

### 1. Secrets GitHub
Configurer dans Settings > Secrets and variables > Actions :

```bash
DOCKER_USERNAME=votre-username-dockerhub
DOCKER_PASSWORD=votre-token-dockerhub
KUBE_CONFIG=base64-encoded-kubeconfig
SLACK_WEBHOOK=https://hooks.slack.com/services/...
```

### 2. Génération KUBE_CONFIG
```bash
# Encoder le kubeconfig en base64
cat ~/.kube/config | base64 -w 0

# Ou pour Windows
certutil -encode ~/.kube/config temp.b64 && findstr /v /c:- temp.b64
```

### 3. Test du Pipeline
```bash
# Push sur main pour déclencher le déploiement
git add .
git commit -m "feat: setup DevOps infrastructure"
git push origin main
```

## 📊 Configuration Monitoring

### 1. Accès Grafana
```bash
# URL : http://localhost:3000
# Login : admin
# Password : admin123
```

### 2. Import Dashboard
1. Aller dans **Dashboards > Import**
2. Copier le contenu de `monitoring/grafana/dashboards/elibrary-dashboard.json`
3. Cliquer sur **Load** puis **Import**

### 3. Configuration Alertes
```bash
# Modifier les seuils dans Grafana
# Notification channels : Slack, Email, PagerDuty
```

## 🔧 Maintenance et Opérations

### 1. Mise à Jour des Images
```bash
# Build nouvelles images
./scripts/build.sh --push

# Mise à jour Kubernetes
kubectl set image deployment/frontend-deployment frontend=username/elibrary-frontend:new-tag -n elibrary
kubectl set image deployment/backend-deployment backend=username/elibrary-backend:new-tag -n elibrary
```

### 2. Scaling
```bash
# Scale manuel
kubectl scale deployment frontend-deployment --replicas=5 -n elibrary

# HPA automatique (déjà configuré)
kubectl get hpa -n elibrary
```

### 3. Backup Base de Données
```bash
# Backup manuel
kubectl exec -it deployment/mysql-deployment -n elibrary -- mysqldump -u root -p elibrary > backup.sql

# Restore
kubectl exec -i deployment/mysql-deployment -n elibrary -- mysql -u root -p elibrary < backup.sql
```

### 4. Logs et Debug
```bash
# Logs en temps réel
kubectl logs -f deployment/backend-deployment -n elibrary

# Debug pod
kubectl describe pod <pod-name> -n elibrary
kubectl exec -it <pod-name> -n elibrary -- /bin/bash

# Events cluster
kubectl get events --sort-by=.metadata.creationTimestamp -n elibrary
```

## 🚨 Troubleshooting

### Problèmes Courants

#### 1. Pods en CrashLoopBackOff
```bash
# Vérifier les logs
kubectl logs <pod-name> -n elibrary

# Vérifier la configuration
kubectl describe pod <pod-name> -n elibrary

# Solutions courantes :
# - Vérifier les variables d'environnement
# - Vérifier les secrets
# - Vérifier les health checks
```

#### 2. Services Inaccessibles
```bash
# Vérifier les services
kubectl get services -n elibrary

# Vérifier les endpoints
kubectl get endpoints -n elibrary

# Vérifier les selectors
kubectl describe service <service-name> -n elibrary
```

#### 3. Base de Données Non Accessible
```bash
# Vérifier le pod MySQL
kubectl get pods -l app=mysql -n elibrary

# Tester la connexion
kubectl exec -it deployment/mysql-deployment -n elibrary -- mysql -u root -p

# Vérifier les secrets
kubectl get secret mysql-secret -n elibrary -o yaml
```

#### 4. Images Non Trouvées
```bash
# Vérifier les noms d'images
kubectl describe pod <pod-name> -n elibrary

# Pull manuel pour test
docker pull username/elibrary-frontend:latest

# Vérifier les credentials Docker Hub
kubectl get secret regcred -n elibrary
```

### Commandes de Diagnostic
```bash
# État général du cluster
kubectl get all -n elibrary

# Utilisation des ressources
kubectl top nodes
kubectl top pods -n elibrary

# Événements récents
kubectl get events --sort-by=.metadata.creationTimestamp -n elibrary

# Configuration des pods
kubectl get pods -n elibrary -o wide
```

## 📈 Monitoring et Alertes

### Métriques Importantes
- **Disponibilité** : up{job="frontend"}, up{job="backend"}
- **Performance** : http_request_duration_seconds
- **Erreurs** : http_requests_total{status=~"5.."}
- **Ressources** : container_memory_usage_bytes, container_cpu_usage_seconds_total

### Alertes Recommandées
```yaml
# Exemple d'alerte Prometheus
- alert: ServiceDown
  expr: up == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Service {{ $labels.job }} is down"

- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "High error rate on {{ $labels.job }}"
```

## 🔐 Sécurité

### Bonnes Pratiques
1. **Secrets** : Utiliser Kubernetes Secrets, jamais en plain text
2. **RBAC** : Permissions minimales pour chaque service
3. **Network Policies** : Isolation du trafic réseau
4. **Image Scanning** : Scanner les vulnérabilités avant déploiement
5. **Updates** : Maintenir les images à jour

### Audit et Compliance
```bash
# Vérifier les permissions RBAC
kubectl auth can-i --list --as=system:serviceaccount:elibrary:prometheus-sa

# Scanner les images
trivy image username/elibrary-frontend:latest

# Vérifier les policies de sécurité
kubectl get psp
kubectl get networkpolicies -n elibrary
```

---

**Support** : Pour toute question, créer une issue sur GitHub ou contacter l'équipe DevOps.

**Version** : 1.0  
**Dernière mise à jour** : $(date)