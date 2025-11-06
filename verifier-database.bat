@echo off
echo ========================================
echo VERIFICATION BASE DE DONNEES ELIBRARY
echo ========================================

echo.
echo 1. VERIFICATION POD MYSQL:
echo ==========================
kubectl get pods -n elibrary | findstr mysql

echo.
echo 2. VERIFICATION SERVICE MYSQL:
echo ==============================
kubectl get svc -n elibrary | findstr mysql

echo.
echo 3. LOGS MYSQL:
echo =============
kubectl logs -l app=mysql -n elibrary --tail=10

echo.
echo 4. DESCRIPTION POD MYSQL:
echo =========================
kubectl describe pod -l app=mysql -n elibrary

echo.
echo 5. TEST CONNEXION DATABASE:
echo ===========================
echo Test connexion depuis le backend...
kubectl exec -it deployment/backend -n elibrary -- php -r "
try {
    \$pdo = new PDO('mysql:host=mysql-service;dbname=elibrary', 'root', 'secretpassword');
    echo 'Connexion MySQL: OK\n';
    \$stmt = \$pdo->query('SHOW TABLES');
    echo 'Tables: ' . \$stmt->rowCount() . '\n';
} catch(Exception \$e) {
    echo 'Erreur: ' . \$e->getMessage() . '\n';
}
"

echo.
echo ========================================
echo VERIFICATION TERMINEE
echo ========================================
pause