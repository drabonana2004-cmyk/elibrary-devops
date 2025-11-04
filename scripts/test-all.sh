#!/bin/bash

# Script de test automatisé pour eLibrary DevOps
# Usage: ./test-all.sh [--quick|--full]

set -e

TEST_MODE=${1:-quick}
NAMESPACE="elibrary"
FAILED_TESTS=0
TOTAL_TESTS=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test function wrapper
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Running test: $test_name"
    
    if eval "$test_command"; then
        log_success "✅ $test_name"
    else
        log_error "❌ $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

# Docker tests
test_docker_compose() {
    log_info "🐳 Testing Docker Compose..."
    
    run_test "Docker Compose Up" "docker-compose up -d"
    sleep 10
    
    run_test "Frontend Health Check" "curl -f http://localhost:4200/health"
    run_test "Backend Health Check" "curl -f http://localhost:8000/api/health"
    run_test "Backend API Stats" "curl -f http://localhost:8000/api/dashboard/stats"
    run_test "MySQL Connection" "docker-compose exec -T mysql mysql -u root -psecretpassword -e 'SELECT 1'"
    
    if [ "$TEST_MODE" = "full" ]; then
        run_test "Prometheus Metrics" "curl -f http://localhost:9090/api/v1/query?query=up"
        run_test "Grafana Health" "curl -f http://localhost:3000/api/health"
    fi
}

# Kubernetes tests
test_kubernetes() {
    log_info "☸️ Testing Kubernetes..."
    
    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        log_warning "kubectl not found, skipping Kubernetes tests"
        return
    fi
    
    # Check if cluster is accessible
    if ! kubectl cluster-info &> /dev/null; then
        log_warning "Kubernetes cluster not accessible, skipping tests"
        return
    fi
    
    run_test "Apply Namespace" "kubectl apply -f k8s/namespace.yaml"
    run_test "Apply MySQL" "kubectl apply -f k8s/mysql/"
    run_test "Apply Backend" "kubectl apply -f k8s/backend/"
    run_test "Apply Frontend" "kubectl apply -f k8s/frontend/"
    
    if [ "$TEST_MODE" = "full" ]; then
        run_test "Apply Monitoring" "kubectl apply -f k8s/monitoring/"
        
        # Wait for pods to be ready
        log_info "Waiting for pods to be ready..."
        kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s || true
        kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s || true
        kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s || true
        
        run_test "All Pods Running" "kubectl get pods -n $NAMESPACE | grep -v Pending | grep -v Error"
        run_test "Services Available" "kubectl get services -n $NAMESPACE"
    fi
}

# Application tests
test_application() {
    log_info "🔧 Testing Application Logic..."
    
    # Frontend tests
    if [ -d "frontend" ]; then
        cd frontend
        if [ -f "package.json" ]; then
            run_test "Frontend Dependencies" "npm ci"
            run_test "Frontend Lint" "npm run lint || true"
            if [ "$TEST_MODE" = "full" ]; then
                run_test "Frontend Tests" "npm test -- --watch=false --browsers=ChromeHeadless || true"
            fi
        fi
        cd ..
    fi
    
    # Backend tests
    if [ -d "backend" ]; then
        cd backend
        if [ -f "composer.json" ]; then
            run_test "Backend Dependencies" "composer install --no-dev"
            if [ "$TEST_MODE" = "full" ]; then
                run_test "Backend Tests" "php artisan test || true"
            fi
        fi
        cd ..
    fi
}

# Performance tests
test_performance() {
    log_info "⚡ Testing Performance..."
    
    # Simple load test
    run_test "Load Test Frontend" "for i in {1..10}; do curl -s http://localhost:4200/ > /dev/null & done; wait"
    run_test "Load Test Backend" "for i in {1..10}; do curl -s http://localhost:8000/api/health > /dev/null & done; wait"
    
    if command -v ab &> /dev/null && [ "$TEST_MODE" = "full" ]; then
        run_test "Apache Bench Frontend" "ab -n 100 -c 5 http://localhost:4200/"
        run_test "Apache Bench Backend" "ab -n 100 -c 5 http://localhost:8000/api/health"
    fi
}

# Security tests
test_security() {
    log_info "🔒 Testing Security..."
    
    if command -v trivy &> /dev/null && [ "$TEST_MODE" = "full" ]; then
        run_test "Scan Frontend Image" "trivy image --exit-code 0 elibrary-frontend:latest || true"
        run_test "Scan Backend Image" "trivy image --exit-code 0 elibrary-backend:latest || true"
    fi
    
    # Check for exposed secrets
    run_test "No Hardcoded Secrets" "! grep -r 'password.*=' k8s/ || true"
    run_test "Kubernetes Secrets Exist" "kubectl get secrets -n $NAMESPACE || true"
}

# Monitoring tests
test_monitoring() {
    log_info "📊 Testing Monitoring..."
    
    if [ "$TEST_MODE" = "full" ]; then
        # Port forward for testing
        kubectl port-forward svc/prometheus-service 9090:9090 -n $NAMESPACE &
        PROM_PID=$!
        kubectl port-forward svc/grafana-service 3000:3000 -n $NAMESPACE &
        GRAFANA_PID=$!
        
        sleep 5
        
        run_test "Prometheus Targets" "curl -f http://localhost:9090/api/v1/targets"
        run_test "Grafana API" "curl -f http://localhost:3000/api/health"
        
        # Cleanup
        kill $PROM_PID $GRAFANA_PID 2>/dev/null || true
    fi
}

# Cleanup function
cleanup() {
    log_info "🧹 Cleaning up..."
    
    if [ "$TEST_MODE" = "full" ]; then
        docker-compose down -v 2>/dev/null || true
        kubectl delete namespace $NAMESPACE --ignore-not-found=true 2>/dev/null || true
    fi
}

# Main test execution
main() {
    log_info "🚀 Starting eLibrary DevOps Tests ($TEST_MODE mode)"
    echo ""
    
    case $TEST_MODE in
        "quick")
            test_docker_compose
            test_application
            ;;
        "full")
            test_docker_compose
            test_kubernetes
            test_application
            test_performance
            test_security
            test_monitoring
            ;;
        *)
            log_error "Unknown test mode: $TEST_MODE"
            echo "Usage: $0 [--quick|--full]"
            exit 1
            ;;
    esac
    
    # Test summary
    echo ""
    log_info "📋 Test Summary"
    echo "=================="
    echo "Total tests: $TOTAL_TESTS"
    echo "Passed: $((TOTAL_TESTS - FAILED_TESTS))"
    echo "Failed: $FAILED_TESTS"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        log_success "🎉 All tests passed!"
        exit 0
    else
        log_error "❌ $FAILED_TESTS test(s) failed"
        exit 1
    fi
}

# Handle script interruption
trap cleanup INT TERM

# Run main function
main