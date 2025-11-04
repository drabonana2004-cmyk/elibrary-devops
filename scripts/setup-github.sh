#!/bin/bash

# Script de configuration GitHub pour eLibrary DevOps
# Usage: ./setup-github.sh VOTRE-DOCKERHUB-USERNAME

set -e

DOCKER_USERNAME=${1}

if [ -z "$DOCKER_USERNAME" ]; then
    echo "Usage: $0 VOTRE-DOCKERHUB-USERNAME"
    echo "Exemple: $0 johndoe"
    exit 1
fi

echo "🔧 Configuration GitHub pour eLibrary DevOps"
echo "Docker Hub Username: $DOCKER_USERNAME"
echo ""

# Remplacer les placeholders dans les manifests Kubernetes
echo "📝 Mise à jour des manifests Kubernetes..."
sed -i "s/your-dockerhub-username/$DOCKER_USERNAME/g" k8s/backend/backend-deployment.yaml
sed -i "s/your-dockerhub-username/$DOCKER_USERNAME/g" k8s/frontend/frontend-deployment.yaml

# Remplacer dans le workflow GitHub Actions
echo "📝 Mise à jour du workflow GitHub Actions..."
sed -i "s/your-dockerhub-username/$DOCKER_USERNAME/g" .github/workflows/deploy.yml

# Remplacer dans docker-compose
echo "📝 Mise à jour de docker-compose.yml..."
sed -i "s/your-dockerhub-username/$DOCKER_USERNAME/g" docker-compose.yml

echo "✅ Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Créer un repository GitHub"
echo "2. Configurer les secrets GitHub:"
echo "   - DOCKER_USERNAME=$DOCKER_USERNAME"
echo "   - DOCKER_PASSWORD=votre-token-dockerhub"
echo "   - KUBE_CONFIG=base64-encoded-kubeconfig"
echo "3. Push le code:"
echo "   git add ."
echo "   git commit -m 'feat: configure CI/CD pipeline'"
echo "   git push origin main"