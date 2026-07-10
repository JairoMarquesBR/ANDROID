#!/bin/bash
# Script de compilação automática para macOS e Linux
echo "======================================================================="
echo "         DECK-ALPHA - COMPILADOR AUTOMÁTICO DE APK (BASH)"
echo "======================================================================="
echo ""

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "\033[0;31m[ERRO] O Node.js não foi encontrado no seu sistema!\033[0m"
    echo "Baixe e instale em: https://nodejs.org/"
    exit 1
fi
echo -e "\033[0;32m[OK] Node.js detectado: $(node -v)\033[0m"

# 2. Verificar Java JDK
if ! command -v java &> /dev/null; then
    echo -e "\033[0;31m[ERRO] O Java (JDK 17+) não foi encontrado!\033[0m"
    echo "Instale o JDK 17 (por exemplo, OpenJDK) antes de continuar."
    exit 1
fi
echo -e "\033[0;32m[OK] Java detectado!\033[0m"

# 3. Instalar Dependências e compilar assets
echo "Instalando dependências e compilando front-end..."
npm install
npm run build

if [ $? -ne 0 ]; then
    echo -e "\033[0;31m[ERRO] Falha ao compilar a interface web!\033[0m"
    exit 1
fi

# 4. Sincronizar com o Capacitor
echo "Sincronizando com o Capacitor..."
npx cap sync

if [ $? -ne 0 ]; then
    echo -e "\033[0;31m[ERRO] Falha ao sincronizar arquivos no Capacitor!\033[0m"
    exit 1
fi

# 5. Compilar com Gradle Wrapper
echo "Compilando APK nativo via Gradle..."
cd android
chmod +x gradlew
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo -e "\033[0;31m[ERRO] Falha ao compilar o APK via Gradle!\033[0m"
    cd ..
    exit 1
fi
cd ..

# Mover o APK
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    cp android/app/build/outputs/apk/debug/app-debug.apk Deck_Alpha.apk
    echo ""
    echo -e "\033[0;32m======================================================================="
    echo "          PARABÉNS! APK COMPILADO COM SUCESSO!"
    echo "======================================================================="
    echo "O arquivo 'Deck_Alpha.apk' foi gerado no diretório raiz do projeto!"
    echo "=======================================================================\033[0m"
else
    echo -e "\033[0;31m[ERRO] APK compilado não foi encontrado!\033[0m"
fi
