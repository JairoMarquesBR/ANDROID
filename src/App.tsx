import { useState, useEffect } from 'react';
import { ProjectItem, ProjectType, ConsoleLine, TelemetryData } from './types';
import { defaultProjects } from './data';
import StatusBar from './components/StatusBar';
import ProjectGrid from './components/ProjectGrid';
import ConsoleMonitor from './components/ConsoleMonitor';
import InstallGuide from './components/InstallGuide';
import FileExplorer from './components/FileExplorer';
import { Terminal, Code, Cpu, Eye, FileJson, Layers, Laptop, Smartphone } from 'lucide-react';
import { triggerHaptic, showNativeToast } from './lib/native';

export default function App() {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('cyberdeck_projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(() => {
    return projects[0] || null;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'files' | 'install'>('dashboard');
  const [isScanning, setIsScanning] = useState(false);

  // Default Telemetry state
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    batteryLevel: 98,
    batteryTemp: 34.2,
    batteryStatus: 'DISCHARGING',
    ramTotal: 8.0,
    ramUsed: 4.24,
    storageTotal: 128.0,
    storageUsed: 38.6,
    cpuCores: navigator.hardwareConcurrency || 8,
    cpuLoad: 24,
    uptime: '00:00:00'
  });

  // Terminal Console Logs state
  const [logs, setLogs] = useState<ConsoleLine[]>([]);

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('cyberdeck_projects', JSON.stringify(projects));
  }, [projects]);

  // Append a formatted message to our virtual console log
  const logToConsole = (text: string, type: 'info' | 'success' | 'error' | 'input' | 'system' = 'info') => {
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    const id = Math.random().toString(36).substr(2, 9);
    setLogs((prev) => [...prev, { id, type, text, timestamp }]);
  };

  // Initial welcome screen console dumps
  useEffect(() => {
    logToConsole('SISTEMA DE TELEMETRIA EMBARCADO DECK-ALPHA', 'system');
    logToConsole('Inicializando barramento de eventos locais...', 'info');
    logToConsole('Indexando documentos em Documents/CyberdeckProjects/...', 'info');
    logToConsole(`SUCESSO: ${projects.length} atalhos de rotinas carregados em cache local.`, 'success');
  }, []);

  // Simulate scanning directories / documents
  const handleRefreshScan = () => {
    setIsScanning(true);
    logToConsole('HOST: Iniciando varredura rápida de diretórios locais...', 'info');
    
    setTimeout(() => {
      setIsScanning(false);
      logToConsole('HOST: Sincronização e indexação de scripts concluída com sucesso.', 'success');
    }, 1200);
  };

  // Run cyberdeck execution simulator (Coroutine-like async step-by-step stdout printing)
  const handleRunProject = (item: ProjectItem) => {
    if (item.status === 'running') return;

    // Trigger heavy native haptic on start & native Toast
    triggerHaptic('heavy');
    showNativeToast(`INICIANDO MÓDULO: ${item.name.replace(/_/g, ' ')}`, 'short');

    // Set item status to running
    setProjects((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: 'running' } : p))
    );

    logToConsole(`EXECUTE: Despachando módulo tático "${item.name}"...`, 'system');

    // Simulate stepping through lines of the script or keys of JSON configs
    const lines = item.content.split('\n');
    let lineIdx = 0;

    const streamInterval = setInterval(() => {
      if (lineIdx < lines.length) {
        const rawLine = lines[lineIdx];
        if (rawLine.trim()) {
          // Play a micro click feedback for each output line printed (very responsive!)
          triggerHaptic('light');

          if (rawLine.startsWith('#')) {
            logToConsole(rawLine, 'info');
          } else if (rawLine.includes('error') || rawLine.includes('fail') || rawLine.includes('FAIL') || rawLine.includes('ERROR')) {
            logToConsole(`  [OUT] ${rawLine}`, 'error');
          } else if (rawLine.includes('success') || rawLine.includes('SUCCESS') || rawLine.includes('exit 0')) {
            logToConsole(`  [OUT] ${rawLine}`, 'success');
          } else {
            logToConsole(`  [OUT] ${rawLine}`, 'info');
          }
        }
        lineIdx++;
      } else {
        clearInterval(streamInterval);
        
        // Final log of completion
        const executionSuccess = !item.content.includes('fail') && !item.content.includes('error');
        
        if (executionSuccess) {
          triggerHaptic('success');
          showNativeToast(`MÓDULO CONCLUÍDO: ${item.name.replace(/_/g, ' ')} com sucesso!`, 'short');
          logToConsole(`MÓDULO CONCLUÍDO: ${item.name} finalizado. Código de saída: EXIT 0.`, 'success');
          setProjects((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: 'success', lastRun: new Date().toISOString() } : p))
          );
        } else {
          triggerHaptic('error');
          showNativeToast(`MÓDULO FALHOU: ${item.name.replace(/_/g, ' ')} encontrou erros!`, 'short');
          logToConsole(`MÓDULO CONCLUÍDO COM ERRO: ${item.name} falhou. Código de saída: EXIT 1.`, 'error');
          setProjects((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: 'failed', lastRun: new Date().toISOString() } : p))
          );
        }
      }
    }, 450);
  };

  // Run Custom command Typed in Console Input
  const handleRunCustomCommand = (rawCommand: string) => {
    logToConsole(rawCommand, 'input');
    const parts = rawCommand.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (command) {
      case 'help':
        logToConsole('Comandos táticos disponíveis:', 'info');
        logToConsole('  help                 - Exibe a lista de ajuda.', 'info');
        logToConsole('  ls                   - Lista os módulos mapeados.', 'info');
        logToConsole('  sysinfo              - Detalha telemetria de hardware.', 'info');
        logToConsole('  clear                - Limpa a tela do monitor.', 'info');
        logToConsole('  battery              - Informa status detalhado da bateria.', 'info');
        logToConsole('  ram                  - Exibe dados de consumo de RAM.', 'info');
        logToConsole('  run <index_or_name>  - Dispara a rotina por índice ou nome.', 'info');
        break;

      case 'clear':
        setLogs([]);
        break;

      case 'ls':
        logToConsole('Diretórios mapeados em Documents/CyberdeckProjects/:', 'info');
        projects.forEach((proj, idx) => {
          logToConsole(`  [${idx + 1}] FOLDER: ${proj.name}  (${proj.type})`, 'info');
        });
        break;

      case 'sysinfo':
        logToConsole('TELEMETRIA ESTENDIDA DO DISPOSITIVO:', 'system');
        logToConsole(`  Threads de Processamento: ${telemetry.cpuCores} ativos`, 'info');
        logToConsole(`  Uso de RAM: ${telemetry.ramUsed.toFixed(2)} GB / ${telemetry.ramTotal.toFixed(1)} GB`, 'info');
        logToConsole(`  Armazenamento Livre: ${telemetry.storageUsed.toFixed(1)} GB / ${telemetry.storageTotal.toFixed(0)} GB`, 'info');
        logToConsole(`  Bateria: ${telemetry.batteryLevel}% | ${telemetry.batteryStatus} | ${telemetry.batteryTemp.toFixed(1)}°C`, 'info');
        logToConsole(`  Uptime Operacional: ${telemetry.uptime}`, 'info');
        break;

      case 'battery':
        logToConsole(`BATERIA: ${telemetry.batteryLevel}% | ${telemetry.batteryStatus} | ${telemetry.batteryTemp.toFixed(1)}°C`, 'system');
        break;

      case 'ram':
        logToConsole(`MEMÓRIA RAM: ${telemetry.ramUsed.toFixed(2)}GB / ${telemetry.ramTotal.toFixed(1)}GB em uso`, 'system');
        break;

      case 'run': {
        if (!arg) {
          logToConsole('Use: run <nome_do_modulo_ou_indice>', 'error');
          break;
        }

        const foundByName = projects.find((p) => p.name.toLowerCase() === arg.toLowerCase());
        const index = parseInt(arg, 10);
        const foundByIndex = !isNaN(index) && index > 0 && index <= projects.length ? projects[index - 1] : null;

        const targetProj = foundByName || foundByIndex;

        if (targetProj) {
          handleRunProject(targetProj);
        } else {
          logToConsole(`Módulo "${arg}" não encontrado. Digite 'ls' para listar todos.`, 'error');
        }
        break;
      }

      default:
        logToConsole(`sh: comando não reconhecido: "${command}". Digite 'help' para comandos de terminal.`, 'error');
        break;
    }
  };

  // Save edited project from FileExplorer
  const handleSaveProject = (updated: ProjectItem) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProject(updated);
    logToConsole(`SAVE: Alterações gravadas no script "${updated.name}" com sucesso.`, 'success');
  };

  // Create new custom project from FileExplorer
  const handleCreateProject = (name: string, type: ProjectType, description: string, content: string) => {
    const newProj: ProjectItem = {
      id: `custom_${Date.now()}`,
      name: name.toUpperCase(),
      description,
      type,
      folder: `Documents/CyberdeckProjects/${name.toLowerCase()}`,
      content,
      status: 'idle',
    };

    setProjects((prev) => [...prev, newProj]);
    setSelectedProject(newProj);
    logToConsole(`CREATE: Novo diretório de script inicializado: /Documents/CyberdeckProjects/${name.toLowerCase()}`, 'success');
  };

  // Delete project from FileExplorer
  const handleDeleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(projects.find((p) => p.id !== id) || null);
    }
    logToConsole(`DELETE: Diretório removido da árvore local: /Documents/CyberdeckProjects/${target.name.toLowerCase()}`, 'system');
  };

  // Reset local database of projects to defaults
  const handleResetDefaults = () => {
    if (confirm('Deseja realmente restaurar todos os scripts e diretórios padrões? Suas alterações serão perdidas.')) {
      setProjects(defaultProjects);
      setSelectedProject(defaultProjects[0]);
      localStorage.removeItem('cyberdeck_projects');
      logToConsole('RESET: Todos os arquivos originais sob a pasta de projetos foram restaurados.', 'system');
    }
  };

  return (
    <div className="min-h-screen aero-bg flex flex-col selection:bg-sky-200/85 text-slate-800 overflow-x-hidden relative font-sans">
      {/* Dynamic Aero Background Bubbles */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-gradient-to-tr from-sky-300/20 to-teal-200/25 blur-3xl pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-green-300/15 to-emerald-200/20 blur-3xl pointer-events-none animate-pulse duration-[7000ms]" />
      <div className="absolute top-[40%] right-[30%] w-80 h-80 rounded-full bg-gradient-to-bl from-cyan-200/20 to-blue-200/15 blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Top Telemetry Status Bar */}
      <StatusBar telemetry={telemetry} />

      {/* Sub-Header / Frosted Aero Title Bar */}
      <div className="w-full bg-white/45 backdrop-blur-md border-b border-white/60 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white/60 p-2.5 rounded-2xl border border-white/80 shadow-inner">
            <Laptop className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold text-sky-950 tracking-wide flex items-center gap-1.5 uppercase font-sans">
              PAINEL OPERACIONAL DECK-ALPHA
            </h1>
            <span className="text-[10px] text-sky-800/85 font-semibold">Diagnósticos & Automação Móvel</span>
          </div>
        </div>

        {/* Tab Selector buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4.5 py-2 rounded-full font-sans text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'glossy-blue text-white shadow-md shadow-sky-100/50'
                : 'text-slate-700 bg-white/50 border border-sky-100 hover:bg-white hover:text-sky-950'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Painel de Controle
          </button>
          
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4.5 py-2 rounded-full font-sans text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'files'
                ? 'glossy-blue text-white shadow-md shadow-sky-100/50'
                : 'text-slate-700 bg-white/50 border border-sky-100 hover:bg-white hover:text-sky-950'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Script Manager
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`px-4.5 py-2 rounded-full font-sans text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'install'
                ? 'glossy-blue text-white shadow-md shadow-sky-100/50'
                : 'text-slate-700 bg-white/50 border border-sky-100 hover:bg-white hover:text-sky-950'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Instalar no Celular
          </button>
        </div>
      </div>

      {/* Main Content Layout based on Selected Tab */}
      <main className="flex-1 p-4 flex flex-col overflow-hidden">
        {activeTab === 'dashboard' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
            {/* Project Grid (Left side) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col overflow-hidden">
              <ProjectGrid
                projects={projects}
                onProjectClick={handleRunProject}
                selectedId={selectedProject ? selectedProject.id : null}
                onSelectProject={(item) => setSelectedProject(item)}
                isScanning={isScanning}
                onRefreshScan={handleRefreshScan}
              />
            </div>

            {/* Console Monitor Panel (Right side) */}
            <div className="lg:col-span-5 xl:col-span-4 h-[350px] lg:h-auto flex flex-col overflow-hidden">
              <ConsoleMonitor
                logs={logs}
                onClearLogs={() => setLogs([])}
                onRunCustomCommand={handleRunCustomCommand}
                projects={projects}
              />
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="flex-1 overflow-hidden">
            <FileExplorer
              projects={projects}
              selectedProject={selectedProject}
              onSaveProject={handleSaveProject}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onResetDefaults={handleResetDefaults}
            />
          </div>
        )}

        {activeTab === 'install' && (
          <div className="flex-1 overflow-hidden">
            <InstallGuide />
          </div>
        )}
      </main>

      {/* Footer System Credits */}
      <footer className="w-full bg-white/30 backdrop-blur-md border-t border-white/40 py-4 px-4 text-center text-xs font-semibold text-sky-900 select-none z-10">
        DECK_ALPHA PORTAL • CONECTIVIDADE INSTANTÂNEA E ATUALIZAÇÕES AUTOMÁTICAS EM TEMPO REAL
      </footer>
    </div>
  );
}
