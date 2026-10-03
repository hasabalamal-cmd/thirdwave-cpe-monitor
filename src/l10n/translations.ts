export type AppLanguage = 'ar' | 'en';

export interface Translations {
  appName: string;
  appSubtitle: string;
  connected: string;
  disconnected: string;
  connecting: string;
  demoMode: string;
  realMode: string;
  lastUpdated: string;
  refresh: string;
  autoRefresh: string;
  autoRefreshOff: string;
  autoRefreshInterval: string;
  seconds: string;

  // Login Gatekeeper
  loginTitle: string;
  loginSubtitle: string;
  loginButton: string;
  loginVerifying: string;
  loginFailed: string;
  loginSuccess: string;
  logout: string;
  localLanOnlyNotice: string;
  quickPresets: string;

  // Tabs
  tabHome: string;
  tabSignal: string;
  tabCells: string;
  tabSpeed: string;
  tabSettings: string;

  // Signal Evaluation
  excellent: string;
  good: string;
  fair: string;
  poor: string;
  signalQuality: string;
  antiInterference: string;
  linkLoad: string;

  // Cards
  signalGaugeTitle: string;
  miniGaugeLteTitle: string;
  miniGaugeNrTitle: string;
  dualGaugeSectionTitle: string;
  nrPciLabel: string;
  ltePciLabel: string;
  networkOverviewTitle: string;
  lteCardTitle: string;
  nrCardTitle: string;
  wifiCardTitle: string;
  trafficCardTitle: string;
  neighborsTitle: string;
  servingCellTitle: string;

  // Metrics
  operator: string;
  plmn: string;
  connectionType: string;
  rsrp: string;
  rsrq: string;
  sinr: string;
  pci: string;
  band: string;
  bandwidth: string;
  earfcn: string;
  arfcn: string;
  cellId: string;
  enbId: string;
  gnbId: string;
  tac: string;
  rank: string;
  bler: string;
  cqi: string;
  wifiClients: string;
  downloadRate: string;
  uploadRate: string;
  totalDownload: string;
  totalUpload: string;
  connectionDuration: string;

  // Settings
  settingsTitle: string;
  routerConfigTitle: string;
  routerIp: string;
  routerUsername: string;
  routerPassword: string;
  testConnection: string;
  language: string;
  arabic: string;
  english: string;
  theme: string;
  darkTheme: string;
  aboutTitle: string;
  aboutDesc: string;
  version: string;
  testedOn: string;
  saveCredentials: string;
  credentialsSaved: string;
  testingConnection: string;
  connectionSuccess: string;
  connectionFailed: string;
  unsupportedEndpoint: string;
  sessionExpired: string;
  noData: string;

  // Cells screen
  servingCell: string;
  neighborCells: string;
  servingCellBadge: string;
  neighborCellBadge: string;
  diffFromServing: string;
  rat: string;

  // Speed screen
  liveTrafficChart: string;
  speedTestTitle: string;
  runSpeedTest: string;
  speedTestInProgress: string;
  pingLatency: string;
  jitter: string;
  peakDlRate: string;
  peakUlRate: string;
}

export const translations: Record<AppLanguage, Translations> = {
  ar: {
    appName: 'الموجة الثالثة',
    appSubtitle: 'Third Wave CPE Monitor',
    connected: 'متصل',
    disconnected: 'غير متصل',
    connecting: 'جاري الاتصال...',
    demoMode: 'وضع المحاكاة (Demo)',
    realMode: 'راوتر حقيقي (Real CPE)',
    lastUpdated: 'آخر تحديث',
    refresh: 'تحديث فوري',
    autoRefresh: 'تحديث تلقائي',
    autoRefreshOff: 'إيقاف التحديث',
    autoRefreshInterval: 'فترة التحديث التلقائي',
    seconds: 'ثوانٍ',

    loginTitle: 'تسجيل الدخول والتحقق من الراوتر',
    loginSubtitle: 'يجب التحقق من الاتصال براوتر Huawei CPE المحلي للبدء بمراقبة الإشارة والبيانات.',
    loginButton: 'تسجيل الدخول وفحص الاتصال بالراوتر',
    loginVerifying: 'جاري فحص الاتصال بالراوتر والتحقق من الاستجابة...',
    loginFailed: 'تعذر الاتصال بالراوتر أو التحقق من البيانات. تأكد من العنوان وكلمة المرور.',
    loginSuccess: 'تم التحقق من الراوتر بنجاح! جاري فتح لوحة التحكم...',
    logout: 'تسجيل الخروج والتبديل',
    localLanOnlyNotice: 'اتصال محلي مشفر 100% داخل الشبكة المحلية (LAN) دون أي خوادم خارجية.',
    quickPresets: 'عناوين سريعة',

    tabHome: 'الرئيسية',
    tabSignal: 'الإشارة',
    tabCells: 'الخلايا',
    tabSpeed: 'السرعة',
    tabSettings: 'الإعدادات',

    excellent: 'ممتاز',
    good: 'جيد',
    fair: 'مقبول',
    poor: 'ضعيف',
    signalQuality: 'جودة الإشارة',
    antiInterference: 'مقاومة التشويش',
    linkLoad: 'حمولة القناة',

    signalGaugeTitle: 'مؤشر إشارة 5G NR الرئيسي',
    miniGaugeLteTitle: 'عداد إشارة 4G LTE',
    miniGaugeNrTitle: 'عداد إشارة 5G NR',
    dualGaugeSectionTitle: 'العدادات المصغرة لإشارة 4G و 5G',
    nrPciLabel: 'NR PCI',
    ltePciLabel: 'LTE PCI',
    networkOverviewTitle: 'نظرة عامة على الشبكة',
    lteCardTitle: 'بيانات LTE (الجيل الرابع)',
    nrCardTitle: 'بيانات 5G NR (الجيل الخامس)',
    wifiCardTitle: 'أجهزة Wi-Fi المتصلة',
    trafficCardTitle: 'حركة البيانات الحية والسرعة',
    neighborsTitle: 'الخلايا المجاورة (Neighbor Cells)',
    servingCellTitle: 'الخلية الحالية (Serving Cell)',

    operator: 'المشغل',
    plmn: 'رمز الشبكة (PLMN)',
    connectionType: 'نوع الاتصال',
    rsrp: 'RSRP (قوة الإشارة)',
    rsrq: 'RSRQ (جودة الإشارة)',
    sinr: 'SINR (نسبة الإشارة للتشويش)',
    pci: 'PCI (معرف الخلية الفيزيائي)',
    band: 'التردد / النطاق',
    bandwidth: 'عرض النطاق (Bandwidth)',
    earfcn: 'EARFCN (تردد LTE)',
    arfcn: 'NR ARFCN (تردد 5G)',
    cellId: 'معرف الخلية (Cell ID)',
    enbId: 'معرف البرج (eNB ID)',
    gnbId: 'معرف برج الجيل الخامس (gNB ID)',
    tac: 'رمز منطقة التتبع (TAC)',
    rank: 'طبقات الإرسال (Rank)',
    bler: 'معدل خطأ الكتل (BLER)',
    cqi: 'مؤشر جودة القناة (CQI)',
    wifiClients: 'المستخدمون المتصلون',
    downloadRate: 'سرعة التنزيل',
    uploadRate: 'سرعة الرفع',
    totalDownload: 'إجمالي التنزيل',
    totalUpload: 'إجمالي الرفع',
    connectionDuration: 'مدة الاتصال',

    settingsTitle: 'إعدادات الراوتر والتطبيق',
    routerConfigTitle: 'بيانات الاتصال بالراوتر المحلي',
    routerIp: 'عنوان IP للراوتر (المحلي)',
    routerUsername: 'اسم المستخدم',
    routerPassword: 'كلمة المرور',
    testConnection: 'اختبار الاتصال بالراوتر',
    language: 'لغة التطبيق',
    arabic: 'العربية (Arabic)',
    english: 'الإنجليزية (English)',
    theme: 'المظهر',
    darkTheme: 'المظهر الداكن الليلي (Dark Network UI)',
    aboutTitle: 'حول تطبيق الموجة الثالثة',
    aboutDesc: 'تطبيق احترافي متخصص في قراءة وتحليل بيانات شبكات الجيل الرابع والخامس 4G/5G لأجهزة راوتر Huawei CPE عبر الشبكة المحلية دون إرسال أي بيانات لأطراف خارجية.',
    version: 'الإصدار',
    testedOn: 'مختبر على أجهزة Huawei H165-383 و 5G CPE 6 و H155 و H122',
    saveCredentials: 'حفظ الإعدادات',
    credentialsSaved: 'تم حفظ إعدادات الاتصال بنجاح',
    testingConnection: 'جاري فحص الاتصال بالراوتر عبر الشبكة المحلية...',
    connectionSuccess: 'تم الاتصال بالراوتر بنجاح والتحقق من الصلاحيات',
    connectionFailed: 'تعذر الاتصال بالراوتر، تحقق من وجودك في نفس شبكة Wi-Fi',
    unsupportedEndpoint: 'هذا الأمر غير مدعوم في هذا الطراز',
    sessionExpired: 'انتهت جلسة تسجيل الدخول، يرجى إعادة إدخال كلمة المرور',
    noData: 'لا توجد بيانات متاحة حالياً',

    servingCell: 'الخلية النشطة الحالية',
    neighborCells: 'قائمة الخلايا والأبراج المجاورة',
    servingCellBadge: 'الخلية المتصلة',
    neighborCellBadge: 'خلية مجاورة',
    diffFromServing: 'الفارق عن الخلية الحالية',
    rat: 'التقنية',

    liveTrafficChart: 'مخطط تدفق البيانات الحي (خلال الوقت)',
    speedTestTitle: 'اختبار استجابة وسرعة اتصال البرج',
    runSpeedTest: 'بدء اختبار السرعة والكمون',
    speedTestInProgress: 'جاري إجراء الاختبار...',
    pingLatency: 'زمن الاستجابة (Ping)',
    jitter: 'التذبذب (Jitter)',
    peakDlRate: 'أعلى سرعة تنزيل',
    peakUlRate: 'أعلى سرعة رفع',
  },

  en: {
    appName: 'Third Wave',
    appSubtitle: 'Third Wave CPE Monitor',
    connected: 'Connected',
    disconnected: 'Disconnected',
    connecting: 'Connecting...',
    demoMode: 'Demo Simulation Mode',
    realMode: 'Real Local Router',
    lastUpdated: 'Last Updated',
    refresh: 'Refresh Now',
    autoRefresh: 'Auto Refresh',
    autoRefreshOff: 'Auto Refresh Off',
    autoRefreshInterval: 'Refresh Interval',
    seconds: 'seconds',

    loginTitle: 'Router Authentication & Verification',
    loginSubtitle: 'You must authenticate and verify local connection with the Huawei CPE router to access telemetry.',
    loginButton: 'Authenticate & Verify Router Connection',
    loginVerifying: 'Verifying local connection with router daemon...',
    loginFailed: 'Failed to verify router. Please check IP address and credentials.',
    loginSuccess: 'Router verified successfully! Opening telemetry dashboard...',
    logout: 'Logout / Change Router',
    localLanOnlyNotice: '100% local LAN traffic. No external servers or telemetry.',
    quickPresets: 'Quick IPs',

    tabHome: 'Home',
    tabSignal: 'Signal',
    tabCells: 'Cells',
    tabSpeed: 'Speed',
    tabSettings: 'Settings',

    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    signalQuality: 'Signal Quality',
    antiInterference: 'Interference Rejection',
    linkLoad: 'Link Load',

    signalGaugeTitle: '5G NR Primary Signal Gauge',
    miniGaugeLteTitle: '4G LTE Mini Gauge',
    miniGaugeNrTitle: '5G NR Mini Gauge',
    dualGaugeSectionTitle: 'Mini Signal Gauges (4G & 5G)',
    nrPciLabel: 'NR PCI',
    ltePciLabel: 'LTE PCI',
    networkOverviewTitle: 'Network Overview',
    lteCardTitle: 'LTE (4G) Signal Details',
    nrCardTitle: '5G NR Signal Details',
    wifiCardTitle: 'Connected Wi-Fi Clients',
    trafficCardTitle: 'Live Traffic & Speed',
    neighborsTitle: 'Neighbor Cells',
    servingCellTitle: 'Serving Cell',

    operator: 'Operator',
    plmn: 'PLMN Code',
    connectionType: 'Connection Type',
    rsrp: 'RSRP (Signal Power)',
    rsrq: 'RSRQ (Signal Quality)',
    sinr: 'SINR (Signal-to-Noise Ratio)',
    pci: 'PCI (Physical Cell ID)',
    band: 'Band / Frequency',
    bandwidth: 'Bandwidth',
    earfcn: 'EARFCN (LTE Carrier)',
    arfcn: 'NR ARFCN (5G Carrier)',
    cellId: 'Cell ID',
    enbId: 'eNB ID (Base Station)',
    gnbId: 'gNB ID (5G Station)',
    tac: 'Tracking Area Code (TAC)',
    rank: 'MIMO Rank Indicator',
    bler: 'Block Error Rate (BLER)',
    cqi: 'Channel Quality Indicator (CQI)',
    wifiClients: 'Active Wi-Fi Users',
    downloadRate: 'Download Rate',
    uploadRate: 'Upload Rate',
    totalDownload: 'Total Downloaded',
    totalUpload: 'Total Uploaded',
    connectionDuration: 'Connected Time',

    settingsTitle: 'Router & App Settings',
    routerConfigTitle: 'Local Router Access Configuration',
    routerIp: 'Router Local IP Address',
    routerUsername: 'Admin Username',
    routerPassword: 'Admin Password',
    testConnection: 'Test Router Connection',
    language: 'Application Language',
    arabic: 'العربية (Arabic)',
    english: 'English',
    theme: 'UI Theme',
    darkTheme: 'Dark Network Monitoring UI',
    aboutTitle: 'About Third Wave CPE Monitor',
    aboutDesc: 'Professional 4G/5G cellular router telemetry and diagnostic application for Huawei CPE routers over the local LAN without external telemetry or servers.',
    version: 'Version',
    testedOn: 'Tested on Huawei H165-383, 5G CPE 6, H155, and H122 routers',
    saveCredentials: 'Save Configuration',
    credentialsSaved: 'Router credentials saved successfully',
    testingConnection: 'Testing connection to local router...',
    connectionSuccess: 'Connected to router successfully',
    connectionFailed: 'Failed to connect. Ensure you are on the same Wi-Fi network.',
    unsupportedEndpoint: 'This command is not supported on this model',
    sessionExpired: 'Session expired. Please log in again.',
    noData: 'No telemetry data available',

    servingCell: 'Current Serving Cell',
    neighborCells: 'Neighboring Cells & Towers',
    servingCellBadge: 'Serving',
    neighborCellBadge: 'Neighbor',
    diffFromServing: 'Difference from Serving',
    rat: 'Radio Tech',

    liveTrafficChart: 'Live Traffic Throughput Chart',
    speedTestTitle: 'Tower Latency & Throughput Benchmark',
    runSpeedTest: 'Run Latency & Speed Test',
    speedTestInProgress: 'Testing in progress...',
    pingLatency: 'Air-interface Ping',
    jitter: 'Jitter',
    peakDlRate: 'Peak Download Speed',
    peakUlRate: 'Peak Upload Speed',
  },
};
