import React from 'react';
import { evaluateRsrp } from '../utils/cellMath';
import { Radio } from 'lucide-react';

interface MiniSignalGaugeProps {
  title: string;
  technology: '4G LTE' | '5G NR';
  rsrp: number;
  pci: number;
  pciLabel: string;
  band: string;
  bandwidth: string;
  sinr: number;
  rsrq: number;
  isArabic: boolean;
}

export const MiniSignalGauge: React.FC<MiniSignalGaugeProps> = ({
  title,
  technology,
  rsrp,
  pci,
  pciLabel,
  band,
  bandwidth,
  sinr,
  rsrq,
  isArabic,
}) => {
  const evalData = evaluateRsrp(rsrp);

  // SVG dimensions for Mini Gauge
  const radius = 52;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, evalData.percentage))) / 100;

  return (
    <div className="relative flex flex-col items-center justify-between p-4 bg-[#111B2D] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden group hover:border-slate-700 transition-all">
      {/* Background glow matching signal color */}
      <div
        className="absolute w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: evalData.colorHex }}
      />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-1 z-10">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: evalData.colorHex }}
          />
          <h4 className="text-xs font-bold text-white">{title}</h4>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono border"
          style={{
            color: evalData.colorHex,
            backgroundColor: `${evalData.colorHex}15`,
            borderColor: `${evalData.colorHex}40`,
          }}
        >
          {isArabic ? evalData.badgeAr : evalData.badgeEn}
        </span>
      </div>

      {/* Circular Gauge Arc */}
      <div className="relative w-40 h-40 flex items-center justify-center my-1">
        <svg
          className="w-full h-full -rotate-135 transform"
          viewBox="0 0 140 140"
        >
          {/* Track Arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#162235"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active Arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={evalData.colorHex}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${evalData.colorHex}80)`,
            }}
          />
        </svg>

        {/* Center Telemetry */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            RSRP
          </span>
          <div className="flex items-baseline gap-0.5">
            <span
              className="text-2xl font-black font-mono tracking-tight"
              style={{ color: evalData.colorHex }}
            >
              {rsrp}
            </span>
            <span className="text-[10px] font-mono text-slate-500">dBm</span>
          </div>

          {/* Badges for PCI & Band */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#070B14] border border-cyan-800/60 font-mono font-bold text-cyan-300">
              {pciLabel} {pci}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#070B14] border border-amber-800/60 font-mono font-bold text-amber-400">
              {band}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sub-metrics */}
      <div className="w-full grid grid-cols-3 gap-1.5 mt-1 pt-2 border-t border-slate-800/60 text-center text-[10px]">
        <div className="bg-[#070B14] py-1 px-1 rounded-lg border border-slate-800/60">
          <span className="text-slate-500 block">SINR</span>
          <span className="font-mono font-bold text-cyan-400">+{sinr}dB</span>
        </div>
        <div className="bg-[#070B14] py-1 px-1 rounded-lg border border-slate-800/60">
          <span className="text-slate-500 block">RSRQ</span>
          <span className="font-mono font-bold text-indigo-300">{rsrq}dB</span>
        </div>
        <div className="bg-[#070B14] py-1 px-1 rounded-lg border border-slate-800/60">
          <span className="text-slate-500 block">{isArabic ? 'العرض' : 'BW'}</span>
          <span className="font-mono font-bold text-white truncate block">{bandwidth}</span>
        </div>
      </div>
    </div>
  );
};
