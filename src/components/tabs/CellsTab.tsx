import React from 'react';
import { CpeSnapshot } from '../../types/cpe';
import { Translations } from '../../l10n/translations';
import { evaluateRsrp } from '../../utils/cellMath';
import {
  Radio,
  Signal,
  CheckCircle2,
  Antenna,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface CellsTabProps {
  snapshot: CpeSnapshot;
  t: Translations;
  isArabic: boolean;
}

export const CellsTab: React.FC<CellsTabProps> = ({ snapshot, t, isArabic }) => {
  const lteEval = evaluateRsrp(snapshot.lte.rsrp);
  const nrEval = evaluateRsrp(snapshot.nr.rsrp);

  return (
    <div className="space-y-6">
      {/* 1. Active Serving Cells (LTE & 5G NR) */}
      <div className="bg-[#111B2D] border border-blue-900/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-white text-base">
              {t.servingCellTitle} (Serving Cell)
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.servingCellBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LTE Serving Component */}
          <div className="p-4 rounded-xl bg-[#070B14] border border-blue-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 font-mono">
                LTE Anchor Cell (4G)
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                PCI {snapshot.lte.pci}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t.band}</span>
                <span className="font-mono text-white font-semibold">{snapshot.lte.band} ({snapshot.lte.bandwidth})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.earfcn}</span>
                <span className="font-mono text-cyan-300 font-semibold">{snapshot.lte.earfcn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.rsrp}</span>
                <span className="font-mono font-bold" style={{ color: lteEval.colorHex }}>
                  {snapshot.lte.rsrp} dBm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.rsrq}</span>
                <span className="font-mono text-indigo-300 font-semibold">{snapshot.lte.rsrq} dB</span>
              </div>
            </div>
          </div>

          {/* 5G NR Serving Component */}
          <div className="p-4 rounded-xl bg-[#070B14] border border-cyan-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 font-mono">
                5G NR Primary Cell (5G)
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                PCI {snapshot.nr.pci}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t.band}</span>
                <span className="font-mono text-white font-semibold">{snapshot.nr.band} ({snapshot.nr.bandwidth})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.arfcn}</span>
                <span className="font-mono text-cyan-300 font-semibold">{snapshot.nr.arfcn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.rsrp}</span>
                <span className="font-mono font-bold" style={{ color: nrEval.colorHex }}>
                  {snapshot.nr.rsrp} dBm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.rsrq}</span>
                <span className="font-mono text-indigo-300 font-semibold">{snapshot.nr.rsrq} dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Neighbor Cells List */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Antenna className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-white text-base">
                {t.neighborsTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? 'رصد الأبراج والخلايا المجاورة لاكتشاف الإشارات البديلة وتقييم جودة التغطية.'
                  : 'Detected adjacent base station sectors for handover assessment.'}
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-[#070B14] border border-slate-800 text-slate-300 font-mono">
            {snapshot.neighbors.length} {isArabic ? 'خلايا مكتشفة' : 'Cells Detected'}
          </span>
        </div>

        {/* Responsive Table of Neighbor Cells */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#070B14] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">{t.rat}</th>
                <th className="px-4 py-3">{t.pci}</th>
                <th className="px-4 py-3">{t.band}</th>
                <th className="px-4 py-3">{t.earfcn}</th>
                <th className="px-4 py-3">{t.rsrp}</th>
                <th className="px-4 py-3">{t.rsrq}</th>
                <th className="px-4 py-3">{t.diffFromServing}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {snapshot.neighbors.map((nbr) => {
                const diff = nbr.rsrp - snapshot.lte.rsrp;
                const nbrEval = evaluateRsrp(nbr.rsrp);
                return (
                  <tr key={nbr.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-blue-950 text-blue-300 border border-blue-800">
                        {nbr.rat}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-amber-400 text-sm">
                      {nbr.pci}
                    </td>
                    <td className="px-4 py-3.5 text-white font-bold">
                      {nbr.band}
                    </td>
                    <td className="px-4 py-3.5 text-cyan-400">
                      {nbr.earfcnOrArfcn}
                    </td>
                    <td className="px-4 py-3.5 font-bold" style={{ color: nbrEval.colorHex }}>
                      {nbr.rsrp} dBm
                    </td>
                    <td className="px-4 py-3.5 text-indigo-300">
                      {nbr.rsrq} dB
                    </td>
                    <td className="px-4 py-3.5 font-bold">
                      <span className={diff >= 0 ? 'text-emerald-400' : 'text-slate-400'}>
                        {diff > 0 ? `+${diff}` : diff} dB
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
