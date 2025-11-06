@echo off
echo ========================================
echo Test API eLibrary - Livres et Emprunts
echo ========================================

echo.
echo 1. Test de l'API des livres (public)
curl -X GET "http://localhost:8000/api/books" -H "Content-Type: application/json"

echo.
echo.
echo 2. Test de l'API des categories (public)
curl -X GET "http://localhost:8000/api/categories" -H "Content-Type: application/json"

echo.
echo.
echo 3. Test connexion admin
curl -X POST "http://localhost:8000/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"admin\",\"password\":\"admin\"}"

echo.
echo.
echo 4. Test ajout livre (admin uniquement)
curl -X POST "http://localhost:8000/api/books" -H "Content-Type: application/json" -H "User-Id: 1" -H "User-Role: admin" -d "{\"title\":\"Test Book\",\"author\":\"Test Author\",\"isbn\":\"123456789\",\"category_id\":1,\"description\":\"Livre de test\"}"

echo.
echo.
echo 4b. Test ajout livre (utilisateur certifie - doit echouer)
curl -X POST "http://localhost:8000/api/books" -H "Content-Type: application/json" -H "User-Id: 2" -H "User-Role: user" -d "{\"title\":\"Test Book User\",\"author\":\"User Author\",\"isbn\":\"987654321\",\"category_id\":1,\"description\":\"Livre de test utilisateur\"}"

echo.
echo.
echo 5. Test demande emprunt (utilisateur certifie)
curl -X POST "http://localhost:8000/api/borrows/request" -H "Content-Type: application/json" -H "User-Id: 2" -H "User-Role: user" -H "User-Status: approved" -d "{\"book_id\":1}"

echo.
echo.
echo 6. Test demande emprunt (utilisateur non certifie)
curl -X POST "http://localhost:8000/api/borrows/request" -H "Content-Type: application/json" -H "User-Id: 4" -H "User-Role: user" -H "User-Status: pending" -d "{\"book_id\":1}"

echo.
echo.
echo Tests termines!
pause