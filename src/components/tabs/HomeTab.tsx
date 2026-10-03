import React from 'react';
import { CpeSnapshot } from '../../types/cpe';
import { Translations } from '../../l10n/translations';
import { MiniSignalGauge } from '../MiniSignalGauge';
import { SignalGauge } from '../SignalGauge';
import { evaluateRsrp } from '../../utils/cellMath';
import {
  Radio,
  Wifi,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
  Zap,
  Gauge,
} from 'lucide-react';

interface HomeTabProps {
  snapshot: CpeSnapshot;
  t: Translations;
  isArabic: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({ snapshot, t, isArabic }) => {
  const lteEval = evaluateRsrp(snapshot.lte.rsrp);
  const nrEval = evaluateRsrp(snapshot.nr.rsrp);

  return (
    <div className="space-y-6">
      {/* 1. Dual Mini Circular Gauges (4G LTE & 5G NR) side-by-side */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t.dualGaugeSectionTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mini Gauge for 4G LTE */}
          <MiniSignalGauge
            title="4G LTE (Anchor Carrier)"
            technology="4G LTE"
            rsrp={snapshot.lte.rsrp}
            pci={snapshot.lte.pci}
            pciLabel={t.ltePciLabel}
            band={snapshot.lte.band}
            bandwidth={snapshot.lte.bandwidth}
            sinr={snapshot.lte.sinr}
            rsrq={snapshot.lte.rsrq}
            isArabic={isArabic}
          />

          {/* Mini Gauge for 5G NR */}
          <MiniSignalGauge
            title="5G NR (Primary Data Carrier)"
            technology="5G NR"
            rsrp={snapshot.nr.rsrp}
            pci={snapshot.nr.pci}
            pciLabel={t.nrPciLabel}
            band={snapshot.nr.band}
            bandwidth={snapshot.nr.bandwidth}
            sinr={snapshot.nr.sinr}
            rsrq={snapshot.nr.rsrq}
            isArabic={isArabic}
          />
        </div>
      </div>

      {/* 2. Network Overview Section */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <Layers className="w-5 h-5 text-blue-500" />
          <h2 className="font-bold text-white text-base">
            {t.networkOverviewTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800/80">
            <span className="text-slate-500 block mb-1">{t.operator}</span>
            <span className="font-bold text-white font-mono text-sm">{snapshot.device.operatorName}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800/80">
            <span className="text-slate-500 block mb-1">{t.plmn}</span>
            <span className="font-bold text-cyan-400 font-mono text-sm">{snapshot.device.plmn}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800/80">
            <span className="text-slate-500 block mb-1">{t.connectionType}</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{snapshot.device.networkType}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800/80">
            <span className="text-slate-500 block mb-1">{t.ltePciLabel} / {t.nrPciLabel}</span>
            <div className="flex items-center gap-2 font-mono font-bold text-sm">
              <span className="text-blue-400">{snapshot.lte.pci}</span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400">{snapshot.nr.pci}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LTE Card and 5G NR Card Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LTE Card */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="font-bold text-white text-base">{t.lteCardTitle}</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800 font-mono font-bold">
              {snapshot.lte.band} ({snapshot.lte.bandwidth})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.rsrp}</span>
              <span className="font-mono font-bold text-sm" style={{ color: lteEval.colorHex }}>
                {snapshot.lte.rsrp} dBm
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.rsrq}</span>
              <span className="font-mono font-bold text-indigo-300 text-sm">{snapshot.lte.rsrq} dB</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.sinr}</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">+{snapshot.lte.sinr} dB</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.ltePciLabel}</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{snapshot.lte.pci}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.earfcn}</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{snapshot.lte.earfcn}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.cellId}</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{snapshot.lte.cellId}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.enbId}</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{snapshot.lte.enodebId}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.tac}</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{snapshot.lte.tac}</span>
            </div>
          </div>
        </div>

        {/* 5G NR Card */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="font-bold text-white text-base">{t.nrCardTitle}</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono font-bold">
              {snapshot.nr.band} ({snapshot.nr.bandwidth})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.rsrp}</span>
              <span className="font-mono font-bold text-sm" style={{ color: nrEval.colorHex }}>
                {snapshot.nr.rsrp} dBm
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.rsrq}</span>
              <span className="font-mono font-bold text-indigo-300 text-sm">{snapshot.nr.rsrq} dB</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.sinr}</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">+{snapshot.nr.sinr} dB</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.nrPciLabel}</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{snapshot.nr.pci}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.arfcn}</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{snapshot.nr.arfcn}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.rank}</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{snapshot.nr.rank}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.bler}</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{snapshot.nr.bler}%</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
              <span className="text-slate-500 block mb-1">{t.cqi}</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">{snapshot.nr.cqi} / 15</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Wi-Fi Clients & Live Speed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wi-Fi Clients Card */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">{t.wifiCardTitle}</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                {snapshot.wifi.connectedClients} {isArabic ? 'متصل' : 'Active'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-black font-mono text-white">
                {snapshot.wifi.connectedClients}
              </span>
              <span className="text-sm font-mono text-slate-400">
                / {snapshot.wifi.maxClients} {t.wifiClients}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#070B14] h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                style={{
                  width: `${Math.max(3, (snapshot.wifi.connectedClients / snapshot.wifi.maxClients) * 100)}%`,
                }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            {isArabic
              ? 'يتم قراءة عدد الأجهزة المتصلة مباشرة من خادم الويب المحلي للراوتر.'
              : 'Directly polled from local router web daemon.'}
          </p>
        </div>

        {/* Live Traffic / Speed Quick Card */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">{t.trafficCardTitle}</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {t.connectionDuration}: {Math.floor(snapshot.traffic.connectDurationSeconds / 60)}m
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/40 to-[#070B14] border border-blue-900/60">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
                <ArrowDownCircle className="w-4 h-4" />
                <span>{t.downloadRate}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-white">
                  {snapshot.traffic.currentDlKbps}
                </span>
                <span className="text-xs text-blue-400 font-mono font-bold">Kbps</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-[#070B14] border border-cyan-900/60">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold mb-1">
                <ArrowUpCircle className="w-4 h-4" />
                <span>{t.uploadRate}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-white">
                  {snapshot.traffic.currentUlKbps}
                </span>
                <span className="text-xs text-cyan-400 font-mono font-bold">Kbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
