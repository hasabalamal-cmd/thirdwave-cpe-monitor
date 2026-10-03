import {
  CpeSnapshot,
  RouterCredentials,
} from '../types/cpe';

export interface TrafficHistoryPoint {
  time: string;
  dlSpeed: number; // in Mbps or Kbps
  ulSpeed: number;
  rsrp: number;
}

class CpeService {
  private credentials: RouterCredentials = {
    host: '192.168.8.1',
    username: 'admin',
    password: '',
    autoRefreshInterval: 5,
    isDemoMode: true,
  };

  private trafficHistory: TrafficHistoryPoint[] = [];
  private baseConnectTime = 491;

  constructor() {
    // Initialize 10 history points for nice live rendering
    const now = Date.now();
    for (let i = 9; i >= 0; i--) {
      const t = new Date(now - i * 5000);
      const timeStr = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;
      this.trafficHistory.push({
        time: timeStr,
        dlSpeed: 48 + Math.floor(Math.sin(i) * 6),
        ulSpeed: 138 + Math.floor(Math.cos(i) * 8),
        rsrp: -102 + (i % 2 === 0 ? 0 : -1),
      });
    }
  }

  public getCredentials(): RouterCredentials {
    return { ...this.credentials };
  }

  public setCredentials(creds: Partial<RouterCredentials>) {
    this.credentials = { ...this.credentials, ...creds };
  }

  public getHistory(): TrafficHistoryPoint[] {
    return [...this.trafficHistory];
  }

  public async fetchSnapshot(): Promise<CpeSnapshot> {
    this.baseConnectTime += 5;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    if (this.credentials.isDemoMode) {
      // Demo Data strictly following Huawei H165-383 / Mobily 42003 sample
      // LTE PCI = 249, NR PCI = 823. Never conflate the two!
      const dlJitter = Math.floor((Math.random() - 0.5) * 4);
      const ulJitter = Math.floor((Math.random() - 0.5) * 6);
      const currentDl = Math.max(45, 52 + dlJitter);
      const currentUl = Math.max(130, 143 + ulJitter);

      // Micro RF jitter for dynamic dashboard feel without modifying static IDs
      const rsrpJitter = Math.floor((Math.random() - 0.5) * 2);
      const currentNrRsrp = -102 + rsrpJitter;

      this.trafficHistory.push({
        time: timeStr,
        dlSpeed: currentDl,
        ulSpeed: currentUl,
        rsrp: currentNrRsrp,
      });

      if (this.trafficHistory.length > 20) {
        this.trafficHistory.shift();
      }

      const rawJson = {
        device: {
          devicename: 'H165-383',
          spreadname_en: '5G CPE 6',
        },
        signal: {
          pci: '249', // LTE PCI
          cell_id: '28569138',
          rsrq: '-5.0dB',
          rsrp: '-85dBm',
          rssi: '-57dBm',
          sinr: '4dB',
          ulbandwidth: '20MHz',
          dlbandwidth: '20MHz',
          earfcn: 'DL:300 UL:18300',
          tac: '11380',
          band: '20MHz@300(B1) + 100MHz@663334(N77)',
          bandInfo: 'B1',
          plmn: '42003',
          enodeb_id: '0111598',
          nrulbandwidth: '100MHz',
          nrdlbandwidth: '100MHz',
          nrearfcn: '300',
          nrsinr: '9dB',
          nrrsrp: `${currentNrRsrp}dBm`,
          nrrsrq: '-10.0dB',
          nrbler: '0',
          nrrank: '2',
          nrcqi0: '11',
          scc_pci: '823', // NR PCI
        },
        plmn: {
          FullName: 'mobily',
          Numeric: '42003',
          Rat: '7',
        },
        sec_cell: {
          nr: [
            {
              earfcn: '660768',
              band: 'N77',
              pci: '823',
              rsrp: `${currentNrRsrp}dBm`,
              rsrq: '-10dB',
              rssi: '-79dBm',
              sinr: '9dB',
              bw: '100MHz',
            },
          ],
          lte: [],
        },
        nbr_cell: {
          nr: [],
          lte: [
            {
              earfcn: '300',
              band: 'B1',
              pci: '126',
              rsrp: '-83dBm',
              rsrq: '-12dB',
            },
            {
              earfcn: '300',
              band: 'B1',
              pci: '127',
              rsrp: '-90dBm',
              rsrq: '-19dB',
            },
          ],
        },
        traffic: {
          CurrentDownloadRate: String(currentDl),
          CurrentUploadRate: String(currentUl),
          TotalUpload: '14615870',
          TotalDownload: '3656765',
          CurrentConnectTime: String(this.baseConnectTime),
        },
        status: {
          ConnectionStatus: '901',
          SignalIcon: '5',
          CurrentWifiUser: '2',
          TotalWifiUser: '128',
          SignalIconNr: '4',
          EndcStatus: '1',
        },
      };

      return {
        device: {
          modelName: 'Huawei H165-383',
          marketingName: '5G CPE 6',
          operatorName: 'Mobily (موبايلي)',
          plmn: '42003',
          networkType: '5G NSA',
          ipAddress: this.credentials.host,
          isConnected: true,
        },
        lte: {
          pci: 249, // Distinct LTE PCI
          rsrp: -85,
          rsrq: -5,
          sinr: 4,
          band: 'B1',
          bandwidth: '20 MHz',
          earfcn: 300,
          cellId: 28569138,
          enodebId: '0111598',
          tac: 11380,
        },
        nr: {
          pci: 823, // Distinct NR PCI
          rsrp: currentNrRsrp,
          rsrq: -10,
          sinr: 9,
          band: 'N77',
          bandwidth: '100 MHz',
          arfcn: 663334,
          rank: 2,
          bler: 0,
          cqi: 11,
        },
        neighbors: [
          {
            id: 'nbr-1',
            rat: 'LTE',
            pci: 126,
            band: 'B1',
            earfcnOrArfcn: 300,
            rsrp: -83,
            rsrq: -12,
          },
          {
            id: 'nbr-2',
            rat: 'LTE',
            pci: 127,
            band: 'B1',
            earfcnOrArfcn: 300,
            rsrp: -90,
            rsrq: -19,
          },
        ],
        wifi: {
          connectedClients: 2,
          maxClients: 128,
        },
        traffic: {
          currentDlKbps: currentDl,
          currentUlKbps: currentUl,
          totalDlBytes: 3656765,
          totalUlBytes: 14615870,
          connectDurationSeconds: this.baseConnectTime,
        },
        lastUpdated: now.toLocaleTimeString(),
        rawJson,
      };
    } else {
      // Real CPE Mode - LAN direct attempt with clean error propagation
      try {
        const url = `http://${this.credentials.host}/api/monitoring/status`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/xml, text/xml, */*',
          },
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }
        // If real router answers, return parsed or fallback to structured real representation
        return await this.fetchSnapshot(); // fallback
      } catch (err: unknown) {
        // Fallback to demo snapshot with explicit disconnected status or throw
        throw new Error('Cannot connect to router. Please check IP and local Wi-Fi.');
      }
    }
  }
}

export const cpeService = new CpeService();
