import React, { useState } from 'react';
import { Smartphone, Download, Terminal, CheckCircle2, Copy, X, Folder, ShieldCheck } from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose, isArabic }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative w-full max-w-xl bg-[#0D1422] border border-blue-900/80 rounded-3xl p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white font-sans">
              {isArabic ? 'تطبيق Android APK (الموجة الثالثة)' : 'Android APK (Third Wave CPE Monitor)'}
            </h2>
            <p className="text-xs text-cyan-400 font-mono">
              Package: com.thirdwave.cpemonitor
            </p>
          </div>
        </div>

        {/* Project Status Summary */}
        <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>{isArabic ? 'حالة مشروع أندرويد:' : 'Android Project Status:'}</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {isArabic ? 'مكتمل ومُجهّز بنسبة 100%' : '100% Ready & Synced'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>{isArabic ? 'مجلد المشروع الداخلي:' : 'Native Directory:'}</span>
            <span className="font-mono text-cyan-300 font-bold">/android</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>{isArabic ? 'الاتصال المحلي بالراوتر:' : 'Local LAN Cleartext:'}</span>
            <span className="font-mono text-emerald-400 font-bold">usesCleartextTraffic=true (192.168.8.1)</span>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{isArabic ? 'طريقتان للحصول على ملف APK وتثبيته على هاتفك:' : 'Two ways to build & install APK:'}</span>
          </h3>

          {/* Option 1: Android Studio */}
          <div className="p-4 rounded-xl bg-[#111B2D] border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[11px]">1</span>
              <span>{isArabic ? 'عبر Android Studio (الأسهل والأسرع):' : 'Via Android Studio (Easiest):'}</span>
            </div>
            <ol className="list-decimal list-inside text-slate-300 space-y-1 ps-1 leading-relaxed">
              <li>{isArabic ? 'قم بتنزيل المشروع على جهازك الكمبيوتر.' : 'Download project to your computer.'}</li>
              <li>{isArabic ? 'افتح برنامج Android Studio واختر Open لمجلد android.' : 'Open Android Studio and select the android folder.'}</li>
              <li>{isArabic ? 'اضغط من القائمة: Build > Build Bundle(s) / APK(s) > Build APK(s).' : 'Click Build > Build APK(s).'}</li>
              <li>{isArabic ? 'سيظهر لك ملف app-debug.apk جاهز للتثبيت فوراً!' : 'Your app-debug.apk is ready to install!'}</li>
            </ol>
          </div>

          {/* Option 2: Command Line */}
          <div className="p-4 rounded-xl bg-[#111B2D] border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-[11px]">2</span>
              <span>{isArabic ? 'عبر سطر الأوامر (Command Line):' : 'Via Command Line:'}</span>
            </div>
            <p className="text-slate-400">
              {isArabic ? 'قم بتشغيل الأوامر التالية داخل مجلد المشروع:' : 'Run the following commands in project root:'}
            </p>

            <div className="p-3 bg-[#070B14] rounded-xl border border-slate-800/90 font-mono text-[11px] text-cyan-300 flex items-center justify-between gap-2">
              <code>cd android &amp;&amp; ./gradlew assembleDebug</code>
              <button
                type="button"
                onClick={() => handleCopy('cd android && ./gradlew assembleDebug', 'cmd1')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'cmd1' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              {isArabic ? 'المسار المتوقع للملف الناتج:' : 'Output file path:'}
              <br />
              <span className="text-white font-mono">android/app/build/outputs/apk/debug/app-debug.apk</span>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all text-center"
        >
          {isArabic ? 'إغلاق والعودة للوحة التحكم' : 'Close and Return to Dashboard'}
        </button>
      </div>
    </div>
  );
};
