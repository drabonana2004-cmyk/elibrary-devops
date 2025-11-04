#!/usr/bin/env python3
# reader_http.py - RFID RC522 -> HTTP POST to eLibrary API

import time
import requests
import json
from mfrc522 import SimpleMFRC522

# Configuration
API_URL = "http://YOUR_SERVER_IP:8000/api/iot/event"  # Remplacer par votre IP
DEVICE_ID = "pi_1"
USER_ID = 2  # ID utilisateur par défaut (à modifier selon besoin)

# Initialiser le lecteur RFID
reader = SimpleMFRC522()

print("=== eLibrary RFID Reader ===")
print(f"Device ID: {DEVICE_ID}")
print(f"API URL: {API_URL}")
print(f"User ID: {USER_ID}")
print("\nPlacez un livre sur le lecteur RFID...")
print("Ctrl+C pour arrêter")

try:
    while True:
        print("\n[ATTENTE] Approchez le livre du lecteur...")
        
        # Lire le tag RFID
        tag_id, text = reader.read()
        tag_uid = format(tag_id, 'X')  # Convertir en hexadécimal
        
        print(f"[SCAN] Tag détecté: {tag_uid}")
        
        # Préparer les données
        payload = {
            "device_id": DEVICE_ID,
            "tag_uid": tag_uid,
            "user_id": USER_ID
        }
        
        print(f"[ENVOI] Données: {json.dumps(payload, indent=2)}")
        
        try:
            # Envoyer au serveur
            response = requests.post(
                API_URL, 
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            print(f"[RÉPONSE] Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                status = result.get('status', 'unknown')
                message = result.get('message', 'Aucun message')
                book = result.get('book', 'Livre inconnu')
                
                print(f"[SUCCÈS] {status.upper()}")
                print(f"         Livre: {book}")
                print(f"         Message: {message}")
                
                # Feedback visuel selon le statut
                if status == 'borrowed':
                    print("✅ EMPRUNT ENREGISTRÉ")
                elif status == 'returned':
                    print("✅ RETOUR ENREGISTRÉ")
                elif status == 'unknown_tag':
                    print("❌ TAG NON RECONNU")
                elif status == 'user_required':
                    print("⚠️  UTILISATEUR REQUIS")
                elif status == 'unavailable':
                    print("❌ LIVRE NON DISPONIBLE")
                    
            else:
                print(f"[ERREUR] Code: {response.status_code}")
                print(f"         Réponse: {response.text}")
                
        except requests.exceptions.Timeout:
            print("[ERREUR] Timeout - Serveur non accessible")
        except requests.exceptions.ConnectionError:
            print("[ERREUR] Connexion impossible au serveur")
        except Exception as e:
            print(f"[ERREUR] Exception: {str(e)}")
        
        # Attendre avant le prochain scan
        print("\n[ATTENTE] Retirez le livre et attendez 2 secondes...")
        time.sleep(2)

except KeyboardInterrupt:
    print("\n\n[ARRÊT] Programme interrompu par l'utilisateur")
    print("Au revoir!")

except Exception as e:
    print(f"\n[ERREUR FATALE] {str(e)}")