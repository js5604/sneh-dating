export type ThemePresetId =
  | 'material_you'
  | 'shinkai_sunset'
  | 'nordic_mist'
  | 'alpine_nature'
  | 'cyberpunk'
  | 'dark_horizon'
  | 'monochrome_slate';

export type ClockStyleId =
  | 'material_two_line'
  | 'digital_clean'
  | 'retro_flip'
  | 'minimal_stacked'
  | 'futuristic_hud';

export type ParticleDensity = 'off' | 'low' | 'balanced' | 'high' | 'storm';

export interface ThemeColors {
  skyTop: string;
  skyMiddle?: string;
  skyBottom: string;
  cloudTint: string;
  rainColor: string;
  snowColor: string;
  lightningColor: string;
  sunCorona: string;
  moonGlow: string;
  accentColor: string;
  surfaceGlass: string;
  textPrimary: string;
  textSecondary: string;
  // Natural landscape colors
  mountainDistant?: string;
  mountainMid?: string;
  forestColor?: string;
  foregroundLand?: string;
  waterColor?: string;
}

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  tagline: string;
  colors: ThemeColors;
  supportsAurora?: boolean;
  supportsShootingStars?: boolean;
  supportsPetals?: boolean;
  customAtmosphere?: string;
}

export interface WallpaperSettings {
  themeId: ThemePresetId;
  clockStyle: ClockStyleId;
  particleDensity: ParticleDensity;
  particleSpeed: number; // 0.5 to 2.0
  enableLightning: boolean;
  enableSunGlare: boolean;
  enableStars: boolean;
  enableAurora: boolean;
  enableParallax: boolean;
  parallaxSensitivity: number; // 0.1 to 1.0
  enableAudioAmbience: boolean;
  audioVolume: number; // 0.0 to 1.0
  batterySaver: boolean; // 30fps cap + reduced particles
  enableWildlife: boolean; // Birds flying home at sunset, morning flocks, night fireflies
  enableLandscape: boolean; // Mountains, trees, lake, natural terrain
  tempUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'mph';
  timeFormat: '24h' | '12h';
  showWeatherWidget: boolean;
  widgetPosition: 'top' | 'middle';
  isLockScreenMode: boolean;
  fpsLimit: number;
}
