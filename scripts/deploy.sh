#!/bin/bash

# eLibrary Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-local}
NAMESPACE="elibrary"

echo "🚀 Deploying eLibrary to $ENVIRONMENT environment..."

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo "❌ kubectl is not installed or not in PATH"
        exit 1
    fi
}

# Function to check if cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        echo "❌ Cannot connect to Kubernetes cluster"
        exit 1
    fi
}

# Function to create namespace if it doesn't exist
create_namespace() {
    if ! kubectl get namespace $NAMESPACE &> /dev/null; then
        echo "📦 Creating namespace $NAMESPACE..."
        kubectl apply -f k8s/namespace.yaml
    else
        echo "✅ Namespace $NAMESPACE already exists"
    fi
}

# Function to deploy MySQL
deploy_mysql() {
    echo "🗄️ Deploying MySQL..."
    kubectl apply -f k8s/mysql/
    
    echo "⏳ Waiting for MySQL to be ready..."
    kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s
}

# Function to deploy backend
deploy_backend() {
    echo "🔧 Deploying Backend..."
    kubectl apply -f k8s/backend/
    
    echo "⏳ Waiting for Backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s
}

# Function to deploy frontend
deploy_frontend() {
    echo "🌐 Deploying Frontend..."
    kubectl apply -f k8s/frontend/
    
    echo "⏳ Waiting for Frontend to be ready..."
    kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s
}

# Function to deploy monitoring
deploy_monitoring() {
    echo "📊 Deploying Monitoring..."
    kubectl apply -f k8s/monitoring/
    
    echo "⏳ Waiting for Monitoring to be ready..."
    kubectl wait --for=condition=ready pod -l app=prometheus -n $NAMESPACE --timeout=300s
    kubectl wait --for=condition=ready pod -l app=grafana -n $NAMESPACE --timeout=300s
}

# Function to run health checks
health_check() {
    echo "🏥 Running health checks..."
    
    # Check if all pods are running
    if kubectl get pods -n $NAMESPACE | grep -v Running | grep -v Completed; then
        echo "⚠️ Some pods are not running properly"
        kubectl get pods -n $NAMESPACE
    else
        echo "✅ All pods are running"
    fi
    
    # Check services
    echo "🔍 Checking services..."
    kubectl get services -n $NAMESPACE
}

# Function to display access information
show_access_info() {
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Access Information:"
    echo "===================="
    
    # Get LoadBalancer IPs or use port-forward instructions
    FRONTEND_IP=$(kubectl get service frontend-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    GRAFANA_IP=$(kubectl get service grafana-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    
    if [ -n "$FRONTEND_IP" ]; then
        echo "🌐 Frontend: http://$FRONTEND_IP"
    else
        echo "🌐 Frontend: kubectl port-forward svc/frontend-service 4200:80 -n $NAMESPACE"
    fi
    
    if [ -n "$GRAFANA_IP" ]; then
        echo "📊 Grafana: http://$GRAFANA_IP:3000 (admin/admin123)"
    else
        echo "📊 Grafana: kubectl port-forward svc/grafana-service 3000:3000 -n $NAMESPACE"
    fi
    
    echo "📈 Prometheus: kubectl port-forward svc/prometheus-service 9090:9090 -n $NAMESPACE"
    echo ""
    echo "🔧 Useful commands:"
    echo "  kubectl get pods -n $NAMESPACE"
    echo "  kubectl logs -f deployment/backend-deployment -n $NAMESPACE"
    echo "  kubectl describe pod <pod-name> -n $NAMESPACE"
}

# Main deployment flow
main() {
    echo "🔍 Pre-deployment checks..."
    check_kubectl
    check_cluster
    
    echo "🏗️ Starting deployment..."
    create_namespace
    
    case $ENVIRONMENT in
        "local"|"development")
            deploy_mysql
            deploy_backend
            deploy_frontend
            deploy_monitoring
            ;;
        "staging"|"production")
            deploy_mysql
            deploy_backend
            deploy_frontend
            deploy_monitoring
            ;;
        *)
            echo "❌ Unknown environment: $ENVIRONMENT"
            echo "Available environments: local, development, staging, production"
            exit 1
            ;;
    esac
    
    health_check
    show_access_info
}

# Handle script interruption
trap 'echo "❌ Deployment interrupted"; exit 1' INT TERM

# Run main function
main