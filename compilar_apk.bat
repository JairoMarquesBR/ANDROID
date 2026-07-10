@echo off
setlocal enabledelayedexpansion
title COMPILADOR DECK-ALPHA APK (SEM ANDROID STUDIO)
color 0b
echo =======================================================================
echo          DECK-ALPHA - COMPILADOR AUTOMATICO DE APK (WINDOWS CMD)
echo =======================================================================
echo.
echo Este script ira compilar o aplicativo Deck-Alpha em um arquivo APK nativo
echo pronto para ser instalado no seu celular, sem precisar do Android Studio!
echo.
echo REQUISITOS NECESSARIOS NO SEU COMPUTADOR:
echo 1. Node.js (instalado e no PATH)
echo 2. Java JDK 17 ou superior (e variavel JAVA_HOME configurada)
echo.
echo =======================================================================
echo.

:: 1. Verificar Node.js
echo [1/5] Verificando instalacao do Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [ERRO] O Node.js nao foi encontrado no seu sistema!
    echo Por favor, baixe e instale o Node.js em: https://nodejs.org/
    echo Depois de instalar, feche esta janela do CMD e execute o script novamente.
    echo.
    pause
    exit /b
)
echo [OK] Node.js detectado!
echo.

:: 2. Verificar Java JDK
echo [2/5] Verificando instalacao do Java (JDK)...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    :: Tenta auto-detectar em pastas padroes comuns
    if exist "C:\Program Files\Java" (
        for /d %%i in ("C:\Program Files\Java\jdk-*") do (
            set "JAVA_HOME=%%i"
            set "PATH=%%i\bin;%PATH%"
        )
    )
)

java -version >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [ERRO] O Java (JDK 17+) nao foi encontrado!
    echo O compilador Gradle necessita do Java para gerar o APK.
    echo.
    echo Como resolver facilmente:
    echo 1. Baixe o OpenJDK 17 (gratuito) em: https://adoptium.net/temurin/releases/?version=17
    echo 2. Instale e certifique-se de marcar a opcao "Set JAVA_HOME" na instalacao.
    echo 3. Reinicie o CMD e rode este arquivo de novo.
    echo.
    pause
    exit /b
)
echo [OK] Java detectado!
echo.

:: 2.5. Verificar e Auto-Configurar Android SDK
echo [2.5/5] Verificando instalacao do Android SDK...
set "SDK_FOUND="

:: 1. Verificar se ANDROID_HOME já existe e é válido
if defined ANDROID_HOME (
    if exist "%ANDROID_HOME%" (
        set "SDK_FOUND=%ANDROID_HOME%"
    )
)

:: 2. Verificar se ANDROID_SDK_ROOT já existe e é válido
if not defined SDK_FOUND (
    if defined ANDROID_SDK_ROOT (
        if exist "%ANDROID_SDK_ROOT%" (
            set "SDK_FOUND=%ANDROID_SDK_ROOT%"
        )
    )
)

:: 3. Se não encontrou, verificar caminho padrão do Android Studio no Windows AppData
if not defined SDK_FOUND (
    if exist "%LOCALAPPDATA%\Android\Sdk" (
        set "SDK_FOUND=%LOCALAPPDATA%\Android\Sdk"
        echo [INFO] Android SDK encontrado automaticamente em AppData local.
    )
)

:: 4. Verificar outros caminhos comuns
if not defined SDK_FOUND (
    if exist "C:\Android\sdk" (
        set "SDK_FOUND=C:\Android\sdk"
        echo [INFO] Android SDK encontrado automaticamente em C:\Android\sdk.
    )
)

:: 5. Se encontramos o SDK, vamos criar/atualizar o local.properties automaticamente!
if defined SDK_FOUND (
    echo [OK] Android SDK localizado em: !SDK_FOUND!
    echo Configurando arquivo android/local.properties automaticamente para evitar erros...
    
    :: Garantir que o diretório android existe
    if not exist "android" mkdir android
    
    :: No Windows, o local.properties exige barras invertidas duplas ou barras normais. Vamos converter as barras invertidas para barras normais (funciona perfeitamente no Gradle).
    set "CLEAN_SDK=!SDK_FOUND:\=/!"
    
    :: Escrever no arquivo local.properties
    echo # Criado automaticamente pelo compilador Deck-Alpha > android\local.properties
    echo sdk.dir=!CLEAN_SDK! > android\local.properties
    echo [OK] Arquivo android/local.properties configurado com sucesso!
) else (
    color 0e
    echo.
    echo [ATENCAO] O Android SDK nao foi encontrado nas pastas padroes!
    echo Para compilar o APK, voce precisa ter o Android SDK instalado no Windows.
    echo.
    echo Como resolver:
    echo 1. Se voce ja tem o Android Studio instalado, abra-o uma vez para que ele baixe o SDK na pasta padrao.
    echo 2. Se o seu SDK esta em outra pasta, crie uma variavel de ambiente chamada ANDROID_HOME apontando para ela.
    echo 3. Voce pode criar manualmente o arquivo "android\local.properties" e escrever: sdk.dir=C:/Caminho/Para/Seu/SDK
    echo.
    echo Deseja tentar rodar o compilador mesmo assim? [S/N]
    set /p "ans=Escolha: "
    if /i "%ans%" neq "S" (
        exit /b
    )
)
echo.

:: 3. Instalar dependencias e buildar Web Assets
echo [3/5] Instalando dependencias do NPM e compilando a interface web...
echo Isso pode levar alguns segundos, por favor aguarde...
call npm install
if %errorlevel% neq 0 (
    color 0c
    echo [ERRO] Falha ao rodar 'npm install'. Verifique sua conexao de rede.
    pause
    exit /b
)

call npm run build
if %errorlevel% neq 0 (
    color 0c
    echo [ERRO] Falha ao compilar a interface React/Vite.
    pause
    exit /b
)
echo [OK] Interface Web compilada com sucesso (pasta /dist gerada)!
echo.

:: 4. Sincronizar Assets para o Projeto Android
echo [4/5] Sincronizando arquivos web com o projeto nativo do Android...
call npx cap sync
if %errorlevel% neq 0 (
    color 0c
    echo [ERRO] Falha na sincronizacao do Capacitor.
    pause
    exit /b
)
echo [OK] Sincronizacao concluida!
echo.

:: 5. Compilar o APK Nativo usando o Gradle Wrapper
echo [5/5] Compilando APK Nativo usando Gradle Wrapper (sem Android Studio)...
echo Esta e a etapa mais demorada na primeira execucao (o Gradle ira baixar dependencias).
echo Por favor, mantenha a janela aberta...
echo.

cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [ERRO] Falha ao compilar o APK nativo via Gradle.
    echo DICA: Verifique se sua variavel JAVA_HOME aponta para um JDK 17 ou superior.
    cd ..
    pause
    exit /b
)
cd ..

:: Mover o APK gerado para a raiz
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "Deck_Alpha.apk" >nul
    color 0a
    echo.
    echo =======================================================================
    echo           PARABENS! APK COMPILADO COM SUCESSO!
    echo =======================================================================
    echo.
    echo O arquivo "Deck_Alpha.apk" foi gerado na pasta raiz deste projeto!
    echo.
    echo O que fazer agora:
    echo 1. Envie o arquivo "Deck_Alpha.apk" para o seu celular Android.
    echo 2. Abra o arquivo no celular e autorize a instalacao de fontes desconhecidas.
    echo 3. O painel estara instalado de forma 100% nativa e offline no seu aparelho!
    echo =======================================================================
) else (
    color 0c
    echo [ERRO] O Gradle terminou, mas o arquivo APK nao foi encontrado na pasta esperada.
)
echo.
pause
