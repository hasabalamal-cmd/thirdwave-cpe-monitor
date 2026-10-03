import { SignalQualityLevel } from '../types/cpe';

export function evaluateRsrp(rsrp: number): {
  level: SignalQualityLevel;
  colorHex: string;
  badgeAr: string;
  badgeEn: string;
  percentage: number;
} {
  // Thresholds:
  // >= -85 dBm: Excellent
  // -86 to -95 dBm: Good
  // -96 to -105 dBm: Fair
  // < -105 dBm: Poor
  const percent = Math.min(100, Math.max(0, ((rsrp + 125) / 60) * 100));

  if (rsrp >= -85) {
    return {
      level: 'excellent',
      colorHex: '#22C55E', // Green
      badgeAr: 'ممتاز (Excellent)',
      badgeEn: 'Excellent',
      percentage: percent,
    };
  } else if (rsrp >= -95) {
    return {
      level: 'good',
      colorHex: '#06B6D4', // Cyan
      badgeAr: 'جيد (Good)',
      badgeEn: 'Good',
      percentage: percent,
    };
  } else if (rsrp >= -105) {
    return {
      level: 'fair',
      colorHex: '#F59E0B', // Amber
      badgeAr: 'مقبول (Fair)',
      badgeEn: 'Fair',
      percentage: percent,
    };
  } else {
    return {
      level: 'poor',
      colorHex: '#EF4444', // Red
      badgeAr: 'ضعيف (Poor)',
      badgeEn: 'Poor',
      percentage: percent,
    };
  }
}

export function formatBytes(bytes: number, lang: 'ar' | 'en' = 'ar'): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  const gb = (bytes / (1024 * 1024 * 1024)).toFixed(2);
  return lang === 'ar' ? `${gb} غ.ب` : `${gb} GB`;
}

export function formatDuration(seconds: number, lang: 'ar' | 'en' = 'ar'): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (lang === 'ar') {
    if (hrs > 0) return `${hrs} س ${mins} د ${secs} ث`;
    if (mins > 0) return `${mins} د ${secs} ث`;
    return `${secs} ثانية`;
  } else {
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }
}

export function computeEci(enbId: number | string, cellId: number | string): number {
  const enb = typeof enbId === 'number' ? enbId : parseInt(enbId, 10);
  const cell = typeof cellId === 'number' ? cellId : parseInt(cellId, 10);
  return enb * 256 + cell;
}

export function computeGci(gnbId: number | string, cellId: number | string): number {
  const gnb = typeof gnbId === 'number' ? gnbId : parseInt(gnbId, 10);
  const cell = typeof cellId === 'number' ? cellId : parseInt(cellId, 10);
  return gnb * 4096 + cell;
}
