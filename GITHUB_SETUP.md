# 🚀 Configuration GitHub CI/CD

## 1. Créer le Repository

```bash
cd elibrary
git init
git add .
git commit -m "feat: initial DevOps architecture"

# Créer repo sur GitHub puis :
git remote add origin https://github.com/VOTRE-USERNAME/elibrary-devops.git
git branch -M main
git push -u origin main
```

## 2. Configurer les Secrets

Dans **GitHub > Settings > Secrets and variables > Actions** :

| Secret | Valeur |
|--------|--------|
| `DOCKER_USERNAME` | votre-dockerhub-username |
| `DOCKER_PASSWORD` | votre-dockerhub-token |
| `KUBE_CONFIG` | base64-encoded-kubeconfig |

### Générer KUBE_CONFIG :
```bash
# Linux/Mac
cat ~/.kube/config | base64 -w 0

# Windows
certutil -encode %USERPROFILE%\.kube\config temp.b64 && findstr /v /c:- temp.b64
```

## 3. Modifier les Images

Remplacer `your-dockerhub-username` par votre username dans :
- `k8s/backend/backend-deployment.yaml`
- `k8s/frontend/frontend-deployment.yaml`
- `.github/workflows/deploy.yml`

## 4. Déclencher le Pipeline

```bash
git add .
git commit -m "feat: configure CI/CD pipeline"
git push origin main
```

## 5. Vérifier le Déploiement

1. Aller dans **Actions** sur GitHub
2. Voir le workflow en cours
3. Vérifier que tous les jobs passent

## 6. Accéder à l'Application

```bash
# Si déployé sur Kubernetes
kubectl port-forward svc/frontend-service 4200:80 -n elibrary
kubectl port-forward svc/grafana-service 3000:3000 -n elibrary

# Accès
# Frontend: http://localhost:4200
# Grafana: http://localhost:3000 (admin/admin123)
```