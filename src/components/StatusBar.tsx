import { useEffect, useState } from 'react';
import { TelemetryData } from '../types';
import { Cpu, Battery, Database, Layers, Clock } from 'lucide-react';
import { getNativeBatteryAndHardware, isNative } from '../lib/native';

interface StatusBarProps {
  telemetry: TelemetryData;
}

export default function StatusBar({ telemetry: initialTelemetry }: StatusBarProps) {
  const [telemetry, setTelemetry] = useState<TelemetryData>(initialTelemetry);
  const [systemTime, setSystemTime] = useState<string>('');
  const [deviceModel, setDeviceModel] = useState<string>('');

  useEffect(() => {
    // 1. Clock Updates
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('pt-BR', { hour12: false }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // If running in a native Android APK
    if (isNative()) {
      getNativeBatteryAndHardware().then((stats) => {
        if (stats.model) {
          setDeviceModel(stats.model);
        }
      });

      const updateNativeStats = async () => {
        const stats = await getNativeBatteryAndHardware();
        setTelemetry((prev) => ({
          ...prev,
          batteryLevel: stats.batteryLevel,
          batteryStatus: stats.batteryStatus,
        }));
      };
      updateNativeStats();
      const nativeInterval = setInterval(updateNativeStats, 5000);

      // Storage estimate also works in Android webview
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then((estimate) => {
          const totalGB = estimate.quota ? parseFloat((estimate.quota / (1024 * 1024 * 1024)).toFixed(1)) : 128.0;
          const usedGB = estimate.usage ? parseFloat((estimate.usage / (1024 * 1024 * 1024)).toFixed(3)) : 12.4;
          setTelemetry((prev) => ({
            ...prev,
            storageTotal: totalGB > 100 ? 128.0 : totalGB,
            storageUsed: usedGB < 0.01 ? 1.2 : usedGB,
          }));
        }).catch(() => {});
      }

      return () => {
        clearInterval(clockInterval);
        clearInterval(nativeInterval);
      };
    }

    // 2. Battery API Integration (Real values if supported by browser)
    let batteryInstance: any = null;
    const updateBatteryInfo = (batt: any) => {
      setTelemetry((prev) => ({
        ...prev,
        batteryLevel: Math.round(batt.level * 100),
        batteryStatus: batt.charging ? 'CHARGING' : 'DISCHARGING',
        batteryTemp: batt.charging ? 37.8 : 34.2, // Simulated heat based on charge
      }));
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        batteryInstance = batt;
        updateBatteryInfo(batt);
        batt.addEventListener('levelchange', () => updateBatteryInfo(batt));
        batt.addEventListener('chargingchange', () => updateBatteryInfo(batt));
      }).catch(() => {});
    }

    // 3. Storage Estimate API Integration
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const totalGB = estimate.quota ? parseFloat((estimate.quota / (1024 * 1024 * 1024)).toFixed(1)) : 64.0;
        const usedGB = estimate.usage ? parseFloat((estimate.usage / (1024 * 1024 * 1024)).toFixed(3)) : 4.2;
        setTelemetry((prev) => ({
          ...prev,
          storageTotal: totalGB > 100 ? 128.0 : totalGB, // Cap high quota estimates for realistic cyberdeck look
          storageUsed: usedGB < 0.01 ? 0.450 : usedGB,
        }));
      }).catch(() => {});
    }

    // 4. Memory API Integration
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      const totalGB = parseFloat((mem.jsHeapSizeLimit / (1024 * 1024 * 1024)).toFixed(1));
      const usedGB = parseFloat((mem.usedJSHeapSize / (1024 * 1024 * 1024)).toFixed(2));
      setTelemetry((prev) => ({
        ...prev,
        ramTotal: totalGB,
        ramUsed: usedGB,
      }));
    }

    return () => {
      clearInterval(clockInterval);
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', () => updateBatteryInfo(batteryInstance));
        batteryInstance.removeEventListener('chargingchange', () => updateBatteryInfo(batteryInstance));
      }
    };
  }, []);

  // Live random CPU/RAM/BatteryTemp telemetry shifts to look authentic and modular
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setTelemetry((prev) => {
        const deltaLoad = (Math.random() - 0.5) * 12;
        const nextLoad = Math.min(Math.max(Math.round(prev.cpuLoad + deltaLoad), 5), 98);
        
        // Random slight ram flux
        const ramFlux = (Math.random() - 0.5) * 0.05;
        const nextRamUsed = Math.min(Math.max(parseFloat((prev.ramUsed + ramFlux).toFixed(2)), 0.1), prev.ramTotal - 0.1);

        // Battery temp flux
        const tempFlux = (Math.random() - 0.5) * 0.2;
        const nextTemp = Math.min(Math.max(parseFloat((prev.batteryTemp + tempFlux).toFixed(1)), 28), 45);

        // Update uptime seconds
        const [h, m, s] = prev.uptime.split(':').map(Number);
        let ns = s + 1;
        let nm = m;
        let nh = h;
        if (ns >= 60) {
          ns = 0;
          nm += 1;
        }
        if (nm >= 60) {
          nm = 0;
          nh += 1;
        }
        const nextUptime = `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}:${String(ns).padStart(2, '0')}`;

        return {
          ...prev,
          cpuLoad: nextLoad,
          ramUsed: nextRamUsed,
          batteryTemp: nextTemp,
          uptime: nextUptime
        };
      });
    }, 1000);

    return () => clearInterval(telemetryInterval);
  }, []);

  return (
    <div className="w-full bg-white/40 backdrop-blur-md border-b border-white/60 px-5 py-2.5 flex flex-wrap items-center justify-between text-xs font-sans tracking-tight text-slate-700 select-none shadow-sm">
      {/* System Identification */}
      <div className="flex items-center gap-3">
        <span className="text-sky-950 font-bold bg-white/70 px-3 py-1 rounded-full flex items-center gap-2 border border-white/80 shadow-sm shadow-cyan-200/50">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 aero-pulse-green shadow-[0_0_8px_#22c55e]"></span>
          SYS: DECK-ALPHA {deviceModel ? `• ${deviceModel.toUpperCase()}` : ''}
        </span>
        <span className="text-slate-600 flex items-center gap-1.5 font-medium">
          <Clock className="w-4 h-4 text-sky-500" />
          UPTIME: <span className="text-sky-950 font-mono font-bold">{telemetry.uptime}</span>
        </span>
        <span className="text-white/80 hidden md:inline">|</span>
        <span className="text-slate-600 hidden md:inline font-medium">
          CLOCK: <span className="text-sky-950 font-mono font-bold">{systemTime}</span> (UTC-7)
        </span>
      </div>

      {/* Resource Metrics */}
      <div className="flex items-center gap-6 mt-1.5 sm:mt-0 flex-wrap">
        {/* CPU */}
        <div className="flex items-center gap-2 border-r border-white/40 pr-4">
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span className="font-medium text-slate-600">CPU Cores: <span className="text-sky-950 font-bold font-mono">{telemetry.cpuCores}</span></span>
          <div className="w-14 bg-slate-200/50 h-2.5 rounded-full overflow-hidden relative hidden xs:block border border-white/80 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${telemetry.cpuLoad > 80 ? 'bg-rose-500' : telemetry.cpuLoad > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${telemetry.cpuLoad}%` }}
            ></div>
          </div>
          <span className="w-8 text-right text-sky-950 font-mono font-bold text-[11px]">{telemetry.cpuLoad}%</span>
        </div>

        {/* RAM */}
        <div className="flex items-center gap-2 border-r border-white/40 pr-4">
          <Layers className="w-4 h-4 text-sky-500" />
          <span className="font-medium text-slate-600">RAM: <span className="text-sky-950 font-bold font-mono">{telemetry.ramUsed.toFixed(2)}G</span><span className="text-slate-400">/{telemetry.ramTotal.toFixed(1)}G</span></span>
        </div>

        {/* Storage */}
        <div className="flex items-center gap-2 border-r border-white/40 pr-4">
          <Database className="w-4 h-4 text-teal-500" />
          <span className="font-medium text-slate-600">DISK: <span className="text-sky-950 font-bold font-mono">{telemetry.storageUsed.toFixed(1)}G</span><span className="text-slate-400">/{telemetry.storageTotal.toFixed(0)}G</span></span>
        </div>

        {/* Battery */}
        <div className="flex items-center gap-2">
          <Battery className={`w-4 h-4 ${telemetry.batteryLevel < 25 ? 'text-rose-500 animate-pulse' : 'text-sky-500'}`} />
          <span className="font-medium text-slate-600">BAT: <span className={`font-mono font-bold ${telemetry.batteryLevel < 25 ? 'text-rose-500 animate-pulse' : 'text-sky-950'}`}>{telemetry.batteryLevel}%</span></span>
          <span className="text-slate-500 font-mono text-[10px]">[{telemetry.batteryTemp.toFixed(1)}°C]</span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500 text-white font-extrabold shadow-sm uppercase tracking-wider">
            {telemetry.batteryStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
