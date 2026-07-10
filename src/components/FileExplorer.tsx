import { useState, FormEvent } from 'react';
import { ProjectItem, ProjectType } from '../types';
import { FolderPlus, FilePlus2, Save, Trash2, RotateCcw, Edit3, HelpCircle, Code } from 'lucide-react';

interface FileExplorerProps {
  projects: ProjectItem[];
  selectedProject: ProjectItem | null;
  onSaveProject: (updated: ProjectItem) => void;
  onCreateProject: (name: string, type: ProjectType, description: string, content: string) => void;
  onDeleteProject: (id: string) => void;
  onResetDefaults: () => void;
}

export default function FileExplorer({
  projects,
  selectedProject,
  onSaveProject,
  onCreateProject,
  onDeleteProject,
  onResetDefaults,
}: FileExplorerProps) {
  const [editorContent, setEditorContent] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [newProjName, setNewProjName] = useState('');
  const [newProjType, setNewProjType] = useState<ProjectType>('SHELL');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Sync editor with selected project
  if (selectedProject && selectedProject.id !== activeProjectId) {
    setEditorContent(selectedProject.content);
    setActiveProjectId(selectedProject.id);
  }

  const handleSave = () => {
    if (!selectedProject) return;
    onSaveProject({
      ...selectedProject,
      content: editorContent,
    });
  };

  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = newProjName.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (!cleanName) return;

    let defaultContent = '';
    if (newProjType === 'SHELL') {
      defaultContent = `#!/bin/bash\necho "[SYSTEM] Iniciando ${cleanName}..."\nsleep 1\necho "[+] Ação executada com sucesso!"\nexit 0`;
    } else if (newProjType === 'JSON') {
      defaultContent = `{\n  "system_id": "${cleanName}",\n  "enabled": true,\n  "relay_pins": [5, 12],\n  "broker_url": "mqtt://localhost"\n}`;
    } else {
      defaultContent = `{\n  "action": "android.intent.action.${cleanName}",\n  "flags": ["FLAG_ACTIVITY_NEW_TASK"],\n  "extras": {\n    "message": "Enviado do Cyberdeck Dashboard"\n  }\n}`;
    }

    const desc = newProjDesc.trim() || `Script customizado de automação para ${cleanName}.`;
    onCreateProject(cleanName, newProjType, desc, defaultContent);
    setNewProjName('');
    setNewProjDesc('');
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col h-full glass-aero shine-overlay overflow-hidden font-sans shadow-lg">
      {/* FileExplorer Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white/50 border-b border-white/60 select-none">
        <div className="flex items-center gap-2.5 text-xs text-sky-950 font-bold uppercase tracking-wide">
          <FolderPlus className="w-4.5 h-4.5 text-sky-500" />
          <span>Script Manager</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 glossy-blue text-xs text-white px-4 py-1.5 cursor-pointer font-extrabold rounded-full uppercase tracking-wider"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-white" />
            + MÓDULO
          </button>
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 border border-rose-300 hover:border-rose-400 text-xs text-rose-600 px-4 py-1.5 bg-white/70 hover:bg-rose-50/70 transition-all cursor-pointer font-extrabold rounded-full uppercase tracking-wider shadow-sm"
            title="Restaurar projetos originais"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            RESTAURAR
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Project File List */}
        <div className="w-full md:w-56 bg-white/20 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/50 overflow-y-auto max-h-44 md:max-h-none flex flex-col justify-between select-none">
          <div className="flex-1">
            <div className="px-5 py-3 border-b border-white/40 text-[10px] font-extrabold text-sky-950 uppercase tracking-wider font-sans bg-white/30">
              Arquivos (/Documents/CyberdeckProjects/)
            </div>
            <div className="p-2 space-y-1.5">
              {projects.map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                const extension = proj.type === 'SHELL' ? '.sh' : proj.type === 'JSON' ? 'config.json' : 'intent.json';
                return (
                  <div
                    key={proj.id}
                    className={`group w-full flex items-center justify-between text-xs px-3 py-2.5 cursor-pointer border-l-3 rounded-r-xl transition-all ${
                      isSelected
                        ? 'bg-white/70 border-sky-500 text-sky-950 font-extrabold shadow-sm shadow-sky-100'
                        : 'text-slate-600 border-transparent hover:bg-white/40 hover:text-sky-900'
                    }`}
                  >
                    <div 
                      className="flex-1 flex flex-col overflow-hidden mr-1"
                      onClick={() => setActiveProjectId(null)} // Forces trigger app-level reselect
                    >
                      <span className="truncate uppercase font-bold text-[11.5px]">{proj.name.replace(/_/g, ' ')}</span>
                      <span className="text-[9px] text-sky-700 font-mono truncate mt-0.5 font-semibold">
                        {extension}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white border border-white/40 rounded-full transition-all cursor-pointer shadow-sm bg-white/70"
                      title="Deletar Módulo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Editor or Creator View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white/10">
          {isCreating ? (
            /* Creation Form */
            <form onSubmit={handleCreateSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              <div className="text-sky-950 font-extrabold text-sm uppercase border-b border-white/40 pb-2.5 select-none flex items-center gap-2">
                <Code className="w-5 h-5 text-sky-500" />
                Criar Novo Módulo de Script
              </div>

              <div className="space-y-1.5">
                <label className="text-sky-900 uppercase text-[10px] font-extrabold block tracking-wider">Nome do Módulo</label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="EX: 06_REDE_SNIFFER"
                  className="w-full bg-white/70 border border-white/80 rounded-xl text-sky-950 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 uppercase font-mono shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sky-900 uppercase text-[10px] font-extrabold block tracking-wider">Tipo de Execução</label>
                  <select
                    value={newProjType}
                    onChange={(e) => setNewProjType(e.target.value as ProjectType)}
                    className="w-full bg-white/70 border border-white/80 rounded-xl text-sky-950 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 font-mono shadow-sm"
                  >
                    <option value="SHELL">SHELL (.sh)</option>
                    <option value="JSON">CONFIG (config.json)</option>
                    <option value="INTENT">INTENT (intent.json)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sky-900 uppercase text-[10px] font-extrabold block tracking-wider">Extensão do Script</label>
                  <div className="bg-white/40 border border-white/60 rounded-xl text-sky-850 p-3 text-xs select-none font-mono font-semibold">
                    {newProjType === 'SHELL' ? '*.sh (Shell Script)' : newProjType === 'JSON' ? 'config.json (Config)' : 'intent.json (Android Intent)'}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sky-900 uppercase text-[10px] font-extrabold block tracking-wider">Descrição Técnico</label>
                <input
                  type="text"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Explique resumidamente qual o gatilho deste botão."
                  className="w-full bg-white/70 border border-white/80 rounded-xl text-sky-950 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-inner"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 glossy-green text-xs text-white px-5 py-2 rounded-full cursor-pointer transition-all font-extrabold uppercase tracking-wide shadow-sm"
                >
                  <Save className="w-4 h-4 text-white" />
                  CONFIRMAR MÓDULO
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 px-5 py-2 text-xs font-extrabold rounded-full cursor-pointer bg-white/70 hover:bg-white transition-all shadow-sm"
                >
                  CANCELAR
                </button>
              </div>
            </form>
          ) : selectedProject ? (
            /* Script Editor Code Textarea */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-5 py-3.5 bg-white/50 border-b border-white/60 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-xs text-sky-950 font-semibold">
                  <Edit3 className="w-4.5 h-4.5 text-sky-500" />
                  <span>EDITANDO: <strong className="text-sky-800 font-mono font-bold text-xs">{selectedProject.name}/{selectedProject.type === 'SHELL' ? 'script.sh' : selectedProject.type === 'JSON' ? 'config.json' : 'intent.json'}</strong></span>
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 glossy-green text-xs text-white px-4 py-1.5 rounded-full font-extrabold cursor-pointer transition-all uppercase tracking-wider shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-white" />
                  SALVAR
                </button>
              </div>

              <div className="flex-1 relative bg-white/45 backdrop-blur-sm">
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  spellCheck="false"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="w-full h-full bg-transparent text-slate-800 p-5 text-xs leading-5 font-mono focus:outline-none resize-none overflow-y-auto select-text selection:bg-sky-100/80 font-medium caret-sky-500"
                />
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none bg-white/20 backdrop-blur-sm">
              <HelpCircle className="w-12 h-12 text-sky-500/80 mb-2 drop-shadow-sm" />
              <span className="text-xs text-sky-950 font-bold uppercase tracking-wider">Editor de Scripts Inativo</span>
              <span className="text-xs text-slate-600 mt-2 max-w-[320px] leading-relaxed">
                Selecione um arquivo de projeto no menu lateral ou clique em um botão da grade para editar seu código-fonte aqui.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
