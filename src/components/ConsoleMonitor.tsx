import { useState, useRef, useEffect, FormEvent } from 'react';
import { ConsoleLine, ProjectItem } from '../types';
import { Terminal, Trash2, ShieldAlert } from 'lucide-react';

interface ConsoleMonitorProps {
  logs: ConsoleLine[];
  onClearLogs: () => void;
  onRunCustomCommand: (command: string) => void;
  projects: ProjectItem[];
}

export default function ConsoleMonitor({
  logs,
  onClearLogs,
  onRunCustomCommand,
  projects,
}: ConsoleMonitorProps) {
  const [inputValue, setInputValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when logs change
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim();
    if (!command) return;

    onRunCustomCommand(command);
    setInputValue('');
  };

  const focusInput = () => {
    const input = document.getElementById('terminal-input-field');
    if (input) {
      input.focus();
    }
  };

  return (
    <div 
      className="flex flex-col h-full glass-aero overflow-hidden font-sans shadow-lg"
      onClick={focusInput}
    >
      {/* Console Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white/50 border-b border-white/60 select-none">
        <div className="flex items-center gap-2.5 text-xs text-sky-950 font-bold uppercase tracking-wide">
          <Terminal className="w-4.5 h-4.5 text-sky-500" />
          <span>Monitor de Execução</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 aero-pulse-green shadow-[0_0_8px_#22c55e]"></span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClearLogs();
          }}
          className="p-2 rounded-full text-sky-850 hover:text-sky-600 hover:bg-white/80 transition-all border border-white/40 cursor-pointer shadow-sm"
          title="Limpar Console"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Console Logs */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-5 text-xs leading-[18px] space-y-2.5 scrollbar bg-white/35 backdrop-blur-sm"
      >
        <div className="text-sky-800 select-none text-[10px] border-b border-sky-200/50 pb-2 mb-3 font-mono leading-relaxed font-semibold">
          DECK_DIAGNOSTICS_HOST v4.2.0 // CONEXÃO DE BARRAMENTO COM CELULAR ATIVA.
          <br />
          DIGITE 'help' PARA LISTAR OS COMANDOS DISPONÍVEIS.
        </div>

        {logs.map((log) => {
          let colorClass = 'text-slate-700';
          let prefix = '';

          switch (log.type) {
            case 'info':
              colorClass = 'text-sky-900 font-medium';
              prefix = 'ℹ ';
              break;
            case 'success':
              colorClass = 'text-emerald-700 font-extrabold';
              prefix = '✔ ';
              break;
            case 'error':
              colorClass = 'text-rose-600 font-extrabold';
              prefix = '✖ ';
              break;
            case 'input':
              colorClass = 'text-sky-600 font-bold';
              prefix = '❯ ';
              break;
            case 'system':
              colorClass = 'text-teal-700 font-bold';
              prefix = '⚙ ';
              break;
          }

          return (
            <div key={log.id} className="whitespace-pre-wrap break-all transition-all duration-150 font-mono">
              <span className="text-slate-400 mr-2.5 select-none text-[10px] font-semibold">
                {log.timestamp}
              </span>
              <span className={colorClass}>
                {prefix}
                {log.text}
              </span>
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Form */}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-5 py-3 bg-white/60 border-t border-white/60"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sky-500 font-bold text-sm select-none font-mono">❯</span>
        <input
          id="terminal-input-field"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Digite help, clear ou run..."
          className="flex-1 bg-transparent text-sky-950 focus:outline-none caret-sky-500 select-text selection:bg-sky-100 border-none text-xs leading-4 font-mono placeholder-sky-700/50"
        />
        <div className="w-1.5 h-4 bg-sky-400 animate-pulse rounded-full"></div>
      </form>
    </div>
  );
}
