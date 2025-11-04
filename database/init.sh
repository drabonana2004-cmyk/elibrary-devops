#!/bin/bash

# Script d'initialisation de la base de données eLibrary

echo "🗄️ Initialisation de la base de données eLibrary..."

# Vérifier si MySQL est installé
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Demander les informations de connexion
read -p "Nom d'utilisateur MySQL (root): " DB_USER
DB_USER=${DB_USER:-root}

read -s -p "Mot de passe MySQL: " DB_PASSWORD
echo

# Créer la base de données et les tables
echo "📊 Création du schéma de base de données..."
mysql -u $DB_USER -p$DB_PASSWORD < schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schéma créé avec succès"
else
    echo "❌ Erreur lors de la création du schéma"
    exit 1
fi

# Insérer les données de test
echo "📝 Insertion des données de test..."
mysql -u $DB_USER -p$DB_PASSWORD < seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Données de test insérées avec succès"
else
    echo "❌ Erreur lors de l'insertion des données"
    exit 1
fi

echo "🎉 Base de données eLibrary initialisée avec succès!"
echo ""
echo "📋 Informations de connexion:"
echo "   - Base de données: elibrary"
echo "   - Utilisateur: $DB_USER"
echo "   - Host: localhost"
echo "   - Port: 3306"
echo ""
echo "👤 Compte administrateur créé:"
echo "   - Email: admin@elibrary.com"
echo "   - Mot de passe: password"