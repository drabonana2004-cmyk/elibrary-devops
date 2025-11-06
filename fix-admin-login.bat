@echo off
echo ========================================
echo RESOLUTION PROBLEME CONNEXION ADMIN
echo ========================================

echo.
echo 1. DIAGNOSTIC SERVICES:
echo ======================
kubectl get pods -n elibrary
kubectl get svc -n elibrary

echo.
echo 2. VERIFICATION BACKEND:
echo =======================
echo Test connexion backend...
kubectl port-forward svc/backend-service 8000:8000 -n elibrary &
timeout /t 3 /nobreak >nul
curl -s http://localhost:8000/api/health || echo Backend inaccessible

echo.
echo 3. VERIFICATION DATABASE:
echo ========================
echo Test connexion MySQL...
kubectl exec -it deployment/mysql -n elibrary -- mysql -u root -psecretpassword -e "USE elibrary; SELECT COUNT(*) FROM users WHERE role='admin';" 2>nul || echo "Probleme base de donnees"

echo.
echo 4. RESET ADMIN USER:
echo ===================
echo Creation/Reset utilisateur admin...
kubectl exec -it deployment/mysql -n elibrary -- mysql -u root -psecretpassword -e "
USE elibrary;
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES ('Admin', 'admin@elibrary.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
role = 'admin';
SELECT 'Admin user created/updated' as status;
"

echo.
echo 5. RESTART SERVICES:
echo ===================
echo Redemarrage des services...
kubectl rollout restart deployment/backend -n elibrary
kubectl rollout restart deployment/frontend -n elibrary

echo.
echo 6. ACCES APPLICATION:
echo ====================
timeout /t 10 /nobreak >nul
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
timeout /t 3 /nobreak >nul
start http://localhost:4200

echo.
echo ========================================
echo PROBLEME RESOLU !
echo ========================================
echo.
echo IDENTIFIANTS ADMIN:
echo Email: admin@elibrary.com
echo Password: password
echo.
echo Application: http://localhost:4200
echo.
pause