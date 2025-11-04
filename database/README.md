# Base de données eLibrary

## Configuration MySQL

### 1. Installation
```bash
# Installer MySQL Server
# Windows: Télécharger depuis https://dev.mysql.com/downloads/mysql/
# Ubuntu: sudo apt install mysql-server
# macOS: brew install mysql
```

### 2. Création de la base de données
```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le schéma
source database/schema.sql

# Insérer les données de test
source database/seed.sql
```

### 3. Configuration Laravel (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=elibrary
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Configuration Docker
```yaml
# Déjà configuré dans docker-compose.yml
mysql:
  image: mysql:8.0
  environment:
    MYSQL_DATABASE: elibrary
    MYSQL_ROOT_PASSWORD: secretpassword
  ports:
    - "3306:3306"
```

## Structure des tables

### Users (Utilisateurs)
- Gestion des comptes utilisateurs et administrateurs
- Statuts: pending, approved, rejected
- Support RFID pour l'IoT

### Books (Livres)
- Catalogue complet des livres
- Gestion des exemplaires multiples
- Images de couverture
- Tags RFID pour l'IoT

### Categories (Catégories)
- Classification des livres
- Couleurs et icônes personnalisées

### Borrow_requests (Demandes d'emprunt)
- Workflow complet d'emprunt
- Statuts: pending, approved, rejected, active, returned, overdue
- Gestion des amendes

### Notifications
- Système de notifications pour les utilisateurs
- Types: info, success, warning, error

### Admin_logs
- Traçabilité des actions administrateur
- Audit trail complet

## Commandes utiles

```sql
-- Voir tous les utilisateurs
SELECT * FROM users;

-- Voir les emprunts en cours
SELECT u.name, b.title, br.due_date 
FROM borrow_requests br
JOIN users u ON br.user_id = u.id
JOIN books b ON br.book_id = b.id
WHERE br.status = 'active';

-- Statistiques du dashboard
SELECT 
  (SELECT COUNT(*) FROM books) as total_books,
  (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
  (SELECT COUNT(*) FROM borrow_requests WHERE status = 'active') as active_borrows;
```