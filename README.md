# eLibrary - Architecture DevOps Complète

## 🏗️ Architecture

### Vue d'ensemble
Application 3-tiers conteneurisée avec orchestration Kubernetes :
- **Frontend** : Angular 17 (Port 4200)
- **Backend** : Laravel 11 API (Port 8000) 
- **Database** : MySQL 8.0 (Port 3306)

### Infrastructure DevOps
- **Conteneurisation** : Docker
- **Orchestration** : Kubernetes
- **CI/CD** : GitHub Actions
- **Monitoring** : Prometheus + Grafana
- **Registry** : Docker Hub

## 🚀 Démarrage Rapide

### Prérequis
```bash
- Docker & Docker Compose
- Kubernetes (minikube/kind)
- kubectl
- Node.js 18+
- PHP 8.2+
```

### Déploiement Local
```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/elibrary-devops.git
cd elibrary-devops

# 2. Build des images Docker
docker-compose build

# 3. Démarrage des services
docker-compose up -d

# 4. Accès aux services
Frontend: http://localhost:4200
Backend API: http://localhost:8000
Grafana: http://localhost:3000
```

### Déploiement Kubernetes
```bash
# 1. Appliquer les manifests
kubectl apply -f k8s/

# 2. Vérifier les pods
kubectl get pods

# 3. Accès via port-forward
kubectl port-forward svc/frontend-service 4200:80
```

## 📁 Structure du Projet

```
elibrary/
├── frontend/                 # Application Angular
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # API Laravel
│   ├── app/
│   ├── Dockerfile
│   └── .env.example
├── k8s/                     # Manifests Kubernetes
│   ├── namespace.yaml
│   ├── mysql/
│   ├── backend/
│   ├── frontend/
│   └── monitoring/
├── .github/workflows/       # CI/CD GitHub Actions
│   └── deploy.yml
├── docker-compose.yml       # Développement local
└── monitoring/             # Configuration Prometheus/Grafana
    ├── prometheus.yml
    └── grafana/
```

## 🔄 Pipeline CI/CD

### Workflow GitHub Actions
1. **Trigger** : Push sur main/develop
2. **Build** : Construction des images Docker
3. **Test** : Tests unitaires et d'intégration
4. **Security** : Scan de vulnérabilités
5. **Push** : Publication sur Docker Hub
6. **Deploy** : Déploiement sur Kubernetes

### Variables d'environnement requises
```bash
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-token
KUBE_CONFIG=your-kubernetes-config-base64
```

## 📊 Monitoring

### Métriques surveillées
- **Application** : Temps de réponse, erreurs HTTP
- **Infrastructure** : CPU, RAM, stockage
- **Base de données** : Connexions, requêtes lentes
- **Kubernetes** : Pods, services, ingress

### Dashboards Grafana
- Vue d'ensemble système
- Métriques applicatives
- Performance base de données
- Alertes et notifications

## 🛠️ Commandes Utiles

### Docker
```bash
# Build toutes les images
docker-compose build

# Logs des services
docker-compose logs -f [service]

# Nettoyage
docker system prune -a
```

### Kubernetes
```bash
# Appliquer les changements
kubectl apply -f k8s/

# Voir les logs
kubectl logs -f deployment/backend-deployment

# Redémarrer un déploiement
kubectl rollout restart deployment/frontend-deployment
```

## 🔧 Configuration

### Variables d'environnement

#### Frontend
```env
API_URL=http://backend-service:8000
ENVIRONMENT=production
```

#### Backend
```env
DB_HOST=mysql-service
DB_DATABASE=elibrary
DB_USERNAME=root
DB_PASSWORD=secretpassword
```

## 🚨 Troubleshooting

### Problèmes courants
1. **Pods en CrashLoopBackOff** : Vérifier les logs et variables d'env
2. **Services inaccessibles** : Contrôler les selectors et ports
3. **Base de données** : Vérifier la persistance des volumes

### Commandes de diagnostic
```bash
kubectl describe pod [pod-name]
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl top nodes
```

## 📈 Évolutions Futures

- [ ] Helm Charts pour le packaging
- [ ] ArgoCD pour GitOps
- [ ] Istio Service Mesh
- [ ] Backup automatisé BDD
- [ ] Tests de charge automatisés
- [ ] Multi-environnements (dev/staging/prod)

## 👥 Équipe DevOps

- **Lead DevOps** : Configuration infrastructure
- **Développeurs** : Intégration CI/CD
- **SRE** : Monitoring et alerting

---

**Version** : 1.0.0  
**Dernière mise à jour** : $(date)