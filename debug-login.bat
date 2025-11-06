@echo off
echo ========================================
echo DIAGNOSTIC PROBLEME CONNEXION
echo ========================================

echo.
echo 1. VERIFICATION SERVICES:
echo ========================
kubectl get pods -n elibrary
kubectl get svc -n elibrary

echo.
echo 2. TEST BACKEND:
echo ===============
echo Demarrage port-forward backend...
start /b kubectl port-forward svc/backend-service 8000:8000 -n elibrary
timeout /t 5 /nobreak >nul

echo Test API backend...
curl -s http://localhost:8000/api/health || echo "Backend inaccessible"

echo.
echo 3. VERIFICATION BASE DE DONNEES:
echo ===============================
echo Verification utilisateur admin...
kubectl exec -it deployment/mysql -n elibrary -- mysql -u root -psecretpassword -e "
USE elibrary;
SHOW TABLES;
SELECT * FROM users WHERE email = 'admin@gmail.com';
"

echo.
echo 4. CREATION/CORRECTION ADMIN:
echo ============================
echo Force creation admin...
kubectl exec -it deployment/mysql -n elibrary -- mysql -u root -psecretpassword -e "
USE elibrary;

-- Creer table si inexistante
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Supprimer et recreer admin
DELETE FROM users WHERE email = 'admin@gmail.com';
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@gmail.com', '\$2y\$10\$EuWkzWjr8RqPhx8fVN6dLOLvblfyoA7YvzN8xWJkYQOtJz.6qOyoG', 'admin');

-- Verification
SELECT id, name, email, role FROM users WHERE email = 'admin@gmail.com';
"

echo.
echo 5. REDEMARRAGE COMPLET:
echo ======================
kubectl rollout restart deployment/backend -n elibrary
kubectl rollout restart deployment/frontend -n elibrary
kubectl rollout restart deployment/mysql -n elibrary

echo Attente redemarrage...
timeout /t 15 /nobreak >nul

echo.
echo 6. ACCES APPLICATION:
echo ====================
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
start /b kubectl port-forward svc/backend-service 8000:8000 -n elibrary
timeout /t 3 /nobreak >nul
start http://localhost:4200

echo.
echo ========================================
echo CORRECTION TERMINEE !
echo ========================================
echo.
echo IDENTIFIANTS:
echo Email: admin@gmail.com
echo Password: admin123
echo.
echo Application: http://localhost:4200
echo Backend API: http://localhost:8000
echo.
pause