export type WeatherConditionType =
  | 'clear_day'
  | 'clear_night'
  | 'partly_cloudy_day'
  | 'partly_cloudy_night'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'blizzard'
  | 'hail';

export interface CurrentWeather {
  temperature: number; // Celsius
  apparentTemperature: number;
  humidity: number; // %
  isDay: boolean;
  precipitation: number; // mm
  rain: number; // mm
  snowfall: number; // cm
  weatherCode: number;
  condition: WeatherConditionType;
  conditionLabel: string;
  cloudCover: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGusts: number; // km/h
  pressure: number; // hPa
  uvIndex?: number;
  sunriseTime: string;
  sunsetTime: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitationProbability: number;
  condition: WeatherConditionType;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  condition: WeatherConditionType;
  temperatureMax: number;
  temperatureMin: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface LocationData {
  id: string | number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lastUpdated: string;
}
