import React, { useState } from 'react';
import { RouterCredentials } from '../../types/cpe';
import { Translations, AppLanguage } from '../../l10n/translations';
import { cpeService } from '../../services/cpeService';
import {
  Server,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  Router,
  Clock,
  Globe,
  ShieldCheck,
  Info,
  Layers,
  LogOut,
} from 'lucide-react';

interface SettingsTabProps {
  t: Translations;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  autoRefreshInterval: number;
  onAutoRefreshChange: (seconds: number) => void;
  showToast: (msg: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  t,
  language,
  onLanguageChange,
  autoRefreshInterval,
  onAutoRefreshChange,
  showToast,
  onRefresh,
  onLogout,
}) => {
  const isArabic = language === 'ar';
  const creds = cpeService.getCredentials();

  const [host, setHost] = useState(creds.host);
  const [username, setUsername] = useState(creds.username);
  const [password, setPassword] = useState(creds.password || '');
  const [isDemo, setIsDemo] = useState(creds.isDemoMode);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    cpeService.setCredentials({
      host: host.trim(),
      username: username.trim(),
      password,
      isDemoMode: isDemo,
    });
    showToast(t.credentialsSaved);
    onRefresh();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    setIsTesting(false);

    if (isDemo) {
      setTestResult(t.connectionSuccess);
      showToast(t.connectionSuccess);
    } else {
      // In real router mode: test direct reachability
      try {
        const res = await fetch(`http://${host}/api/monitoring/status`, {
          signal: AbortSignal.timeout(2500),
        });
        if (res.ok) {
          setTestResult(t.connectionSuccess);
          showToast(t.connectionSuccess);
        } else {
          setTestResult(`${t.connectionFailed} (HTTP ${res.status})`);
          showToast(t.connectionFailed);
        }
      } catch (e) {
        setTestResult(t.connectionFailed);
        showToast(t.connectionFailed);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 1. Router Credentials & Connection Setup */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-white text-base">
              {t.routerConfigTitle}
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono">
            {isDemo ? t.demoMode : t.realMode}
          </span>
        </div>

        {/* Operating Mode Selector */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-[#070B14] rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setIsDemo(true)}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              isDemo
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.demoMode}
          </button>
          <button
            type="button"
            onClick={() => setIsDemo(false)}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              !isDemo
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.realMode}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.routerIp}
            </label>
            <div className="relative">
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="192.168.8.1"
                className="w-full px-3.5 py-2.5 bg-[#070B14] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {['192.168.8.1', '192.168.1.1', '192.168.0.1'].map((ip) => (
                <button
                  key={ip}
                  type="button"
                  onClick={() => setHost(ip)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800"
                >
                  {ip}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.routerUsername}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-[#070B14] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.routerPassword}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#070B14] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {testResult && (
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800 text-cyan-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{testResult}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              {t.saveCredentials}
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              {isTesting ? t.testingConnection : t.testConnection}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Preferences (Language, Auto-Refresh) */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">
          {t.settingsTitle}
        </h3>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{t.language}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onLanguageChange('ar')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                language === 'ar'
                  ? 'bg-blue-600/20 border-blue-500 text-white'
                  : 'bg-[#070B14] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {t.arabic}
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                language === 'en'
                  ? 'bg-blue-600/20 border-blue-500 text-white'
                  : 'bg-[#070B14] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {t.english}
            </button>
          </div>
        </div>

        {/* Auto Refresh Interval */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{t.autoRefreshInterval}</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 5, label: `5 ${t.seconds}` },
              { val: 10, label: `10 ${t.seconds}` },
              { val: 30, label: `30 ${t.seconds}` },
              { val: 0, label: t.autoRefreshOff },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => onAutoRefreshChange(opt.val)}
                className={`py-2 px-2 rounded-xl border text-xs font-mono font-semibold transition-all text-center ${
                  autoRefreshInterval === opt.val
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-[#070B14] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Disconnect / Logout Action */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      {/* 3. About & Privacy Section */}
      <div className="bg-[#111B2D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-base">{t.aboutTitle}</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.aboutDesc}
        </p>

        <div className="pt-2 text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>{t.version}</span>
            <span className="font-mono text-cyan-300 font-bold">v0.3.2 (Mobile First)</span>
          </div>
          <div className="flex justify-between">
            <span>{t.appName}</span>
            <span className="font-mono text-slate-300">Third Wave CPE Monitor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
