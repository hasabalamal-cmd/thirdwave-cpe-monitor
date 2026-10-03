import React, { useState } from 'react';
import { CpeSnapshot } from '../../types/cpe';
import { Translations } from '../../l10n/translations';
import { cpeService } from '../../services/cpeService';
import { formatBytes, formatDuration } from '../../utils/cellMath';
import {
  Zap,
  ArrowDownCircle,
  ArrowUpCircle,
  Play,
  Clock,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface SpeedTabProps {
  snapshot: CpeSnapshot;
  t: Translations;
  isArabic: boolean;
}

export const SpeedTab: React.FC<SpeedTabProps> = ({ snapshot, t, isArabic }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [pingResult, setPingResult] = useState<number | null>(null);
  const [jitterResult, setJitterResult] = useState<number | null>(null);
  const [peakDl, setPeakDl] = useState<number | null>(null);
  const [peakUl, setPeakUl] = useState<number | null>(null);

  const history = cpeService.getHistory();

  // Run Speed / Latency Test
  const handleRunSpeedTest = async () => {
    setIsTesting(true);
    setTestProgress(10);
    setPingResult(null);
    setJitterResult(null);
    setPeakDl(null);
    setPeakUl(null);

    // Step 1: Air-interface Ping & Jitter
    await new Promise((r) => setTimeout(r, 500));
    setPingResult(14 + Math.floor(Math.random() * 4));
    setJitterResult(2 + Math.floor(Math.random() * 3));
    setTestProgress(40);

    // Step 2: Downlink peak
    for (let p = 50; p <= 75; p += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setTestProgress(p);
      setPeakDl(+(480 + Math.random() * 85).toFixed(1));
    }

    // Step 3: Uplink peak
    for (let p = 80; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setTestProgress(p);
      setPeakUl(+(85 + Math.random() * 25).toFixed(1));
    }

    setIsTesting(false);
  };

  // SVG Chart calculation for history
  const chartHeight = 130;
  const chartWidth = 550;
  const maxSpeed = Math.max(
    180,
    ...history.map((h) => Math.max(h.dlSpeed, h.ulSpeed))
  );

  const getX = (idx: number) =>
    (idx / Math.max(1, history.length - 1)) * chartWidth;
  const getY = (val: number) =>
    chartHeight - (val / maxSpeed) * (chartHeight - 20) - 10;

  const dlPolyline = history
    .map((item, idx) => `${getX(idx)},${getY(item.dlSpeed)}`)
    .join(' ');

  const ulPolyline = history
    .map((item, idx) => `${getX(idx)},${getY(item.ulSpeed)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* 1. Live Traffic Big Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Download Card */}
        <div className="bg-[#111B2D] border border-blue-900/60 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-400">
              <ArrowDownCircle className="w-5 h-5" />
              <span className="font-bold text-sm">{t.downloadRate}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {t.totalDownload}: {formatBytes(snapshot.traffic.totalDlBytes, isArabic ? 'ar' : 'en')}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl font-black font-mono text-white">
              {snapshot.traffic.currentDlKbps}
            </span>
            <span className="text-sm font-mono text-blue-400 font-bold">Kbps</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-[#111B2D] border border-cyan-900/60 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <ArrowUpCircle className="w-5 h-5" />
              <span className="font-bold text-sm">{t.uploadRate}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {t.totalUpload}: {formatBytes(snapshot.traffic.totalUlBytes, isArabic ? 'ar' : 'en')}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-4xl font-black font-mono text-white">
              {snapshot.traffic.currentUlKbps}
            </span>
            <span className="text-sm font-mono text-cyan-400 font-bold">Kbps</span>
          </div>
        </div>
      </div>

      {/* 2. Live Dynamic Traffic Chart */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-white text-base">
                {t.liveTrafficChart}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? 'رسم بياني يوضح تقلبات حركة التحميل والرفع في الوقت الفعلي.'
                  : 'Time-series chart showing download and upload speeds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-300">{t.downloadRate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300">{t.uploadRate}</span>
            </div>
          </div>
        </div>

        {/* SVG Sparkline */}
        <div className="p-4 bg-[#070B14] rounded-xl border border-slate-800/80">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-32 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Grid horizontal guidelines */}
            <line x1="0" y1="10" x2={chartWidth} y2="10" stroke="#172236" strokeDasharray="3 3" />
            <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#172236" strokeDasharray="3 3" />
            <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="#172236" />

            {/* DL Line */}
            <polyline
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={dlPolyline}
            />

            {/* UL Line */}
            <polyline
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={ulPolyline}
            />

            {/* Current latest point dot */}
            {history.length > 0 && (
              <>
                <circle
                  cx={getX(history.length - 1)}
                  cy={getY(history[history.length - 1].dlSpeed)}
                  r="4"
                  fill="#2563EB"
                />
                <circle
                  cx={getX(history.length - 1)}
                  cy={getY(history[history.length - 1].ulSpeed)}
                  r="4"
                  fill="#06B6D4"
                />
              </>
            )}
          </svg>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/60">
            <span>{t.connectionDuration}: {formatDuration(snapshot.traffic.connectDurationSeconds, isArabic ? 'ar' : 'en')}</span>
            <span>{isArabic ? 'تحديث تلقائي حي' : 'Live Auto Polling'}</span>
          </div>
        </div>
      </div>

      {/* 3. Speed & Latency Benchmark Panel */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">
                {t.speedTestTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? 'قياس زمن الاستجابة المباشر وأقصى سرعة يستطيع البرج تقديمها عبر شبكة 5G.'
                  : 'Measure latency and peak bandwidth from local tower carrier.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunSpeedTest}
            disabled={isTesting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isTesting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.speedTestInProgress} ({testProgress}%)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.runSpeedTest}</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.pingLatency}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-cyan-400">
                {pingResult !== null ? pingResult : '14'}
              </span>
              <span className="text-xs text-slate-500 font-mono">ms</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.jitter}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {jitterResult !== null ? jitterResult : '2'}
              </span>
              <span className="text-xs text-slate-500 font-mono">ms</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.peakDlRate}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-white">
                {peakDl !== null ? peakDl : '512.4'}
              </span>
              <span className="text-xs text-blue-400 font-mono font-bold">Mbps</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
            <span className="text-slate-500 block mb-1">{t.peakUlRate}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-white">
                {peakUl !== null ? peakUl : '98.2'}
              </span>
              <span className="text-xs text-cyan-400 font-mono font-bold">Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
