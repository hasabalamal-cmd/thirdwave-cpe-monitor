import React from 'react';
import { CpeSnapshot } from '../types/cpe';
import { Translations, AppLanguage } from '../l10n/translations';
import {
  RotateCw,
  Radio,
  Clock,
  Globe,
  Wifi,
  Router,
  LogOut,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  snapshot: CpeSnapshot | null;
  t: Translations;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  autoRefreshInterval: number; // 0, 5, 10, 30
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isDemoMode: boolean;
  onLogout: () => void;
  onOpenApkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  snapshot,
  t,
  language,
  onLanguageChange,
  autoRefreshInterval,
  onToggleAutoRefresh,
  onRefresh,
  isRefreshing,
  isDemoMode,
  onLogout,
  onOpenApkModal,
}) => {
  const isArabic = language === 'ar';

  return (
    <header className="bg-[#0D1422] border-b border-slate-800/80 px-4 py-3 sm:px-6 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-6xl mx-auto flex flex-col gap-2.5">
        {/* Top bar: Brand & Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
              <Router className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white font-sans">
                  {t.appName}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono font-bold">
                  {isDemoMode ? t.demoMode : t.realMode}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {snapshot?.device.isConnected ? t.connected : t.disconnected}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {snapshot ? `${snapshot.device.modelName} · ${snapshot.device.marketingName}` : t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Android APK Modal Button */}
            <button
              type="button"
              onClick={onOpenApkModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/90 transition-all shadow-xs"
              title={isArabic ? 'تطبيق Android APK' : 'Android APK'}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isArabic ? 'تطبيق APK' : 'APK'}</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => onLanguageChange(isArabic ? 'en' : 'ar')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#111B2D] hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors shadow-xs"
              title={isArabic ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>

            {/* Auto-Refresh Toggle */}
            <button
              type="button"
              onClick={onToggleAutoRefresh}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                autoRefreshInterval > 0
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-[#111B2D] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {autoRefreshInterval > 0
                  ? `${autoRefreshInterval}s`
                  : t.autoRefreshOff}
              </span>
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-blue-600/20"
              title={t.refresh}
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Logout / Switch Router Button */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all shadow-xs"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Network Quick Pills */}
        {snapshot && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111B2D] text-slate-200 border border-slate-800">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">{snapshot.device.operatorName}</span>
              <span className="text-slate-400 font-mono text-[11px]">({snapshot.device.plmn})</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111B2D] text-cyan-300 border border-cyan-900/50 font-mono font-bold">
              <span>{snapshot.device.networkType}</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400">{snapshot.nr.band}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111B2D] text-slate-300 border border-slate-800">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wi-Fi: {snapshot.wifi.connectedClients} / {snapshot.wifi.maxClients}</span>
            </div>

            <span className="text-[11px] text-slate-500 ml-auto font-mono">
              {t.lastUpdated}: {snapshot.lastUpdated}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
