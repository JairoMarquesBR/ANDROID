import { useState } from 'react';
import { Smartphone, Download, CheckCircle2, Terminal, ExternalLink, Zap, Compass, ShieldAlert, Check } from 'lucide-react';

export default function InstallGuide() {
  const [deviceType, setDeviceType] = useState<'android' | 'ios'>('android');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const termuxSetupCmd = `mkdir -p ~/Documents/CyberdeckProjects/01_TERMUX_PORT_SCAN
cat << 'EOF' > ~/Documents/CyberdeckProjects/01_TERMUX_PORT_SCAN/run.sh
#!/bin/bash
echo "[+] Iniciando Varredura do Cyberdeck..."
ping -c 3 8.8.8.8
echo "[+] Concluído com Sucesso!"
EOF
chmod +x ~/Documents/CyberdeckProjects/01_TERMUX_PORT_SCAN/run.sh`;

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white/20 backdrop-blur-md border border-white/60 rounded-3xl overflow-hidden font-sans">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/50 border-b border-white/60">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-sky-500" />
          <span className="text-sm font-extrabold text-sky-950 tracking-wide uppercase">
            Instalação Direta no Celular (Sem Android Studio)
          </span>
        </div>
        <span className="text-[10px] glossy-blue text-white px-3.5 py-1 rounded-full font-extrabold uppercase tracking-wider shadow-sm">
          Zero Compilação • PWA Ativo
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Intro */}
        <div className="bg-white/50 border border-white/60 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-sky-950 flex items-center gap-2">
              <Zap className="w-4.5 h-4.5 text-amber-500 fill-amber-300" />
              Por que compilar se você pode rodar instantaneamente?
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Você não precisa baixar o pesado Android Studio, configurar Gradle ou lidar com códigos burocráticos.
              Este painel foi projetado com tecnologia **Progressive Web App (PWA)**. Você pode adicioná-lo diretamente
              à tela inicial do seu celular, rodando em tela cheia, offline e com alta performance de hardware.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setDeviceType('android')}
              className={`px-4.5 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer shadow-sm ${
                deviceType === 'android'
                  ? 'glossy-blue text-white'
                  : 'bg-white/40 hover:bg-white text-slate-700 border border-sky-100'
              }`}
            >
              Guia Android
            </button>
            <button
              onClick={() => setDeviceType('ios')}
              className={`px-4.5 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer shadow-sm ${
                deviceType === 'ios'
                  ? 'glossy-blue text-white'
                  : 'bg-white/40 hover:bg-white text-slate-700 border border-sky-100'
              }`}
            >
              Guia iPhone (iOS)
            </button>
          </div>
        </div>

        {/* Step by Step installation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white/60 border border-white/50 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-sky-500 tracking-wider uppercase font-mono">Passo 01</span>
                <Compass className="w-4 h-4 text-sky-400" />
              </div>
              <h4 className="text-xs font-extrabold text-sky-950 uppercase">Abrir link no Celular</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Abra o navegador do seu celular (<strong>Chrome</strong> no Android ou <strong>Safari</strong> no iOS)
                e acesse o link de visualização compartilhada deste app:
              </p>
              <div className="bg-white/75 border border-sky-150 p-2.5 rounded-xl text-[10px] font-mono select-all break-all text-sky-800 font-bold shadow-inner">
                {window.location.origin}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-4 block font-medium">Navegador nativo recomendado.</span>
          </div>

          {/* Step 2 */}
          <div className="bg-white/60 border border-white/50 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-sky-500 tracking-wider uppercase font-mono">Passo 02</span>
                <Download className="w-4 h-4 text-sky-400" />
              </div>
              <h4 className="text-xs font-extrabold text-sky-950 uppercase">Adicionar à Tela de Início</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                {deviceType === 'android' ? (
                  <>
                    No Chrome, toque no botão de <strong>3 pontos</strong> no canto superior direito e selecione a opção{' '}
                    <strong className="text-sky-950">"Adicionar à tela inicial"</strong> ou{' '}
                    <strong className="text-sky-950">"Instalar aplicativo"</strong>.
                  </>
                ) : (
                  <>
                    No Safari, toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima)
                    no menu inferior e selecione <strong className="text-sky-950">"Adicionar à Tela de Início"</strong>.
                  </>
                )}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-green-700 font-extrabold bg-green-50/80 border border-green-200 px-3 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Pronto! Ganha um ícone próprio.
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/60 border border-white/50 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-sky-500 tracking-wider uppercase font-mono">Passo 03</span>
                <Zap className="w-4 h-4 text-sky-400" />
              </div>
              <h4 className="text-xs font-extrabold text-sky-950 uppercase">Executar sem Limites</h4>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Toque no ícone recém-criado na sua tela inicial. O aplicativo abrirá em **tela cheia**, ocultando as barras de navegação do browser, exatamente como um aplicativo nativo instalado pelo Google Play.
              </p>
            </div>
            <span className="text-[10px] text-slate-400 mt-4 block font-medium">Experiência 100% imersiva.</span>
          </div>
        </div>

        {/* Integration with local Termux (Hacker / Automation utility on phone) */}
        <div className="bg-white/40 border border-white/60 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/60 p-2.5 border border-sky-100 rounded-2xl shadow-inner shrink-0">
              <Terminal className="w-5 h-5 text-sky-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-sky-950 uppercase">
                Como integrar este painel com o Termux no seu celular
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Para quem quer usar este painel de automação de forma prática para disparar rotinas reais no Android (sem burocracia de compilação), a forma clássica de engenharia é utilizar o **Termux** (um emulador de terminal Linux de alta performance e gratuito para Android).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {/* Step List */}
            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-white/80 border border-sky-200 text-sky-950 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 shadow-inner">
                  1
                </span>
                <p className="leading-relaxed">
                  Baixe o <strong className="text-sky-950">Termux</strong> diretamente pelo{' '}
                  <a href="https://f-droid.org/packages/com.termux/" target="_blank" rel="noreferrer" className="text-sky-600 font-extrabold hover:underline inline-flex items-center gap-0.5">
                    F-Droid <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  ou pelo repositório oficial no GitHub (não baixe pela Play Store, pois está desatualizada).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-white/80 border border-sky-200 text-sky-950 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 shadow-inner">
                  2
                </span>
                <p className="leading-relaxed">
                  Crie a pasta de atalhos e scripts no armazenamento compartilhado com o comando ao lado. O dashboard lerá e disparará estes mesmos diretórios que você configurar!
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-white/80 border border-sky-200 text-sky-950 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 shadow-inner">
                  3
                </span>
                <p className="leading-relaxed">
                  Use o botão <strong>Script Manager</strong> na barra superior do nosso app para editar diretamente no celular seus arquivos e salvar as configurações no painel.
                </p>
              </div>
            </div>

            {/* Code Panel */}
            <div className="bg-white/65 border border-white/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 bg-white/50 border-b border-white/60 select-none">
                <span className="text-[10px] font-extrabold text-sky-950 uppercase tracking-wider font-sans">Comandos no Termux Celular</span>
                <button
                  onClick={() => handleCopyCode(termuxSetupCmd, 'termux')}
                  className="text-[10px] text-sky-600 font-extrabold hover:text-sky-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCode === 'termux' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      COPIADO!
                    </>
                  ) : (
                    'COPIAR COMANDO'
                  )}
                </button>
              </div>
              <pre className="p-4 font-mono text-[10px] text-sky-200 bg-sky-950/90 leading-relaxed overflow-x-auto select-all shadow-inner">
                <code>{termuxSetupCmd}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Permissions warning */}
        <div className="bg-green-50/70 border border-green-150 p-4.5 rounded-2xl flex items-start gap-3.5 text-xs leading-relaxed text-slate-700 shadow-sm">
          <ShieldAlert className="w-5.5 h-5.5 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sky-950 block uppercase text-[10.5px] font-extrabold tracking-wider mb-1">
              Privacidade e Segurança de Dados Local
            </strong>
            Ao rodar via PWA, o aplicativo armazena suas alterações locais de scripts e novas configurações
            diretamente no motor de armazenamento interno do navegador (LocalStorage/IndexedDB) de forma segura, garantindo
            que seus atalhos e códigos nunca subam para servidores externos ou terceiros. Privacidade e segurança completas.
          </div>
        </div>
      </div>
    </div>
  );
}
