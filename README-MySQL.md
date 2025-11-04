# Configuration MySQL pour eLibrary

## Prérequis
- XAMPP, WAMP, MAMP ou MySQL installé
- PHP avec extension MySQL/PDO activée

## Installation rapide

### 1. Démarrer MySQL
Démarrez MySQL via votre serveur local (XAMPP/WAMP/MAMP)

### 2. Créer la base de données
Ouvrez phpMyAdmin ou MySQL en ligne de commande et exécutez :
```sql
CREATE DATABASE IF NOT EXISTS elibrary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Importer les données
Exécutez le script SQL fourni :
```bash
mysql -u root -p elibrary < backend/create_mysql_database.sql
```

Ou copiez-collez le contenu de `backend/create_mysql_database.sql` dans phpMyAdmin.

### 4. Configurer les credentials
Modifiez le fichier `backend/.env` si nécessaire :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=elibrary
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

### 5. Démarrer l'application
```bash
# Backend
cd backend
php -S 127.0.0.1:8000 -t . server.php

# Frontend (nouveau terminal)
cd frontend
npm start
```

## Données de test incluses
- 10 catégories de livres
- 15 livres de test avec descriptions
- Structure complète pour les emprunts

## URLs d'accès
- Frontend : http://localhost:4200
- Backend API : http://127.0.0.1:8000/api
- phpMyAdmin : http://localhost/phpmyadmin (selon votre configuration)

## Résolution des problèmes

### Erreur "could not find driver"
Activez l'extension MySQL dans php.ini :
```ini
extension=pdo_mysql
extension=mysqli
```

### Erreur de connexion MySQL
Vérifiez que :
- MySQL est démarré
- Les credentials dans .env sont corrects
- Le port 3306 est disponible

### Base de données vide
Réexécutez le script SQL :
```bash
mysql -u root -p elibrary < backend/create_mysql_database.sql
```