# 📦 Dockerfiles - eLibrary Services

## Vue d'ensemble

Trois Dockerfiles individuels pour une architecture 3-tiers complètement conteneurisée :

| Service | Dockerfile | Image de base | Port | Taille optimisée |
|---------|------------|---------------|------|------------------|
| **Frontend** | `frontend/Dockerfile` | `node:18-alpine` + `nginx:alpine` | 80 | ✅ Multi-stage |
| **Backend** | `backend/Dockerfile` | `php:8.2-apache` | 8000 | ✅ Extensions PHP |
| **Database** | Image officielle | `mysql:8.0` | 3306 | ✅ Pré-optimisée |

---

## 🎨 Frontend Dockerfile

**Fichier** : `frontend/Dockerfile`

```dockerfile
# Frontend Dockerfile - Angular 17
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/elibrary /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Caractéristiques :
- ✅ **Multi-stage build** : Optimisation taille image
- ✅ **Node.js 18 Alpine** : Build Angular
- ✅ **Nginx Alpine** : Serveur web production
- ✅ **Configuration personnalisée** : nginx.conf
- 📦 **Taille finale** : ~25MB (vs 1GB+ avec Node)

---

## ⚙️ Backend Dockerfile

**Fichier** : `backend/Dockerfile`

```dockerfile
# Backend Dockerfile - Laravel 11
FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy Apache configuration
COPY apache.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 8000
CMD ["apache2-foreground"]
```

### Caractéristiques :
- ✅ **PHP 8.2 + Apache** : Stack Laravel optimisée
- ✅ **Extensions PHP** : MySQL, GD, mbstring, etc.
- ✅ **Composer** : Gestion dépendances
- ✅ **Permissions** : Sécurité Apache
- ✅ **Configuration** : Apache personnalisée

---

## 🗄️ Database (MySQL)

**Image officielle** : `mysql:8.0`

```yaml
# Utilisée dans docker-compose.yml et k8s/
image: mysql:8.0
environment:
  MYSQL_DATABASE: elibrary
  MYSQL_ROOT_PASSWORD: secretpassword
ports:
  - "3306:3306"
```

### Caractéristiques :
- ✅ **Image officielle** : Maintenue par MySQL
- ✅ **Version stable** : MySQL 8.0 LTS
- ✅ **Configuration** : Variables d'environnement
- ✅ **Persistance** : Volumes Docker/K8s

---

## 🔧 Configurations associées

### Frontend - nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend-service:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Backend - apache.conf
```apache
<VirtualHost *:8000>
    DocumentRoot /var/www/html/public
    
    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

Listen 8000
```

---

## 🚀 Build et utilisation

### Build individuel
```bash
# Frontend
cd frontend
docker build -t elibrary-frontend:latest .

# Backend
cd backend
docker build -t elibrary-backend:latest .

# Database (pull)
docker pull mysql:8.0
```

### Build avec Docker Compose
```bash
# Build tous les services
docker-compose build

# Build service spécifique
docker-compose build frontend
docker-compose build backend
```

### Utilisation en production
```bash
# Démarrage complet
docker-compose up -d

# Vérification
docker ps
docker images | grep elibrary
```

---

## ✅ Validation des Dockerfiles

### Tests de build
```bash
# Test build frontend
docker build -t test-frontend ./frontend

# Test build backend  
docker build -t test-backend ./backend

# Test run
docker run -p 4200:80 test-frontend
docker run -p 8000:8000 test-backend
```

### Optimisations appliquées
- ✅ **Multi-stage builds** (Frontend)
- ✅ **Images Alpine** (taille réduite)
- ✅ **Cache layers** optimisé
- ✅ **Dépendances minimales**
- ✅ **Sécurité** (permissions, utilisateurs)

**Dockerfiles individuels optimisés et prêts pour la production !** 🐳