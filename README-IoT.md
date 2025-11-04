# eLibrary IoT - Guide Complet

## 🎯 Système Complet Intégré

### ✅ **Fonctionnalités Implémentées**

#### **Application Web**
- ✅ Authentification par rôles (Admin/User)
- ✅ Inscription de nouveaux utilisateurs
- ✅ Dashboard admin avec statistiques
- ✅ Catalogue utilisateur avec recherche
- ✅ Gestion des emprunts/retours
- ✅ **Kiosque IoT intégré avec simulation**

#### **Backend API**
- ✅ Endpoint IoT `/api/iot/event`
- ✅ Gestion automatique emprunt/retour
- ✅ Tables IoT (devices, book_tags, iot_events)
- ✅ 8 tags RFID pré-configurés

#### **Hardware IoT**
- ✅ Script Python pour Raspberry Pi
- ✅ Support module RFID RC522
- ✅ Configuration automatique

---

## 🚀 **Commandes d'Exécution**

### **Application Web**
```cmd
cd c:\Users\drabo\Documents\elibrary
start-elibrary.bat
```

### **URLs d'Accès**
- **Application** : http://localhost:64402
- **Backend API** : http://localhost:8000
- **Kiosque IoT** : http://localhost:64402/kiosk

### **Comptes de Test**
- **Admin** : admin@elibrary.com / password
- **User** : jean@example.com / password

---

## 🔧 **Configuration Hardware (Raspberry Pi)**

### **Matériel Requis**
- Raspberry Pi 3/4 ou Pi Zero W
- Module RFID RC522 (~10€)
- Tags RFID/NFC (~0.50€/pièce)
- Câbles de connexion

### **Câblage RC522 → Raspberry Pi**
```
RC522 SDA (SS)  → GPIO 8  (Pin 24)
RC522 SCK       → GPIO 11 (Pin 23)
RC522 MOSI      → GPIO 10 (Pin 19)
RC522 MISO      → GPIO 9  (Pin 21)
RC522 RST       → GPIO 25 (Pin 22)
RC522 3.3V      → 3.3V    (Pin 1)
RC522 GND       → GND     (Pin 6)
```

### **Installation sur Raspberry Pi**
```bash
# 1. Copier les fichiers
scp raspberry-pi/* pi@YOUR_PI_IP:/home/pi/

# 2. Se connecter au Pi
ssh pi@YOUR_PI_IP

# 3. Exécuter la configuration
chmod +x setup-pi.sh
./setup-pi.sh

# 4. Modifier l'URL API
nano reader_http.py
# Changer: API_URL = "http://YOUR_SERVER_IP:8000/api/iot/event"

# 5. Tester manuellement
python3 reader_http.py

# 6. Installer comme service
sudo systemctl start elibrary-rfid
sudo systemctl enable elibrary-rfid
```

---

## 📱 **Utilisation du Système IoT**

### **Workflow Complet**

#### **1. Préparation**
- Coller un tag RFID sur chaque livre
- Enregistrer les tags dans la base (déjà fait pour 8 livres)

#### **2. Emprunt Automatique**
1. Utilisateur se connecte sur l'application
2. Va sur "Kiosque IoT" 
3. Place le livre sur le lecteur RFID
4. Le système détecte automatiquement :
   - Le livre (via tag RFID)
   - L'utilisateur (connecté)
   - Crée l'emprunt automatiquement

#### **3. Retour Automatique**
1. Utilisateur place le livre emprunté sur le lecteur
2. Le système détecte que le livre est déjà emprunté
3. Enregistre automatiquement le retour

### **Tags RFID Pré-configurés**
```
A1B2C3D4 → Le Petit Prince
E5F6G7H8 → 1984
I9J0K1L2 → Algorithmique
M3N4O5P6 → Histoire de France
Q7R8S9T0 → Méditations
U1V2W3X4 → Clean Code
Y5Z6A7B8 → Sapiens
C9D0E1F2 → Art de la Guerre
```

---

## 🧪 **Test Sans Hardware**

### **Simulation Web**
1. Connectez-vous comme utilisateur
2. Allez sur "Kiosque IoT"
3. Utilisez la "Simulation de Scan"
4. Sélectionnez un livre et cliquez "Simuler Scan"
5. Observez le résultat en temps réel

### **Test API Direct**
```bash
# Test emprunt
curl -X POST http://localhost:8000/api/iot/event \
  -H "Content-Type: application/json" \
  -d '{"device_id":"test","tag_uid":"A1B2C3D4","user_id":2}'

# Test retour (même commande, détecte automatiquement)
curl -X POST http://localhost:8000/api/iot/event \
  -H "Content-Type: application/json" \
  -d '{"device_id":"test","tag_uid":"A1B2C3D4","user_id":2}'
```

---

## 📊 **Architecture IoT**

### **Flux de Données**
```
[Tag RFID] → [Raspberry Pi] → [HTTP POST] → [Laravel API] → [Base SQLite] → [Angular UI]
```

### **Tables Ajoutées**
- **devices** : Dispositifs IoT enregistrés
- **book_tags** : Association livre ↔ tag RFID
- **iot_events** : Historique des scans

### **Endpoint API**
- **POST** `/api/iot/event`
- **Payload** : `{device_id, tag_uid, user_id}`
- **Réponse** : `{status, message, book, due_date}`

---

## 🔒 **Sécurité & Production**

### **Recommandations**
- Utiliser HTTPS en production
- Ajouter authentification API (tokens)
- Chiffrer les communications Pi ↔ Serveur
- Backup automatique de la base de données

### **Monitoring**
- Logs des scans dans `iot_events`
- Statut des dispositifs en temps réel
- Alertes en cas de dysfonctionnement

---

## 🎉 **Système Complet Fonctionnel !**

L'application eLibrary intègre maintenant :
- ✅ Gestion complète de bibliothèque
- ✅ Interface web moderne
- ✅ Système IoT avec RFID
- ✅ Emprunt/retour automatique
- ✅ Simulation pour tests
- ✅ Hardware Raspberry Pi prêt

**Coût total hardware : ~60-120€**
**Temps de déploiement : ~2h**