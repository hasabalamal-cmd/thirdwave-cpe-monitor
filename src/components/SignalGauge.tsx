import React from 'react';
import { NrSignalInfo } from '../types/cpe';
import { evaluateRsrp } from '../utils/cellMath';
import { Translations } from '../l10n/translations';
import { Radio, Activity } from 'lucide-react';

interface SignalGaugeProps {
  nrSignal: NrSignalInfo;
  networkType: string;
  t: Translations;
  isArabic: boolean;
}

export const SignalGauge: React.FC<SignalGaugeProps> = ({
  nrSignal,
  networkType,
  t,
  isArabic,
}) => {
  const evalData = evaluateRsrp(nrSignal.rsrp);

  // SVG Gauge calculation
  // Radius = 90, Center = (110, 110)
  // Arc spans 260 degrees (from 140 deg to 400 deg)
  const radius = 85;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Arc is 75% of full circle (270 degrees)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, evalData.percentage))) / 100;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#111B2D] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden">
      {/* Subtle Background Glow corresponding to signal quality */}
      <div
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: evalData.colorHex }}
      />

      <div className="flex items-center gap-2 mb-2 z-10">
        <Radio className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-slate-400">
          {t.signalGaugeTitle}
        </span>
      </div>

      {/* Circular Gauge Arc */}
      <div className="relative w-60 h-60 flex items-center justify-center">
        <svg
          className="w-full h-full -rotate-135 transform"
          viewBox="0 0 220 220"
        >
          {/* Track Arc */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#1a273e"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={evalData.colorHex}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${evalData.colorHex}80)`,
            }}
          />
        </svg>

        {/* Center Gauge Telemetry */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {/* Signal Level Badge */}
          <div
            className="px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase mb-1 border transition-colors duration-500"
            style={{
              color: evalData.colorHex,
              backgroundColor: `${evalData.colorHex}15`,
              borderColor: `${evalData.colorHex}40`,
            }}
          >
            {isArabic ? evalData.badgeAr : evalData.badgeEn}
          </div>

          {/* RSRP Big Number */}
          <div className="flex items-baseline gap-1 my-0.5">
            <span
              className="text-4xl sm:text-5xl font-black font-mono tracking-tight transition-colors duration-500"
              style={{ color: evalData.colorHex }}
            >
              {nrSignal.rsrp}
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">
              dBm
            </span>
          </div>

          {/* Explicit NR PCI and Band (Separated from LTE PCI) */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#070B14] border border-cyan-800/60 font-mono font-bold text-cyan-300">
              {t.nrPciLabel} {nrSignal.pci}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#070B14] border border-amber-800/60 font-mono font-bold text-amber-400">
              {nrSignal.band}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{networkType}</span>
            <span>·</span>
            <span>{nrSignal.bandwidth}</span>
          </div>
        </div>
      </div>

      {/* Auxiliary Quick Indicators under the Gauge */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-3 pt-3 border-t border-slate-800/80 text-center">
        <div className="bg-[#070B14] p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 block mb-0.5">NR SINR</span>
          <span className="text-sm font-black font-mono text-cyan-400">
            +{nrSignal.sinr} <span className="text-[10px] text-slate-500">dB</span>
          </span>
        </div>

        <div className="bg-[#070B14] p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 block mb-0.5">NR RSRQ</span>
          <span className="text-sm font-black font-mono text-indigo-300">
            {nrSignal.rsrq} <span className="text-[10px] text-slate-500">dB</span>
          </span>
        </div>

        <div className="bg-[#070B14] p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-500 block mb-0.5">CQI</span>
          <span className="text-sm font-black font-mono text-emerald-400">
            {nrSignal.cqi} <span className="text-[10px] text-slate-500">/15</span>
          </span>
        </div>
      </div>
    </div>
  );
};
