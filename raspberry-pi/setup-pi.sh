#!/bin/bash
# setup-pi.sh - Configuration Raspberry Pi pour eLibrary RFID

echo "=== Configuration Raspberry Pi pour eLibrary ==="

# Mise à jour du système
echo "1. Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
echo "2. Installation des dépendances..."
sudo apt install python3-pip git -y

# Installation des bibliothèques Python
echo "3. Installation des bibliothèques Python..."
pip3 install requests mfrc522

# Activation SPI
echo "4. Activation de l'interface SPI..."
sudo raspi-config nonint do_spi 0

# Création du service systemd
echo "5. Création du service systemd..."
sudo tee /etc/systemd/system/elibrary-rfid.service > /dev/null <<EOF
[Unit]
Description=eLibrary RFID Reader
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/elibrary
ExecStart=/usr/bin/python3 /home/pi/elibrary/reader_http.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Permissions
sudo chmod 644 /etc/systemd/system/elibrary-rfid.service
sudo systemctl daemon-reload

echo "6. Configuration terminée!"
echo ""
echo "Instructions finales:"
echo "1. Copiez reader_http.py dans /home/pi/elibrary/"
echo "2. Modifiez l'API_URL dans reader_http.py"
echo "3. Câblez le module RC522 selon le schéma"
echo "4. Démarrez le service: sudo systemctl start elibrary-rfid"
echo "5. Activez au démarrage: sudo systemctl enable elibrary-rfid"
echo ""
echo "Câblage RC522 -> Raspberry Pi:"
echo "SDA (SS)  -> GPIO 8  (Pin 24)"
echo "SCK       -> GPIO 11 (Pin 23)"
echo "MOSI      -> GPIO 10 (Pin 19)"
echo "MISO      -> GPIO 9  (Pin 21)"
echo "RST       -> GPIO 25 (Pin 22)"
echo "3.3V      -> 3.3V    (Pin 1)"
echo "GND       -> GND     (Pin 6)"