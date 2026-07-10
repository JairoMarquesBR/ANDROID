import { ProjectItem, AndroidCodeFile } from './types';

export const defaultProjects: ProjectItem[] = [
  {
    id: 'proj_01',
    name: '01_TERMUX_PORT_SCAN',
    description: 'Runs a tactical Nmap scan on the local subnet via Termux API.',
    type: 'SHELL',
    folder: 'Documents/CyberdeckProjects/01_TERMUX_PORT_SCAN',
    status: 'idle',
    content: `#!/bin/bash
# Cyberdeck Modular Script v1.0.4
# Target: Scanning local gateway for active ports.
echo "[+] Starting network sweep on subnet: 192.168.1.0/24..."
echo "[+] Requesting Termux API bridge permissions..."

# Simulate calling Termux execution
termux-wifi-connectioninfo
sleep 1

echo "[*] Subnet active. Initiating quick stealth scan (Nmap -sS -F)..."
for i in {1..5}; do
  echo "  --> Scanning 192.168.1.$((i * 12 + 1))... [PORT 80/443 OPEN]"
  sleep 0.4
done

echo "[+] Scan Complete. Found 3 active tactical terminal hubs."
echo "[+] Logging results to /sdcard/Documents/CyberdeckProjects/01_TERMUX_PORT_SCAN/scan_results.txt"
exit 0`
  },
  {
    id: 'proj_02',
    name: '02_SDR_RADIO_TUNER',
    description: 'Tuners the RTL-SDR radio dongle to look for local RF emergency signals.',
    type: 'SHELL',
    folder: 'Documents/CyberdeckProjects/02_SDR_RADIO_TUNER',
    status: 'idle',
    content: `#!/bin/bash
# RTL-SDR FM Broadcast Receiver Init
# Frequency: 145.500 MHz (VHF Calling Channel)
echo "[INIT] Initializing USB driver connection for RTL-SDR..."
sleep 0.8
echo "[SUCCESS] Found RTL2832U device on USB bus 002."
echo "[RF] Tuning synthesizer to 145.500.000 Hz (Bandwidth: 250kHz)..."
sleep 1.2
echo "[AUDIO] Demodulation mode set to NBFM (Narrowband FM)"
echo "[SIGNAL] S-Meter Level: S5 (Sub-audible carrier detected)"
echo "[SYS] Streaming telemetry frame logs..."
echo "  [FRAME 0122] RSSI: -94dBm | SNR: 12.4dB"
echo "  [FRAME 0123] RSSI: -93dBm | SNR: 12.8dB"
echo "[+] Terminating radio loop. Standard termination code 0."
exit 0`
  },
  {
    id: 'proj_03',
    name: '03_GPIO_RELAY_GRID',
    description: 'Modular grid controller. Configures pins and relays for telemetry relay.',
    type: 'JSON',
    folder: 'Documents/CyberdeckProjects/03_GPIO_RELAY_GRID',
    status: 'idle',
    content: `{
  "system_id": "CYBERDECK-R1",
  "interface": "I2C_BUS_1",
  "address": "0x3C",
  "modules": [
    { "id": "relay_01", "name": "Tactical Radio Power", "pin": 4, "state": "ON" },
    { "id": "relay_02", "name": "Auxiliary RF Amp", "pin": 17, "state": "OFF" },
    { "id": "relay_03", "name": "Thermal Exhaust Fan", "pin": 27, "state": "AUTO", "threshold_temp": 38.5 },
    { "id": "relay_04", "name": "External GPS Antenna", "pin": 22, "state": "ON" }
  ],
  "safety_lock": false,
  "refresh_rate_ms": 500
}`
  },
  {
    id: 'proj_04',
    name: '04_INTENT_ALERT_HUD',
    description: 'Dispatches custom Android Broadcast Intents to display high-priority HUD warnings.',
    type: 'INTENT',
    folder: 'Documents/CyberdeckProjects/04_INTENT_ALERT_HUD',
    status: 'idle',
    content: `{
  "action": "com.cyberdeck.action.ALERT_HUD",
  "categories": ["android.intent.category.DEFAULT"],
  "flags": ["FLAG_ACTIVITY_NEW_TASK", "FLAG_INCLUDE_STOPPED_PACKAGES"],
  "extras": {
    "sys_sender": "CYBERDECK_V2_CORESYSTEM",
    "alert_priority": "CRITICAL",
    "alert_message": "Subsystem RF Overheating: Check cooling vents immediately.",
    "hud_color_hex": "#FFFFFF",
    "sound_ping": true
  }
}`
  },
  {
    id: 'proj_05',
    name: '05_NODE_RED_TELEMETRY',
    description: 'Synchronizes dashboard statuses with an offline Node-RED broker server.',
    type: 'JSON',
    folder: 'Documents/CyberdeckProjects/05_NODE_RED_TELEMETRY',
    status: 'idle',
    content: `{
  "broker_url": "mqtt://192.168.1.155",
  "port": 1883,
  "client_id": "deck_core_alpha",
  "topics": {
    "telemetry": "cyberdeck/nodes/telemetry",
    "alerts": "cyberdeck/nodes/alerts",
    "commands": "cyberdeck/nodes/commands"
  },
  "keep_alive_seconds": 60,
  "encryption": "none",
  "payload_format": "JSON_COMPACT"
}`
  }
];

export const androidBlueprintFiles: AndroidCodeFile[] = [
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'PASSO 1: Configuração do Gradle com suporte ao Jetpack Compose, ViewModel, Coroutines e Flows.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.cyberdeck.modular.dashboard"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.cyberdeck.modular.dashboard"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Para teste rápido
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi"
        )
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Jetpack Compose Core
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")

    // Android Lifecycle & ViewModel
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Coroutines & Assincronismo
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")

    // Tooling para Desenvolvimento
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'PASSO 1: Definição de permissões críticas de armazenamento externo para varredura de arquivos (Android 11+ compatível).',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.cyberdeck.modular.dashboard">

    <!-- Permissões de Armazenamento para varrer a pasta Documents/CyberdeckProjects -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    
    <!-- Para Android 11 (API 30) ou superior, necessário para acesso irrestrito se o usuário conceder explicitamente -->
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" 
        tools:ignore="ScopedStorage" />

    <!-- Permissões Adicionais para Execução Remota de Comandos (Opcional se integrado ao Termux) -->
    <uses-permission android:name="com.termux.permission.RUN_COMMAND" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="CyberdeckHUD"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="landscape"
            android:theme="@style/Theme.AppCompat.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  },
  {
    name: 'ProjectItem.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/model/ProjectItem.kt',
    language: 'kotlin',
    description: 'PASSO 2: Data Class representando a estrutura dos módulos lidos do cartão SD / armazenamento interno.',
    content: `package com.cyberdeck.modular.dashboard.model

/**
 * Representa um módulo modular de cyberdeck detectado no sistema de arquivos.
 */
data class ProjectItem(
    val id: String,
    val name: String,
    val description: String,
    val type: Type,
    val folderPath: String,
    val scriptContent: String,
    val status: Status = Status.IDLE,
    val lastExecutionTimestamp: Long? = null
) {
    enum class Type {
        SHELL,  // Arquivos .sh de script shell direto ou Termux
        JSON,   // Parâmetros estruturados de configuração do sistema
        INTENT  // Instruções de broadcast/início de Intent nativa do Android
    }

    enum class Status {
        IDLE,
        RUNNING,
        SUCCESS,
        FAILED
    }
}`
  },
  {
    name: 'ProjectRepository.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/repository/ProjectRepository.kt',
    language: 'kotlin',
    description: 'PASSO 2: Mecanismo de varredura assíncrona do armazenamento para montar a lista dinâmica de botões.',
    content: `package com.cyberdeck.modular.dashboard.repository

import android.os.Environment
import android.util.Log
import com.cyberdeck.modular.dashboard.model.ProjectItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.util.UUID

class ProjectRepository {

    private val TAG = "ProjectRepository"

    /**
     * Varre a pasta 'Documents/CyberdeckProjects' e cria dinamicamente
     * a lista de atalhos industriais com base nas pastas encontradas.
     */
    suspend fun scanCyberdeckProjects(): List<ProjectItem> = withContext(Dispatchers.IO) {
        val projectsList = mutableListOf<ProjectItem>()
        
        // Caminho físico: /storage/emulated/0/Documents/CyberdeckProjects
        val documentsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS)
        val cyberdeckDir = File(documentsDir, "CyberdeckProjects")

        if (!cyberdeckDir.exists()) {
            Log.w(TAG, "Diretório raiz 'Documents/CyberdeckProjects' não existe. Criando pasta...")
            cyberdeckDir.mkdirs()
            // Cria um exemplo de script inicial automático
            createSampleProject(cyberdeckDir)
        }

        val subfolders = cyberdeckDir.listFiles { file -> file.isDirectory } ?: emptyArray()

        for (folder in subfolders) {
            try {
                // Tenta achar script .sh
                val shFile = folder.listFiles { _, name -> name.endsWith(".sh") }?.firstOrNull()
                // Tenta achar config JSON
                val jsonFile = folder.listFiles { _, name -> name.equals("config.json", ignoreCase = true) }?.firstOrNull()
                // Tenta achar intent configuration
                val intentFile = folder.listFiles { _, name -> name.equals("intent.json", ignoreCase = true) }?.firstOrNull()

                val (type, targetFile) = when {
                    shFile != null -> Pair(ProjectItem.Type.SHELL, shFile)
                    intentFile != null -> Pair(ProjectItem.Type.INTENT, intentFile)
                    jsonFile != null -> Pair(ProjectItem.Type.JSON, jsonFile)
                    else -> continue // Pula se a pasta não contiver arquivos executáveis
                }

                val content = targetFile.readText(Charsets.UTF_8)
                
                // Lê a descrição de um arquivo desc.txt se existir, se não, usa o nome da pasta
                val descFile = File(folder, "description.txt")
                val description = if (descFile.exists()) descFile.readText().trim() else "Módulo tático: \${folder.name}"

                projectsList.add(
                    ProjectItem(
                        id = UUID.nameUUIDFromBytes(folder.absolutePath.toByteArray()).toString(),
                        name = folder.name.uppercase(),
                        description = description,
                        type = type,
                        folderPath = folder.absolutePath,
                        scriptContent = content
                    )
                )
            } catch (e: Exception) {
                Log.e(TAG, "Erro ao analisar pasta \${folder.name}: \${e.message}")
            }
        }

        return@withContext projectsList
    }

    private fun createSampleProject(rootDir: File) {
        val sampleDir = File(rootDir, "01_SAMPLE_PING")
        sampleDir.mkdirs()
        val script = File(sampleDir, "ping_sweep.sh")
        script.writeText("""
            #!/bin/bash
            echo "[SYSTEM] Starting modular sweep..."
            ping -c 3 8.8.8.8
            echo "[SUCCESS] Connection alive."
        """.trimIndent())
        
        val desc = File(sampleDir, "description.txt")
        desc.writeText("Mapeia a conectividade ICMP básica com servidores dns centrais.")
    }
}`
  },
  {
    name: 'TelemetryProvider.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/telemetry/TelemetryProvider.kt',
    language: 'kotlin',
    description: 'PASSO 3: Emissão de fluxos reativos em tempo real para bateria, uso de memória RAM e armazenamento do celular.',
    content: `package com.cyberdeck.modular.dashboard.telemetry

import android.app.ActivityManager
import android.content.Context
import android.content.Context.ACTIVITY_SERVICE
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.Environment
import android.os.StatFs
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.io.File

data class TelemetryState(
    val batteryPercent: Int = 100,
    val batteryTemp: Float = 0f,
    val batteryStatus: String = "IDLE",
    val availableRamGB: Double = 0.0,
    val totalRamGB: Double = 0.0,
    val freeStorageGB: Double = 0.0,
    val totalStorageGB: Double = 0.0,
    val uptimeString: String = "00:00:00"
)

class TelemetryProvider(private val context: Context) {

    /**
     * Emite atualizações de telemetria de hardware a cada 1.5 segundos
     */
    fun getTelemetryFlow(): Flow<TelemetryState> = flow {
        val activityManager = context.getSystemService(ACTIVITY_SERVICE) as ActivityManager
        val memoryInfo = ActivityManager.MemoryInfo()
        val systemStartTime = android.os.SystemClock.elapsedRealtime()

        while (true) {
            // 1. Dados de Bateria
            val batteryStatusIntent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
            val level = batteryStatusIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = batteryStatusIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            val batteryPct = if (level >= 0 && scale > 0) (level * 100 / scale) else 0

            val rawTemp = batteryStatusIntent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) ?: 0
            val batteryTempCelsius = rawTemp / 10f // Temperatura vem multiplicada por 10

            val statusVal = batteryStatusIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
            val statusString = when (statusVal) {
                BatteryManager.BATTERY_STATUS_CHARGING -> "CHARGING"
                BatteryManager.BATTERY_STATUS_DISCHARGING -> "DISCHARGING"
                BatteryManager.BATTERY_STATUS_FULL -> "FULL"
                else -> "NOMINAL"
            }

            // 2. RAM disponível
            activityManager.getMemoryInfo(memoryInfo)
            val availableRam = memoryInfo.availMem.toDouble() / (1024 * 1024 * 1024)
            val totalRam = memoryInfo.totalMem.toDouble() / (1024 * 1024 * 1024)

            // 3. Armazenamento Interno Livre
            val path: File = Environment.getDataDirectory()
            val stat = StatFs(path.path)
            val blockSize = stat.blockSizeLong
            val availableBlocks = stat.availableBlocksLong
            val totalBlocks = stat.blockCountLong
            val freeStorage = (availableBlocks * blockSize).toDouble() / (1024 * 1024 * 1024)
            val totalStorage = (totalBlocks * blockSize).toDouble() / (1024 * 1024 * 1024)

            // 4. Uptime do Aparelho
            val elapsedMs = android.os.SystemClock.elapsedRealtime()
            val seconds = (elapsedMs / 1000) % 60
            val minutes = (elapsedMs / (1000 * 60)) % 60
            val hours = (elapsedMs / (1000 * 60 * 60))
            val uptimeStr = String.format("%02d:%02d:%02d", hours, minutes, seconds)

            emit(
                TelemetryState(
                    batteryPercent = batteryPct,
                    batteryTemp = batteryTempCelsius,
                    batteryStatus = statusString,
                    availableRamGB = Math.round(availableRam * 10) / 10.0,
                    totalRamGB = Math.round(totalRam * 10) / 10.0,
                    freeStorageGB = Math.round(freeStorage * 10) / 10.0,
                    totalStorageGB = Math.round(totalStorage * 10) / 10.0,
                    uptimeString = uptimeStr
                )
            )

            delay(1500) // Telemetria de alta fidelidade
        }
    }
}`
  },
  {
    name: 'CyberdeckViewModel.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/viewmodel/CyberdeckViewModel.kt',
    language: 'kotlin',
    description: 'PASSO 4: Gerenciamento dos estados, execução de scripts via Runtime, emissão de intents assíncronas e atualização visual sem travar a thread de interface.',
    content: `package com.cyberdeck.modular.dashboard.viewmodel

import android.app.Application
import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.cyberdeck.modular.dashboard.model.ProjectItem
import com.cyberdeck.modular.dashboard.repository.ProjectRepository
import com.cyberdeck.modular.dashboard.telemetry.TelemetryProvider
import com.cyberdeck.modular.dashboard.telemetry.TelemetryState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader

class CyberdeckViewModel(application: Application) : AndroidViewModel(application) {

    private val TAG = "CyberdeckViewModel"
    private val repository = ProjectRepository()
    private val telemetryProvider = TelemetryProvider(application.applicationContext)

    // Estados observáveis da interface
    private val _projects = MutableStateFlow<List<ProjectItem>>(emptyList())
    val projects: StateFlow<List<ProjectItem>> = _projects.asStateFlow()

    private val _telemetry = MutableStateFlow(TelemetryState())
    val telemetry: StateFlow<TelemetryState> = _telemetry.asStateFlow()

    private val _terminalLogs = MutableSharedFlow<String>()
    val terminalLogs: SharedFlow<String> = _terminalLogs.asSharedFlow()

    private val _isScanning = MutableStateFlow(false)
    val isScanning: StateFlow<Boolean> = _isScanning.asStateFlow()

    init {
        loadProjects()
        startTelemetryMonitoring()
    }

    fun loadProjects() {
        viewModelScope.launch {
            _isScanning.value = true
            logToTerminal("INIT: Varrendo diretório de projetos modular...")
            try {
                val list = repository.scanCyberdeckProjects()
                _projects.value = list
                logToTerminal("SUCCESS: Varredura finalizada. \${list.size} módulos táticos mapeados.")
            } catch (e: Exception) {
                logToTerminal("ERROR: Falha ao varrer armazenamento: \${e.message}")
            } finally {
                _isScanning.value = false
            }
        }
    }

    private fun startTelemetryMonitoring() {
        viewModelScope.launch {
            telemetryProvider.getTelemetryFlow().collect { status ->
                _telemetry.value = status
            }
        }
    }

    /**
     * Executa dinamicamente o módulo selecionado sem travar a UI (Coroutine de IO)
     */
    fun executeProject(item: ProjectItem) {
        viewModelScope.launch(Dispatchers.IO) {
            // Atualiza status do projeto na lista
            updateProjectStatus(item.id, ProjectItem.Status.RUNNING)
            logToTerminal("LAUNCHING MÓDULO: \${item.name} [\${item.type.name}]")

            try {
                when (item.type) {
                    ProjectItem.Type.SHELL -> {
                        executeShellScript(item)
                    }
                    ProjectItem.Type.INTENT -> {
                        triggerAndroidIntent(item)
                    }
                    ProjectItem.Type.JSON -> {
                        executeJsonAction(item)
                    }
                }
                updateProjectStatus(item.id, ProjectItem.Status.SUCCESS)
            } catch (e: Exception) {
                logToTerminal("FATAL CRASH NO MÓDULO: \${e.message}")
                updateProjectStatus(item.id, ProjectItem.Status.FAILED)
            }
        }
    }

    private fun executeShellScript(item: ProjectItem) {
        logToTerminal("EXEC: Abrindo subprocesso para executar comandos locais...")
        try {
            // Nota: No Android padrão, permissões de gravação/execução em subpastas são limitadas.
            // Para execução em ambiente de hacking real, geralmente envia-se a chamada de script 
            // diretamente para a API do Termux se instalado, ou roda o binário "sh" diretamente.
            val process = Runtime.getRuntime().exec(arrayOf("sh", "-c", item.scriptContent))
            val reader = BufferedReader(InputStreamReader(process.inputStream))
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                logToTerminal("  [SH_OUT] \${line}")
            }
            val exitCode = process.waitFor()
            logToTerminal("EXEC_STATUS: Concluído. Código de saída (Exit Code): \${exitCode}")
            if (exitCode != 0) {
                throw Exception("Processo retornou status de falha: \${exitCode}")
            }
        } catch (e: Exception) {
            logToTerminal("EXEC_FAIL: Falha no Runtime.exec local: \${e.message}")
            logToTerminal("HINT: Para rodar scripts complexos no Android nativo, configure o Termux API.")
            throw e
        }
    }

    private fun triggerAndroidIntent(item: ProjectItem) {
        logToTerminal("INTENT_DISPATCH: Analisando estrutura de transmissão JSON...")
        try {
            val json = JSONObject(item.scriptContent)
            val action = json.optString("action", Intent.ACTION_VIEW)
            val intent = Intent(action)

            // Trata Extras no JSON
            val extras = json.optJSONObject("extras")
            extras?.keys()?.forEach { key ->
                val value = extras.get(key)
                when (value) {
                    is String -> intent.putExtra(key, value)
                    is Int -> intent.putExtra(key, value)
                    is Boolean -> intent.putExtra(key, value)
                }
            }

            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            
            // Dispara via context da Aplicação
            getApplication<Application>().startActivity(intent)
            logToTerminal("INTENT_SUCCESS: Intent nativa [\${action}] disparada com sucesso.")
        } catch (e: Exception) {
            logToTerminal("INTENT_FAIL: Falha ao compor ou enviar Intent: \${e.message}")
            throw e
        }
    }

    private fun executeJsonAction(item: ProjectItem) {
        logToTerminal("JSON_EXEC: Módulo estático de automação detectado.")
        try {
            val json = JSONObject(item.scriptContent)
            val targetId = json.optString("system_id", "NOT_SPECIFIED")
            logToTerminal("  --> ID do Sistema Alvo: \${targetId}")
            logToTerminal("  --> Parsing de variáveis concluído. Sincronizando GPIO/MQTT localmente...")
            // Simula um delay de comunicação com o broker / dispositivo
            Thread.sleep(1000)
            logToTerminal("JSON_SUCCESS: Telemetria integrada ao Barramento.")
        } catch (e: Exception) {
            logToTerminal("JSON_FAIL: Erro de Parser do arquivo de configuração: \${e.message}")
            throw e
        }
    }

    private fun updateProjectStatus(id: String, status: ProjectItem.Status) {
        _projects.value = _projects.value.map {
            if (it.id == id) {
                it.copy(status = status, lastExecutionTimestamp = System.currentTimeMillis())
            } else {
                it
            }
        }
    }

    private fun logToTerminal(text: String) {
        viewModelScope.launch {
            _terminalLogs.emit(text)
            Log.d(TAG, "TERM: \${text}")
        }
    }
}`
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/ui/theme/Theme.kt',
    language: 'kotlin',
    description: 'PASSO 5: Configuração de estilo minimalista monocromático com tipografia monospace estrita.',
    content: `package com.cyberdeck.modular.dashboard.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Paleta industrial militar monocromática de altíssimo contraste
val DarkGray = Color(0xFF0F0F0F)
val SteelGray = Color(0xFF1F1F1F)
val MediumGray = Color(0xFF3E3E3E)
val LightGray = Color(0xFFCCCCCC)
val CyberWhite = Color(0xFFFFFFFF)
val LaserRed = Color(0xFFFF3B30)

private val CyberColorScheme = darkColorScheme(
    primary = CyberWhite,
    secondary = LightGray,
    background = DarkGray,
    surface = SteelGray,
    onPrimary = DarkGray,
    onSecondary = DarkGray,
    onBackground = CyberWhite,
    onSurface = CyberWhite,
    error = LaserRed
)

val MonospaceTypography = androidx.compose.material3.Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Bold,
        fontSize = 30.sp,
        color = CyberWhite
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        color = CyberWhite
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        color = LightGray
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        color = CyberWhite
    )
)

@Composable
fun CyberdeckTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = CyberColorScheme,
        typography = MonospaceTypography,
        content = content
    )
}`
  },
  {
    name: 'StatusBar.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/ui/components/StatusBar.kt',
    language: 'kotlin',
    description: 'PASSO 5: Composable que exibe telemetria de hardware militar de alta precisão na parte superior.',
    content: `package com.cyberdeck.modular.dashboard.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberdeck.modular.dashboard.telemetry.TelemetryState
import com.cyberdeck.modular.dashboard.ui.theme.SteelGray

@Composable
fun StatusBar(
    telemetry: TelemetryState,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(SteelGray)
            .border(1.dp, MaterialTheme.colorScheme.primary)
            .padding(horizontal = 12.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // ID do Sistema e Uptime
        Text(
            text = "DECK_ID: ALPHA_CORE | UPT: \${telemetry.uptimeString}",
            color = MaterialTheme.colorScheme.primary,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
            fontSize = 11.sp,
            fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
        )

        // Recursos de Memória e Armazenamento
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "RAM: \${telemetry.availableRamGB}G/\${telemetry.totalRamGB}G",
                color = MaterialTheme.colorScheme.primary,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                fontSize = 11.sp
            )
            Text(
                text = "DISK: \${telemetry.freeStorageGB}G/\${telemetry.totalStorageGB}G",
                color = MaterialTheme.colorScheme.primary,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                fontSize = 11.sp
            )
        }

        // Bateria e Temperatura
        Text(
            text = "BAT: \${telemetry.batteryPercent}% [\${telemetry.batteryTemp}°C] STATUS: \${telemetry.batteryStatus}",
            color = if (telemetry.batteryPercent < 20) Color.Red else MaterialTheme.colorScheme.primary,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
            fontSize = 11.sp,
            fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
        )
    }
}`
  },
  {
    name: 'ProjectGrid.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/ui/components/ProjectGrid.kt',
    language: 'kotlin',
    description: 'PASSO 5: Bento Grid industrial desenhando botões robustos sem arredondamento com indicação de status reativo.',
    content: `package com.cyberdeck.modular.dashboard.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberdeck.modular.dashboard.model.ProjectItem
import com.cyberdeck.modular.dashboard.ui.theme.DarkGray
import com.cyberdeck.modular.dashboard.ui.theme.MediumGray
import com.cyberdeck.modular.dashboard.ui.theme.SteelGray

@Composable
fun ProjectGrid(
    projects: List<ProjectItem>,
    onProjectClick: (ProjectItem) -> Unit,
    modifier: Modifier = Modifier
) {
    if (projects.isEmpty()) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "[!] NENHUM MÓDULO ENCONTRADO EM Documents/CyberdeckProjects",
                color = Color.Yellow,
                fontSize = 12.sp,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )
        }
    } else {
        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 220.dp),
            contentPadding = PaddingValues(12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            modifier = modifier.fillMaxSize()
        ) {
            items(projects) { item ->
                ProjectButton(item = item, onClick = { onProjectClick(item) })
            }
        }
    }
}

@Composable
fun ProjectButton(
    item: ProjectItem,
    onClick: () -> Unit
) {
    val borderColor = when (item.status) {
        ProjectItem.Status.RUNNING -> Color.Yellow
        ProjectItem.Status.SUCCESS -> Color.Green
        ProjectItem.Status.FAILED -> Color.Red
        ProjectItem.Status.IDLE -> MaterialTheme.colorScheme.primary
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .height(110.dp)
            .background(SteelGray)
            .border(2.dp, borderColor) // Sem arredondamento de bordas (ângulo reto estrito)
            .clickable(onClick = onClick)
            .padding(10.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Text(
                text = item.name,
                fontSize = 13.sp,
                color = Color.White,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                maxLines = 1
            )
            
            // Tipo de Script
            Text(
                text = "[\${item.type.name}]",
                fontSize = 10.sp,
                color = borderColor,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )
        }

        Text(
            text = item.description,
            fontSize = 10.sp,
            color = Color.LightGray,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
            maxLines = 2,
            lineHeight = 12.sp
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom
        ) {
            Text(
                text = "PATH: Documents/.../\${item.name.lowercase()}",
                fontSize = 8.sp,
                color = MediumGray,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )

            // Indicador tático de estado
            val stateText = when (item.status) {
                ProjectItem.Status.RUNNING -> "● BUSY"
                ProjectItem.Status.SUCCESS -> "✔ READY"
                ProjectItem.Status.FAILED -> "✖ FAIL"
                ProjectItem.Status.IDLE -> "○ STANDBY"
            }
            Text(
                text = stateText,
                fontSize = 9.sp,
                color = borderColor,
                fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )
        }
    }
} `
  },
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/cyberdeck/modular/dashboard/MainActivity.kt',
    language: 'kotlin',
    description: 'PASSO 5: Atividade principal imersiva, controlando permissões críticas e escondendo botões e barras padrão do sistema Android.',
    content: `package com.cyberdeck.modular.dashboard

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.Settings
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.cyberdeck.modular.dashboard.ui.components.ProjectGrid
import com.cyberdeck.modular.dashboard.ui.components.StatusBar
import com.cyberdeck.modular.dashboard.ui.theme.CyberdeckTheme
import com.cyberdeck.modular.dashboard.ui.theme.DarkGray
import com.cyberdeck.modular.dashboard.ui.theme.SteelGray
import com.cyberdeck.modular.dashboard.viewmodel.CyberdeckViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: CyberdeckViewModel by viewModels()
    private val STORAGE_PERMISSION_CODE = 200

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Ativa tela imersiva sem barras padrão do sistema (full screen tático)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

        checkAndRequestStoragePermissions()

        setContent {
            CyberdeckTheme {
                val projects by viewModel.projects.collectAsState()
                val telemetry by viewModel.telemetry.collectAsState()
                val isScanning by viewModel.isScanning.collectAsState()

                // Armazena e exibe logs em tempo real
                val terminalLines = remember { mutableStateListOf<String>() }
                val listState = rememberLazyListState()

                LaunchedEffect(Unit) {
                    viewModel.terminalLogs.collect { log ->
                        terminalLines.add("[\${System.currentTimeMillis() % 100000}] \${log}")
                    }
                }

                // Autoscroll para o final do terminal
                LaunchedEffect(terminalLines.size) {
                    if (terminalLines.isNotEmpty()) {
                        listState.animateScrollToItem(terminalLines.size - 1)
                    }
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Column(modifier = Modifier.fillMaxSize()) {
                        // 1. Barra de Status com Telemetria de Hardware
                        StatusBar(telemetry = telemetry)

                        Row(modifier = Modifier.weight(1f)) {
                            // 2. Grid de Botões Industriais (Modos de execução)
                            ProjectGrid(
                                projects = projects,
                                onProjectClick = { viewModel.executeProject(it) },
                                modifier = Modifier
                                    .weight(1.8f)
                                    .fillMaxHeight()
                            )

                            // Divisor vertical
                            Spacer(
                                modifier = Modifier
                                    .width(1.dp)
                                    .fillMaxHeight()
                                    .background(MaterialTheme.colorScheme.primary)
                            )

                            // 3. Monitor Console do Cyberdeck (Direita)
                            Column(
                                modifier = Modifier
                                    .weight(1.2f)
                                    .fillMaxHeight()
                                    .background(DarkGray)
                                    .padding(8.dp)
                            ) {
                                Text(
                                    text = ">> CONSOLE MONITOR CORE",
                                    color = MaterialTheme.colorScheme.primary,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    fontSize = 11.sp,
                                    fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                                    modifier = Modifier.padding(bottom = 6.dp)
                                )

                                LazyColumn(
                                    state = listState,
                                    modifier = Modifier
                                        .weight(1f)
                                        .fillMaxWidth()
                                        .border(1.dp, SteelGray)
                                        .background(Color.Black)
                                        .padding(6.dp)
                                ) {
                                    items(terminalLines) { line ->
                                        Text(
                                            text = line,
                                            color = if (line.contains("ERROR") || line.contains("FAIL")) Color.Red 
                                                    else if (line.contains("SUCCESS")) Color.Green 
                                                    else Color.White,
                                            fontSize = 9.sp,
                                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                            lineHeight = 11.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private fun checkAndRequestStoragePermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // Android 11+ exige permissão MANAGE_EXTERNAL_STORAGE para varrer pastas globais
            if (!Environment.isExternalStorageManager()) {
                try {
                    val intent = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION)
                    intent.addCategory("android.intent.category.DEFAULT")
                    intent.data = Uri.parse(String.format("package:%s", applicationContext.packageName))
                    startActivity(intent)
                } catch (e: Exception) {
                    val intent = Intent()
                    intent.action = Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION
                    startActivity(intent)
                }
            }
        } else {
            // Android 10- exige leitura e gravação padrão
            if (checkSelfPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(
                    arrayOf(android.Manifest.permission.READ_EXTERNAL_STORAGE),
                    STORAGE_PERMISSION_CODE
                )
            }
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == STORAGE_PERMISSION_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Permissão Concedida. Varrendo diretórios...", Toast.LENGTH_SHORT).show()
                viewModel.loadProjects()
            } else {
                Toast.makeText(this, "Permissão negada. O Cyberdeck não conseguirá ler scripts.", Toast.LENGTH_LONG).show()
            }
        }
    }
}`
  },
  {
    name: 'PASSO 6: README.md',
    path: 'app/README.md',
    language: 'markdown',
    description: 'PASSO 6: Manual de instalação, configuração física das pastas e execução tática no Android via Termux.',
    content: `# Cyberdeck Modular Dashboard - Guia de Implantação Física

Este manual detalha o provisionamento e estruturação física do aplicativo de Cyberdeck tático em aparelhos Android reais.

---

## 1. Estrutura de Pastas Exigida

O aplicativo realiza a varredura automática em busca de subpastas executáveis no armazenamento interno global. Você deve criar a pasta no seguinte caminho:

\`\`\`
/Armazenamento Interno/Documents/CyberdeckProjects/
\`\`\`

Dentro dela, organize cada ferramenta ou automação em sua respectiva subpasta. O aplicativo identifica o tipo de botão pelo arquivo executável existente:

1. **Scripts de Terminal Shell (\`.sh\`)**
   - Pasta: \`01_wifi_nmap\`
   - Conteúdo: \`scan.sh\` (Script Shell com os comandos do Termux/Linux)
   - Conteúdo (opcional): \`description.txt\` (Breve descrição técnica)

2. **Configuração Estática / IoT (\`config.json\`)**
   - Pasta: \`02_mqtt_relays\`
   - Conteúdo: \`config.json\` (Configurações estruturadas JSON)

3. **Disparo de Intent Nativa (\`intent.json\`)**
   - Pasta: \`03_intent_camera\`
   - Conteúdo: \`intent.json\` (Dados da Action, Extras e Flags)

---

## 2. Tratamento de Segurança no Android (Scoped Storage)

Desde o Android 11 (API 30), o sistema introduziu o **Scoped Storage**, que restringe o acesso de leitura global a diretórios externos. Para contornar e permitir que este app militarizado leia e execute arquivos em lote na pasta \`Documents\`:

1. Foi declarada no Manifest a permissão especial \`MANAGE_EXTERNAL_STORAGE\`.
2. Na inicialização do \`MainActivity.kt\`, o aplicativo checa se a permissão de arquivos globais está ativa. Se não estiver, redireciona o usuário para a tela especial de Configurações do Android: **"Acesso especial ao aplicativo -> Acesso a todos os arquivos"**.
3. Uma vez concedida, o app possui liberdade total para varrer e ler scripts.

---

## 3. Integração Profissional com Termux

Para rodar scripts do Linux nativamente no celular utilizando as APIs do Termux:

1. Instale o **Termux** e o **Termux:API** na mesma partição do aparelho.
2. No Termux, rode o comando para liberar a execução de comandos remotos:
   \`\`\`bash
   apt update && apt install termux-api
   \`\`\`
3. Garanta que a permissão \`com.termux.permission.RUN_COMMAND\` esteja no Manifest do Cyberdeck Dashboard para que as Coroutines enviem Intents de execução rápida diretamente para o terminal secundário sem conflitos.
`
  }
];
