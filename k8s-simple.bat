@echo off
echo ========================================
echo DEPLOIEMENT KUBERNETES SIMPLIFIE
echo ========================================

echo.
echo 1. SUPPRESSION ANCIEN DEPLOIEMENT:
kubectl delete namespace elibrary --ignore-not-found=true
timeout /t 5 /nobreak >nul

echo.
echo 2. CREATION NAMESPACE:
kubectl create namespace elibrary

echo.
echo 3. DEPLOIEMENT MYSQL SEUL:
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  namespace: elibrary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "secretpassword"
        - name: MYSQL_DATABASE
          value: "elibrary"
        ports:
        - containerPort: 3306
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
  namespace: elibrary
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
EOF

echo.
echo 4. ATTENTE MYSQL:
timeout /t 10 /nobreak >nul

echo.
echo 5. VERIFICATION:
kubectl get all -n elibrary

echo.
echo ========================================
echo MYSQL DEPLOYE - ETAPE 1 TERMINEE
echo ========================================
pause