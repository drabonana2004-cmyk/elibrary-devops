@echo off
echo ========================================
echo Test Final - Permissions eLibrary
echo ========================================

echo.
echo 1. Test connexion admin
curl -X POST "http://localhost:8000/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"admin\",\"password\":\"admin\"}"

echo.
echo.
echo 2. Test ajout livre - ADMIN (doit reussir)
curl -X POST "http://localhost:8000/api/books" -H "Content-Type: application/json" -H "User-Id: 1" -H "User-Role: admin" -d "{\"title\":\"Livre Admin\",\"author\":\"Admin Author\",\"isbn\":\"ADMIN123\",\"category_id\":1,\"description\":\"Livre ajoute par admin\"}"

echo.
echo.
echo 3. Test ajout livre - USER CERTIFIE (doit echouer)
curl -X POST "http://localhost:8000/api/books" -H "Content-Type: application/json" -H "User-Id: 2" -H "User-Role: user" -d "{\"title\":\"Livre User\",\"author\":\"User Author\",\"isbn\":\"USER123\",\"category_id\":1,\"description\":\"Livre ajoute par user\"}"

echo.
echo.
echo 4. Test emprunt - USER CERTIFIE (doit reussir)
curl -X POST "http://localhost:8000/api/borrows/request" -H "Content-Type: application/json" -H "User-Id: 2" -H "User-Role: user" -H "User-Status: approved" -d "{\"book_id\":1}"

echo.
echo.
echo 5. Test emprunt - USER NON CERTIFIE (doit echouer)
curl -X POST "http://localhost:8000/api/borrows/request" -H "Content-Type: application/json" -H "User-Id: 4" -H "User-Role: user" -H "User-Status: pending" -d "{\"book_id\":2}"

echo.
echo.
echo 6. Verification catalogue public (tous peuvent voir)
curl -X GET "http://localhost:8000/api/books" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo RESUME DES PERMISSIONS:
echo - Voir catalogue: TOUS les utilisateurs
echo - Emprunter: Utilisateurs CERTIFIES uniquement  
echo - Ajouter livres: ADMIN uniquement
echo ========================================

pause