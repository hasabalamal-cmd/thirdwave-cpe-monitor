import React from 'react';
import { CpeSnapshot } from '../../types/cpe';
import { Translations } from '../../l10n/translations';
import { evaluateRsrp } from '../../utils/cellMath';
import { MiniSignalGauge } from '../MiniSignalGauge';
import {
  Radio,
  Activity,
  Layers,
  Zap,
  Gauge,
} from 'lucide-react';

interface SignalTabProps {
  snapshot: CpeSnapshot;
  t: Translations;
  isArabic: boolean;
}

export const SignalTab: React.FC<SignalTabProps> = ({ snapshot, t, isArabic }) => {
  const lteEval = evaluateRsrp(snapshot.lte.rsrp);
  const nrEval = evaluateRsrp(snapshot.nr.rsrp);

  return (
    <div className="space-y-6">
      {/* 1. Dual Mini Circular Gauges (4G & 5G) prominent at top */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t.dualGaugeSectionTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mini Circular Gauge for 4G LTE */}
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

          {/* Mini Circular Gauge for 5G NR */}
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

      {/* 2. Key Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* LTE RSRP */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">LTE {t.rsrp}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono" style={{ color: lteEval.colorHex }}>
              {snapshot.lte.rsrp}
            </span>
            <span className="text-xs text-slate-500 font-mono">dBm</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold" style={{ color: lteEval.colorHex }}>
            {isArabic ? lteEval.badgeAr : lteEval.badgeEn}
          </div>
        </div>

        {/* NR RSRP */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">5G NR {t.rsrp}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono" style={{ color: nrEval.colorHex }}>
              {snapshot.nr.rsrp}
            </span>
            <span className="text-xs text-slate-500 font-mono">dBm</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold" style={{ color: nrEval.colorHex }}>
            {isArabic ? nrEval.badgeAr : nrEval.badgeEn}
          </div>
        </div>

        {/* NR SINR */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">5G NR {t.sinr}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-cyan-400">
              +{snapshot.nr.sinr}
            </span>
            <span className="text-xs text-slate-500 font-mono">dB</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-cyan-400">
            {t.antiInterference}: {snapshot.nr.sinr >= 8 ? (isArabic ? 'ممتاز' : 'Clean') : (isArabic ? 'متوسط' : 'Moderate')}
          </div>
        </div>

        {/* NR CQI */}
        <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">{t.cqi}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {snapshot.nr.cqi}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 15</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-emerald-400">
            {isArabic ? 'تضمين 256QAM عالي' : '256QAM Supported'}
          </div>
        </div>
      </div>

      {/* 3. Deep Dive LTE Telemetry Card */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-white text-base">
              {t.lteCardTitle} (LTE Anchor Carrier)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold">
            {snapshot.lte.band} · EARFCN {snapshot.lte.earfcn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.ltePciLabel}</span>
            <span className="font-mono font-bold text-amber-400 text-base">{snapshot.lte.pci}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.rsrp}</span>
            <span className="font-mono font-bold text-base" style={{ color: lteEval.colorHex }}>
              {snapshot.lte.rsrp} dBm
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.rsrq}</span>
            <span className="font-mono font-bold text-indigo-300 text-base">{snapshot.lte.rsrq} dB</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.sinr}</span>
            <span className="font-mono font-bold text-cyan-400 text-base">+{snapshot.lte.sinr} dB</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.bandwidth}</span>
            <span className="font-mono font-bold text-white text-base">{snapshot.lte.bandwidth}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.cellId}</span>
            <span className="font-mono font-bold text-slate-200 text-base">{snapshot.lte.cellId}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.enbId}</span>
            <span className="font-mono font-bold text-slate-200 text-base">{snapshot.lte.enodebId}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.tac}</span>
            <span className="font-mono font-bold text-slate-200 text-base">{snapshot.lte.tac}</span>
          </div>
        </div>
      </div>

      {/* 4. Deep Dive 5G NR Telemetry Card */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">
              {t.nrCardTitle} (5G Secondary Carrier)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
            {snapshot.nr.band} · ARFCN {snapshot.nr.arfcn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.nrPciLabel}</span>
            <span className="font-mono font-bold text-amber-400 text-base">{snapshot.nr.pci}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">NR {t.rsrp}</span>
            <span className="font-mono font-bold text-base" style={{ color: nrEval.colorHex }}>
              {snapshot.nr.rsrp} dBm
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">NR {t.rsrq}</span>
            <span className="font-mono font-bold text-indigo-300 text-base">{snapshot.nr.rsrq} dB</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">NR {t.sinr}</span>
            <span className="font-mono font-bold text-cyan-400 text-base">+{snapshot.nr.sinr} dB</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.bandwidth}</span>
            <span className="font-mono font-bold text-white text-base">{snapshot.nr.bandwidth}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.rank}</span>
            <span className="font-mono font-bold text-emerald-400 text-base">{snapshot.nr.rank} (2x2 MIMO)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.bler}</span>
            <span className="font-mono font-bold text-emerald-400 text-base">{snapshot.nr.bler}%</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.cqi}</span>
            <span className="font-mono font-bold text-cyan-300 text-base">{snapshot.nr.cqi} / 15</span>
          </div>
        </div>
      </div>
    </div>
  );
};
