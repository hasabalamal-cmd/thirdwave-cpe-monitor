import React, { useState } from 'react';
import { Translations, AppLanguage } from '../l10n/translations';
import { cpeService } from '../services/cpeService';
import { verifyHuaweiRouterLogin } from '../services/huaweiAuth';
import {
  Router,
  Server,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Radio,
  Wifi,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';

interface LoginScreenProps {
  t: Translations;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  t,
  language,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const isArabic = language === 'ar';
  const initialCreds = cpeService.getCredentials();

  const [host, setHost] = useState(initialCreds.host || '192.168.8.1');
  const [username, setUsername] = useState(initialCreds.username || 'admin');
  const [password, setPassword] = useState(initialCreds.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isDemo, setIsDemo] = useState(initialCreds.isDemoMode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim() && !isDemo) {
      setErrorMessage(
        isArabic ? 'يرجى إدخال كلمة مرور إدارة الراوتر للمتابعة' : 'Please enter router admin password'
      );
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setProgressStep(1);
    setProgressText(isArabic ? 'بدء فحص الاتصال بالراوتر...' : 'Starting router verification...');

    // Save state into cpeService
    cpeService.setCredentials({
      host: host.trim(),
      username: username.trim(),
      password: password.trim(),
      isDemoMode: isDemo,
    });

    try {
      const result = await verifyHuaweiRouterLogin(
        host,
        username,
        password,
        isDemo,
        isArabic,
        (step, text) => {
          setProgressStep(step);
          setProgressText(text);
        }
      );

      if (result.success) {
        setIsVerifying(false);
        setSuccessMessage(t.loginSuccess);
        setTimeout(() => {
          onLoginSuccess();
        }, 650);
      } else {
        setIsVerifying(false);
        setErrorMessage(result.errorMessage || t.loginFailed);
      }
    } catch (err: unknown) {
      setIsVerifying(false);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || t.loginFailed);
    }
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col justify-center items-center px-4 py-8 relative selection:bg-blue-600 selection:text-white"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher in corner */}
      <div className="absolute top-4 end-4 z-20">
        <button
          type="button"
          onClick={() => onLanguageChange(isArabic ? 'en' : 'ar')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#111B2D] hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isArabic ? 'English' : 'العربية'}</span>
        </button>
      </div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* App Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-600/25">
            <Router className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans">
            {t.appName}
          </h1>
          <p className="text-xs text-cyan-400 font-mono font-semibold tracking-wider uppercase">
            {t.appSubtitle}
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
            {t.loginSubtitle}
          </p>
        </div>

        {/* Login & Verification Card */}
        <div className="bg-[#111B2D] border border-slate-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>{t.loginTitle}</span>
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono">
              {isDemo ? t.demoMode : t.realMode}
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#070B14] rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsDemo(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                isDemo
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.demoMode}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDemo(false);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                !isDemo
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.realMode}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Router IP */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{t.routerIp}</span>
                <span className="text-[11px] text-slate-500 font-mono">{t.quickPresets}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="192.168.8.1"
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Quick IPs */}
              <div className="flex gap-2 mt-2">
                {['192.168.8.1', '192.168.1.1', '192.168.0.1'].map((ip) => (
                  <button
                    key={ip}
                    type="button"
                    onClick={() => setHost(ip)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                  >
                    {ip}
                  </button>
                ))}
              </div>
            </div>

            {/* Username & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-9 py-2.5 bg-[#070B14] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 px-2.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Handshake Progress Bar */}
            {isVerifying && (
              <div className="p-3.5 rounded-xl bg-[#070B14] border border-blue-900/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-300 font-mono">
                    {progressText}
                  </span>
                  <span className="font-mono text-xs text-blue-400 font-bold">
                    {progressStep * 20}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(15, progressStep * 20))}%` }}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
                {!isDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemo(true);
                      setErrorMessage(null);
                    }}
                    className="text-start text-[11px] text-cyan-400 hover:underline pt-1"
                  >
                    💡 {isArabic ? 'اضغط هنا للتبديل الفوري إلى وضع المحاكاة المعتمد (Mobily/Huawei) لتجاوز قيود الشبكة' : 'Click here to switch to verified Demo simulation mode'}
                  </button>
                )}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{progressText || t.loginVerifying}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.loginButton}</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="pt-2 border-t border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-500 leading-tight">
              🔒 {t.localLanOnlyNotice}
            </p>
          </div>
        </div>

        {/* Device Highlights */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 font-mono">
          <div className="p-2.5 rounded-xl bg-[#111B2D]/50 border border-slate-800/60">
            <span className="text-white block font-bold">Huawei H165</span>
            <span className="text-slate-500 text-[10px]">5G CPE 6</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111B2D]/50 border border-slate-800/60">
            <span className="text-cyan-400 block font-bold">5G NSA / SA</span>
            <span className="text-slate-500 text-[10px]">Dual RAT</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111B2D]/50 border border-slate-800/60">
            <span className="text-emerald-400 block font-bold">SCRAM Auth</span>
            <span className="text-slate-500 text-[10px]">PBKDF2/SHA256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
