import { ProjectItem } from '../types';
import { Terminal, Settings, Send, RefreshCw, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface ProjectGridProps {
  projects: ProjectItem[];
  onProjectClick: (item: ProjectItem) => void;
  selectedId: string | null;
  onSelectProject: (item: ProjectItem) => void;
  isScanning: boolean;
  onRefreshScan: () => void;
}

export default function ProjectGrid({
  projects,
  onProjectClick,
  selectedId,
  onSelectProject,
  isScanning,
  onRefreshScan,
}: ProjectGridProps) {

  return (
    <div className="flex flex-col h-full glass-aero shine-overlay overflow-hidden font-sans shadow-lg">
      {/* Grid Controls Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white/50 border-b border-white/60 select-none">
        <div className="flex items-center gap-2.5 text-xs text-sky-950 font-bold tracking-wide uppercase">
          <Terminal className="w-4.5 h-4.5 text-sky-500" />
          <span>Módulos de Automação Mapeados</span>
          <span className="text-sky-700 font-extrabold font-sans text-[10px] bg-white/80 border border-white px-2 py-0.5 rounded-full shadow-sm">
            {projects.length} atalhos
          </span>
        </div>
        <button
          onClick={onRefreshScan}
          disabled={isScanning}
          className="px-4 py-1.5 glossy-blue text-xs text-white cursor-pointer flex items-center gap-1.5 transition-all rounded-full disabled:opacity-50 font-extrabold uppercase tracking-wider"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Sincronizando...' : 'Sincronizar'}
        </button>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed border-white/80 bg-white/30 rounded-3xl p-6 shadow-inner">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-2 drop-shadow-sm" />
            <span className="text-sm text-amber-600 uppercase font-bold tracking-wider">Nenhum Módulo Encontrado</span>
            <span className="text-xs text-slate-600 mt-2 max-w-[320px] leading-relaxed">
              Crie pastas ou arquivos de scripts sob a pasta "Documents/CyberdeckProjects/" no seu celular para popular este painel.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              const isSelected = selectedId === project.id;
              
              // Colors based on project run status
              let statusBorder = isSelected 
                ? 'border-sky-400 bg-white/70 shadow-[0_8px_20px_rgba(56,189,248,0.25)] ring-2 ring-sky-300/40' 
                : 'border-white/80 bg-white/40 hover:bg-white/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]';
              let statusText = 'text-slate-500';
              let statusIcon = <span className="w-2.5 h-2.5 rounded-full bg-slate-400 block border border-white"></span>;
              let statusLabel = 'STANDBY';

              if (project.status === 'running') {
                statusBorder = 'border-amber-400 bg-amber-50/75 shadow-[0_8px_20px_rgba(245,158,11,0.2)] ring-2 ring-amber-300/40';
                statusText = 'text-amber-600 font-extrabold';
                statusIcon = <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping block border border-white"></span>;
                statusLabel = 'EXECUTANDO';
              } else if (project.status === 'success') {
                statusBorder = 'border-emerald-400 bg-emerald-50/75 shadow-[0_8px_20px_rgba(34,197,94,0.15)]';
                statusText = 'text-emerald-600 font-extrabold';
                statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500 drop-shadow-sm" />;
                statusLabel = 'CONCLUÍDO (0)';
              } else if (project.status === 'failed') {
                statusBorder = 'border-rose-400 bg-rose-50/75 shadow-[0_8px_20px_rgba(244,63,94,0.15)]';
                statusText = 'text-rose-600 font-extrabold';
                statusIcon = <AlertTriangle className="w-4 h-4 text-rose-500 drop-shadow-sm" />;
                statusLabel = 'FALHOU (1)';
              }

              // Exec Type Decorator
              const typeIcons = {
                SHELL: <Terminal className="w-3.5 h-3.5 text-sky-500" />,
                JSON: <Settings className="w-3.5 h-3.5 text-amber-500" />,
                INTENT: <Send className="w-3.5 h-3.5 text-emerald-500" />
              };

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className={`relative group border-2 ${statusBorder} p-4 flex flex-col justify-between h-[135px] rounded-2xl transition-all duration-300 cursor-pointer select-none`}
                >
                  {/* Card Gloss Reflection Overlay */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-2xl"></div>

                  {/* Card Header */}
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex flex-col pr-2 overflow-hidden">
                      <span className="text-[13px] text-sky-950 font-extrabold tracking-tight uppercase group-hover:text-sky-600 transition-colors truncate">
                        {project.name.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-sky-850 font-mono mt-0.5 truncate bg-sky-100/50 px-1.5 py-0.2 rounded-full w-fit">
                        /{project.folder}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white/80 border border-white px-2.5 py-0.5 rounded-full text-[10px] text-sky-950 font-extrabold shrink-0 shadow-sm">
                      {typeIcons[project.type]}
                      <span>{project.type}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 my-1 leading-relaxed relative z-10">
                    {project.description}
                  </p>

                  {/* Card Footer / Statuses */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/50 text-[11px] relative z-10">
                    <div className="flex items-center gap-1.5">
                      {statusIcon}
                      <span className={`${statusText} tracking-wider font-sans text-[10px] uppercase font-bold`}>
                        {statusLabel}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProjectClick(project);
                      }}
                      disabled={project.status === 'running'}
                      className="opacity-95 group-hover:opacity-100 flex items-center gap-1.5 glossy-green text-white px-4 py-1.5 font-extrabold cursor-pointer rounded-full text-[10px] disabled:opacity-35 disabled:cursor-not-allowed transition-all uppercase tracking-wide shrink-0 shadow-sm"
                    >
                      <Play className="w-2.5 h-2.5 fill-current text-white" />
                      Disparar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
