import { AppTheme } from '../types/dating';

export interface ThemeConfig {
  id: AppTheme;
  nameEn: string;
  namePa: string;
  description: string;
  bgGradient: string;
  cardBg: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  badgeBg: string;
}

export const THEME_PALETTES: Record<AppTheme, ThemeConfig> = {
  royal_gulab: {
    id: 'royal_gulab',
    nameEn: 'Royal Gulab & Velvet',
    namePa: 'ਸ਼ਾਹੀ ਗੁਲਾਬ ਅਤੇ ਮਖ਼ਮਲ',
    description: 'Deep Indian velvet wine with ruby rose and festive gold accents',
    bgGradient: 'from-[#140b1c] via-[#0f0817] to-[#0a0510]',
    cardBg: 'bg-[#1a1224]',
    primaryColor: '#E11D48',
    accentColor: '#F59E0B',
    textColor: 'text-slate-100',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  kesari_gold: {
    id: 'kesari_gold',
    nameEn: 'Kesari Golden Heritage',
    namePa: 'ਕੇਸਰੀ ਸੁਨਹਿਰੀ ਵਿਰਾਸਤ',
    description: 'Rich royal saffron and warm amber gold inspired by Punjab',
    bgGradient: 'from-[#180e03] via-[#110a02] to-[#0a0601]',
    cardBg: 'bg-[#231506]',
    primaryColor: '#D97706',
    accentColor: '#FBBF24',
    textColor: 'text-amber-50',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  phulkari: {
    id: 'phulkari',
    nameEn: 'Punjabi Phulkari Festival',
    namePa: 'ਪੰਜਾਬੀ ਫੁਲਕਾਰੀ ਉਤਸਵ',
    description: 'Vibrant festive magenta and marigold gold inspired by Phulkari craft',
    bgGradient: 'from-[#1a081c] via-[#120514] to-[#0a020c]',
    cardBg: 'bg-[#290e2d]',
    primaryColor: '#C026D3',
    accentColor: '#F59E0B',
    textColor: 'text-pink-50',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30'
  },
  nilgiri: {
    id: 'nilgiri',
    nameEn: 'Nilgiri Royal Indigo',
    namePa: 'ਨੀਲਗਿਰੀ ਸ਼ਾਹੀ ਇੰਡੀਗੋ',
    description: 'Midnight sapphire blue with celestial silver glow',
    bgGradient: 'from-[#060c1d] via-[#040814] to-[#02040b]',
    cardBg: 'bg-[#0f172a]',
    primaryColor: '#2563EB',
    accentColor: '#38BDF8',
    textColor: 'text-sky-50',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  },
  ivory_silk: {
    id: 'ivory_silk',
    nameEn: 'Ivory Silk & Rose',
    namePa: 'ਰੇਸ਼ਮ ਅਤੇ ਗੁਲਾਬੀ',
    description: 'Warm, refined raw silk tones with subtle terracotta rose',
    bgGradient: 'from-[#1c1815] via-[#14100e] to-[#0d0a09]',
    cardBg: 'bg-[#28221e]',
    primaryColor: '#E11D48',
    accentColor: '#D97706',
    textColor: 'text-stone-100',
    badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-500/30'
  }
};
