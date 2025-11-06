@echo off
echo ========================================
echo CONVERSION RAPPORT TECHNIQUE
echo ========================================

echo.
echo OPTIONS DE CONVERSION:
echo ======================
echo 1. Copier le contenu pour Word
echo 2. Ouvrir avec navigateur pour PDF
echo 3. Instructions manuelles
echo.

set /p choice="Choisissez (1-3): "

if "%choice%"=="1" goto copy_word
if "%choice%"=="2" goto open_browser
if "%choice%"=="3" goto instructions
goto end

:copy_word
echo.
echo COPIE POUR WORD:
echo ===============
echo 1. Le contenu va s'ouvrir dans Notepad
echo 2. Selectionnez tout (Ctrl+A)
echo 3. Copiez (Ctrl+C)
echo 4. Ouvrez Word
echo 5. Collez (Ctrl+V)
echo 6. Word formatera automatiquement le Markdown
echo.
pause
notepad RAPPORT_TECHNIQUE_ELIBRARY.md
goto end

:open_browser
echo.
echo CONVERSION PDF VIA NAVIGATEUR:
echo =============================
echo 1. Ouverture du rapport dans le navigateur...
echo 2. Utilisez Ctrl+P pour imprimer
echo 3. Selectionnez "Enregistrer au format PDF"
echo 4. Sauvegardez: rapport-technique-elibrary.pdf
echo.
start chrome "file:///%CD%\RAPPORT_TECHNIQUE_ELIBRARY.md"
goto end

:instructions
echo.
echo INSTRUCTIONS MANUELLES:
echo =======================
echo.
echo METHODE 1 - WORD:
echo 1. Ouvrez Microsoft Word
echo 2. Fichier > Ouvrir > RAPPORT_TECHNIQUE_ELIBRARY.md
echo 3. Word convertira automatiquement
echo 4. Sauvegardez en .docx
echo.
echo METHODE 2 - PANDOC (si installe):
echo pandoc RAPPORT_TECHNIQUE_ELIBRARY.md -o rapport.docx
echo pandoc RAPPORT_TECHNIQUE_ELIBRARY.md -o rapport.pdf
echo.
echo METHODE 3 - ONLINE:
echo 1. Allez sur https://pandoc.org/try/
echo 2. Collez le contenu du fichier .md
echo 3. Convertissez en Word/PDF
echo.
goto end

:end
echo.
echo ========================================
echo CONVERSION TERMINEE !
echo ========================================
pause