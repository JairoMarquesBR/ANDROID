export type ProjectType = 'SHELL' | 'JSON' | 'INTENT';

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  content: string;
  folder: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  lastRun?: string;
}

export interface TelemetryData {
  batteryLevel: number;
  batteryTemp: number; // In Celsius, e.g. 36.4
  batteryStatus: 'CHARGING' | 'DISCHARGING' | 'FULL' | 'UNKNOWN';
  ramTotal: number; // In GB
  ramUsed: number;  // In GB
  storageTotal: number; // In GB
  storageUsed: number;  // In GB
  cpuCores: number;
  cpuLoad: number; // Percentage
  uptime: string;  // Format HH:MM:SS
}

export interface ConsoleLine {
  id: string;
  type: 'info' | 'success' | 'error' | 'input' | 'system';
  text: string;
  timestamp: string;
}

export interface AndroidCodeFile {
  name: string;
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'markdown';
  description: string;
  content: string;
}
