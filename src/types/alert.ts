export type AlertSeverity = 'advisory' | 'watch' | 'warning' | 'emergency';

export type AlertType =
  | 'thunderstorm'
  | 'tornado'
  | 'flash_flood'
  | 'high_wind'
  | 'blizzard'
  | 'extreme_heat'
  | 'extreme_cold'
  | 'air_quality'
  | 'hail';

export interface SevereWeatherAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  headline: string;
  description: string;
  instruction: string;
  source: string;
  effectiveTime: string;
  expiresTime: string;
  isRead: boolean;
  affectedArea: string;
}

export interface AlertThresholdSettings {
  enableAlerts: boolean;
  enableSound: boolean;
  enableWebNotifications: boolean;
  highWindThreshold: number; // km/h
  heavyRainThreshold: number; // mm/h
  extremeHeatThreshold: number; // °C
  extremeColdThreshold: number; // °C
}
