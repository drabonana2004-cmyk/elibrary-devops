@echo off
echo ========================================
echo CREATION ADMIN PERSONNALISE
echo ========================================

echo.
echo IDENTIFIANTS ADMIN:
echo Email: admin@gmail.com
echo Password: admin123
echo.

echo 1. ACCES BASE DE DONNEES:
echo =========================
echo Creation utilisateur admin personnalise...

kubectl exec -it deployment/mysql -n elibrary -- mysql -u root -psecretpassword -e "
USE elibrary;

-- Supprimer admin existant
DELETE FROM users WHERE email = 'admin@gmail.com' OR role = 'admin';

-- Creer nouvel admin avec vos identifiants
-- Password 'admin123' hashe avec bcrypt
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES (
    'Administrator',
    'admin@gmail.com',
    '$2y$10\$EuWkzWjr8RqPhx8fVN6dLOLvblfyoA7YvzN8xWJkYQOtJz.6qOyoG',
    'admin',
    NOW(),
    NOW()
);

-- Verification
SELECT id, name, email, role FROM users WHERE email = 'admin@gmail.com';
SELECT 'Admin cree avec succes!' as status;
"

echo.
echo 2. REDEMARRAGE SERVICES:
echo =======================
echo Redemarrage backend pour appliquer les changements...
kubectl rollout restart deployment/backend -n elibrary
kubectl rollout restart deployment/frontend -n elibrary

echo Attente redemarrage...
timeout /t 10 /nobreak >nul

echo.
echo 3. ACCES APPLICATION:
echo ====================
echo Ouverture application...
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
timeout /t 3 /nobreak >nul
start http://localhost:4200

echo.
echo ========================================
echo ADMIN PERSONNALISE CREE !
echo ========================================
echo.
echo IDENTIFIANTS DE CONNEXION:
echo Email: admin@gmail.com
echo Password: admin123
echo.
echo Application: http://localhost:4200
echo.
echo Vous pouvez maintenant vous connecter !
echo.
pause