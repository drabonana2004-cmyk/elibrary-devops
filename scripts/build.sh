#!/bin/bash

# Build script for eLibrary Docker images
# Usage: ./build.sh [--push]

set -e

DOCKER_USERNAME=${DOCKER_USERNAME:-"your-dockerhub-username"}
PUSH_IMAGES=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --push)
            PUSH_IMAGES=true
            shift
            ;;
        *)
            echo "Unknown option $1"
            exit 1
            ;;
    esac
done

echo "🏗️ Building eLibrary Docker images..."

# Build frontend image
echo "📦 Building frontend image..."
docker build -t ${DOCKER_USERNAME}/elibrary-frontend:latest ./frontend
docker tag ${DOCKER_USERNAME}/elibrary-frontend:latest ${DOCKER_USERNAME}/elibrary-frontend:$(git rev-parse --short HEAD)

# Build backend image
echo "📦 Building backend image..."
docker build -t ${DOCKER_USERNAME}/elibrary-backend:latest ./backend
docker tag ${DOCKER_USERNAME}/elibrary-backend:latest ${DOCKER_USERNAME}/elibrary-backend:$(git rev-parse --short HEAD)

echo "✅ Images built successfully!"

# Push images if requested
if [ "$PUSH_IMAGES" = true ]; then
    echo "🚀 Pushing images to Docker Hub..."
    
    docker push ${DOCKER_USERNAME}/elibrary-frontend:latest
    docker push ${DOCKER_USERNAME}/elibrary-frontend:$(git rev-parse --short HEAD)
    
    docker push ${DOCKER_USERNAME}/elibrary-backend:latest
    docker push ${DOCKER_USERNAME}/elibrary-backend:$(git rev-parse --short HEAD)
    
    echo "✅ Images pushed successfully!"
fi

echo "📋 Built images:"
echo "  ${DOCKER_USERNAME}/elibrary-frontend:latest"
echo "  ${DOCKER_USERNAME}/elibrary-frontend:$(git rev-parse --short HEAD)"
echo "  ${DOCKER_USERNAME}/elibrary-backend:latest"
echo "  ${DOCKER_USERNAME}/elibrary-backend:$(git rev-parse --short HEAD)"