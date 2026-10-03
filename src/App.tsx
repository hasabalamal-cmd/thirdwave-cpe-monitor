import React, { useState, useEffect, useCallback } from 'react';
import { AppTab, CpeSnapshot } from './types/cpe';
import { cpeService } from './services/cpeService';
import { translations, AppLanguage } from './l10n/translations';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { HomeTab } from './components/tabs/HomeTab';
import { SignalTab } from './components/tabs/SignalTab';
import { CellsTab } from './components/tabs/CellsTab';
import { SpeedTab } from './components/tabs/SpeedTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { AndroidApkModal } from './components/AndroidApkModal';
import {
  Home,
  Radio,
  Antenna,
  Zap,
  Settings,
  CheckCircle2,
} from 'lucide-react';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<AppLanguage>('ar');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tw_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [snapshot, setSnapshot] = useState<CpeSnapshot | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  const t = translations[language];
  const isArabic = language === 'ar';

  // Apply directionality (RTL for Arabic, LTR for English)
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  // Show Toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  }, []);

  // Fetch / Sync Snapshot
  const refreshSnapshot = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsRefreshing(true);
    try {
      const data = await cpeService.fetchSnapshot();
      setSnapshot(data);
    } catch (err: unknown) {
      console.error('Failed to sync snapshot:', err);
    } finally {
      if (showLoadingSpinner) setIsRefreshing(false);
    }
  }, []);

  // Periodic Auto-refresh Timer (only active when logged in)
  useEffect(() => {
    if (!isLoggedIn || autoRefreshInterval <= 0) return;
    const timer = setInterval(() => {
      refreshSnapshot(false);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [isLoggedIn, autoRefreshInterval, refreshSnapshot]);

  // Handle successful login
  const handleLoginSuccess = () => {
    try {
      localStorage.setItem('tw_logged_in', 'true');
    } catch {}
    setIsLoggedIn(true);
    refreshSnapshot(true);
    showToast(t.loginSuccess);
  };

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('tw_logged_in');
    } catch {}
    setIsLoggedIn(false);
    setSnapshot(null);
    showToast(t.logout);
  };

  const creds = cpeService.getCredentials();

  // If not verified & logged in: Show Login & Router Verification Screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        t={t}
        language={language}
        onLanguageChange={setLanguage}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Once authenticated and verified: Show Dashboard
  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600/30 selection:text-white"
    >
      {/* Top Header */}
      <Header
        snapshot={snapshot}
        t={t}
        language={language}
        onLanguageChange={(newLang) => {
          setLanguage(newLang);
          showToast(newLang === 'ar' ? 'تم تحويل لغة التطبيق إلى العربية' : 'Switched language to English');
        }}
        autoRefreshInterval={autoRefreshInterval}
        onToggleAutoRefresh={() => {
          const next = autoRefreshInterval > 0 ? 0 : 5;
          setAutoRefreshInterval(next);
          showToast(next > 0 ? `${t.autoRefresh}: 5 ${t.seconds}` : t.autoRefreshOff);
        }}
        onRefresh={() => {
          refreshSnapshot(true);
          showToast(t.refresh);
        }}
        isRefreshing={isRefreshing}
        isDemoMode={creds.isDemoMode}
        onLogout={handleLogout}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-8">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`fixed top-18 z-50 max-w-sm bg-[#111B2D] border border-blue-500/80 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 transition-all ${
              isArabic ? 'left-4' : 'right-4'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'home' && snapshot && (
          <HomeTab snapshot={snapshot} t={t} isArabic={isArabic} />
        )}

        {activeTab === 'signal' && snapshot && (
          <SignalTab snapshot={snapshot} t={t} isArabic={isArabic} />
        )}

        {activeTab === 'cells' && snapshot && (
          <CellsTab snapshot={snapshot} t={t} isArabic={isArabic} />
        )}

        {activeTab === 'speed' && snapshot && (
          <SpeedTab snapshot={snapshot} t={t} isArabic={isArabic} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            t={t}
            language={language}
            onLanguageChange={setLanguage}
            autoRefreshInterval={autoRefreshInterval}
            onAutoRefreshChange={(seconds) => {
              setAutoRefreshInterval(seconds);
              showToast(`${t.autoRefreshInterval}: ${seconds > 0 ? `${seconds} ${t.seconds}` : t.autoRefreshOff}`);
            }}
            showToast={showToast}
            onRefresh={() => refreshSnapshot(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#0D1422]/95 backdrop-blur-md border-t border-slate-800/80 z-40 py-1.5 px-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: 'home', label: t.tabHome, icon: Home },
            { id: 'signal', label: t.tabSignal, icon: Radio },
            { id: 'cells', label: t.tabCells, icon: Antenna },
            { id: 'speed', label: t.tabSpeed, icon: Zap },
            { id: 'settings', label: t.tabSettings, icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AppTab)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-9 h-7 rounded-xl flex items-center justify-center mb-0.5 transition-colors ${
                    isActive ? 'bg-cyan-500/15 text-cyan-400' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] tracking-tight">{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute bottom-0.5 shadow-xs shadow-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Android APK Modal */}
      <AndroidApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        isArabic={isArabic}
      />
    </div>
  );
};

export default App;
