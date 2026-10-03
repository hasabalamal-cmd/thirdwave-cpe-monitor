export type AppTab = 'home' | 'signal' | 'cells' | 'speed' | 'settings';

export type SignalQualityLevel = 'excellent' | 'good' | 'fair' | 'poor';

export interface LteSignalInfo {
  pci: number; // e.g. 249
  rsrp: number; // e.g. -85 dBm
  rsrq: number; // e.g. -5 dB
  sinr: number; // e.g. 4 dB
  band: string; // e.g. 'B1'
  bandwidth: string; // e.g. '20 MHz'
  earfcn: number; // e.g. 300
  cellId: number; // e.g. 28569138
  enodebId: string; // e.g. '0111598'
  tac: number; // e.g. 11380
}

export interface NrSignalInfo {
  pci: number; // e.g. 823 (Strictly separated from LTE PCI 249!)
  rsrp: number; // e.g. -102 dBm
  rsrq: number; // e.g. -10 dB
  sinr: number; // e.g. 9 dB
  band: string; // e.g. 'N77'
  bandwidth: string; // e.g. '100 MHz'
  arfcn: number; // e.g. 663334
  rank: number; // e.g. 2
  bler: number; // e.g. 0
  cqi: number; // e.g. 11
}

export interface NeighborCellItem {
  id: string;
  rat: 'LTE' | 'NR';
  pci: number;
  band: string;
  earfcnOrArfcn: number;
  rsrp: number;
  rsrq: number;
}

export interface WifiInfo {
  connectedClients: number; // e.g. 2
  maxClients: number; // e.g. 128
}

export interface TrafficInfo {
  currentDlKbps: number; // e.g. 52
  currentUlKbps: number; // e.g. 143
  totalDlBytes: number; // e.g. 3656765
  totalUlBytes: number; // e.g. 14615870
  connectDurationSeconds: number; // e.g. 491
}

export interface DeviceInfo {
  modelName: string; // e.g. 'Huawei H165-383'
  marketingName: string; // e.g. '5G CPE 6'
  operatorName: string; // e.g. 'Mobily'
  plmn: string; // e.g. '42003'
  networkType: string; // e.g. '5G NSA'
  ipAddress: string; // e.g. '192.168.8.1'
  isConnected: boolean;
}

export interface CpeSnapshot {
  device: DeviceInfo;
  lte: LteSignalInfo;
  nr: NrSignalInfo;
  neighbors: NeighborCellItem[];
  wifi: WifiInfo;
  traffic: TrafficInfo;
  lastUpdated: string;
  rawJson: Record<string, unknown>;
}

export interface RouterCredentials {
  host: string;
  username: string;
  password?: string;
  autoRefreshInterval: number; // 0 for off, 5, 10, 30
  isDemoMode: boolean;
}
