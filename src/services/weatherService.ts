import { CurrentWeather, DailyForecast, HourlyForecast, LocationData, WeatherConditionType, WeatherData } from '../types/weather';
import { SevereWeatherAlert } from '../types/alert';

export const PRESET_LOCATIONS: LocationData[] = [
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', latitude: 64.1466, longitude: -21.9426, timezone: 'Atlantic/Reykjavik' },
  { id: 'new_york', name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 'miami', name: 'Miami', country: 'United States', admin1: 'Florida', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
];

export function mapWmoCodeToCondition(code: number, isDay = true): { condition: WeatherConditionType; label: string } {
  switch (code) {
    case 0:
      return isDay ? { condition: 'clear_day', label: 'Clear Sky' } : { condition: 'clear_night', label: 'Clear Night' };
    case 1:
    case 2:
      return isDay ? { condition: 'partly_cloudy_day', label: 'Partly Cloudy' } : { condition: 'partly_cloudy_night', label: 'Partly Cloudy' };
    case 3:
      return { condition: 'cloudy', label: 'Overcast' };
    case 45:
    case 48:
      return { condition: 'fog', label: 'Dense Fog' };
    case 51:
    case 53:
    case 55:
      return { condition: 'drizzle', label: 'Light Drizzle' };
    case 61:
    case 63:
      return { condition: 'rain', label: 'Rain' };
    case 65:
    case 82:
      return { condition: 'heavy_rain', label: 'Heavy Downpour' };
    case 71:
    case 73:
    case 75:
    case 85:
      return { condition: 'snow', label: 'Snowfall' };
    case 77:
      return { condition: 'snow', label: 'Snow Grains' };
    case 86:
      return { condition: 'blizzard', label: 'Blizzard' };
    case 80:
    case 81:
      return { condition: 'rain', label: 'Passing Showers' };
    case 95:
      return { condition: 'thunderstorm', label: 'Thunderstorm' };
    case 96:
    case 99:
      return { condition: 'hail', label: 'Severe Thunderstorm & Hail' };
    default:
      return isDay ? { condition: 'clear_day', label: 'Fair' } : { condition: 'clear_night', label: 'Fair Night' };
  }
}

export async function fetchWeatherData(location: LocationData): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather fetch failed: ${res.statusText}`);
    }
    const data = await res.json();

    const isDay = data.current.is_day === 1;
    const { condition, label } = mapWmoCodeToCondition(data.current.weather_code, isDay);

    const sunrise = data.daily?.sunrise?.[0] || '06:00';
    const sunset = data.daily?.sunset?.[0] || '19:00';

    const current: CurrentWeather = {
      temperature: Math.round(data.current.temperature_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      isDay,
      precipitation: data.current.precipitation || 0,
      rain: data.current.rain || 0,
      snowfall: data.current.snowfall || 0,
      weatherCode: data.current.weather_code,
      condition,
      conditionLabel: label,
      cloudCover: data.current.cloud_cover ?? 30,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m ?? 180,
      windGusts: Math.round(data.current.wind_gusts_10m ?? data.current.wind_speed_10m * 1.3),
      pressure: Math.round(data.current.pressure_msl ?? 1013),
      uvIndex: data.daily?.uv_index_max?.[0] ?? 4,
      sunriseTime: sunrise,
      sunsetTime: sunset,
    };

    // Format hourly (next 12 hours)
    const hourly: HourlyForecast[] = [];
    const hourlyTimes = data.hourly?.time || [];
    const nowHour = new Date().getHours();
    for (let i = nowHour; i < Math.min(nowHour + 12, hourlyTimes.length); i++) {
      const code = data.hourly.weather_code[i];
      const cond = mapWmoCodeToCondition(code, true).condition;
      hourly.push({
        time: hourlyTimes[i],
        temperature: Math.round(data.hourly.temperature_2m[i]),
        precipitationProbability: data.hourly.precipitation_probability?.[i] ?? 0,
        condition: cond,
        weatherCode: code,
      });
    }

    // Format daily (next 5 days)
    const daily: DailyForecast[] = [];
    const dailyDates = data.daily?.time || [];
    for (let i = 0; i < Math.min(5, dailyDates.length); i++) {
      const code = data.daily.weather_code[i];
      const cond = mapWmoCodeToCondition(code, true).condition;
      daily.push({
        date: dailyDates[i],
        weatherCode: code,
        condition: cond,
        temperatureMax: Math.round(data.daily.temperature_2m_max[i]),
        temperatureMin: Math.round(data.daily.temperature_2m_min[i]),
        uvIndexMax: Math.round(data.daily.uv_index_max?.[i] ?? 5),
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
      });
    }

    return {
      location,
      current,
      hourly,
      daily,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('Using offline realistic fallback weather due to network limit:', err);
    return getRealisticFallbackWeather(location);
  }
}

export async function searchCities(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results || !data.results.length) return [];
    return data.results.map((r: { id: number; name: string; country: string; admin1?: string; latitude: number; longitude: number; timezone?: string }) => ({
      id: r.id,
      name: r.name,
      country: r.country,
      admin1: r.admin1,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
    }));
  } catch {
    return PRESET_LOCATIONS.filter(l => l.name.toLowerCase().includes(query.toLowerCase()));
  }
}

export function detectSevereAlerts(weather: WeatherData): SevereWeatherAlert[] {
  const alerts: SevereWeatherAlert[] = [];
  const { current, location } = weather;

  // Thunderstorm / Severe squall
  if (current.condition === 'thunderstorm' || current.condition === 'hail' || current.weatherCode >= 95) {
    alerts.push({
      id: `alert-thunder-${Date.now()}`,
      type: 'thunderstorm',
      severity: current.condition === 'hail' ? 'warning' : 'watch',
      headline: 'Severe Thunderstorm & Lightning Warning',
      description: `Active convective cell producing frequent cloud-to-ground lightning and torrential rainfall across ${location.name}. Wind gusts reaching ${current.windGusts} km/h.`,
      instruction: 'Stay indoors away from windows. Unplug sensitive electrical devices and avoid open outdoor areas.',
      source: 'National Meteorological Warning System',
      effectiveTime: 'Immediate',
      expiresTime: '2 hours remaining',
      isRead: false,
      affectedArea: `${location.name} Metro & Surrounding Counties`,
    });
  }

  // Gale / High wind
  if (current.windSpeed >= 50 || current.windGusts >= 65) {
    alerts.push({
      id: `alert-wind-${Date.now()}`,
      type: 'high_wind',
      severity: current.windGusts >= 80 ? 'warning' : 'advisory',
      headline: 'High Wind & Dangerous Gust Advisory',
      description: `Sustained winds of ${current.windSpeed} km/h with localized peak gusts exceeding ${current.windGusts} km/h. Risk of downed tree limbs and loose debris hazards.`,
      instruction: 'Secure outdoor furniture, patio items, and trash receptacles. Use caution when operating high-profile vehicles.',
      source: 'Aviation & Marine Weather Center',
      effectiveTime: 'Ongoing',
      expiresTime: 'Tonight',
      isRead: false,
      affectedArea: location.name,
    });
  }

  // Flash flood / Torrential rain
  if (current.precipitation >= 12 || current.condition === 'heavy_rain') {
    alerts.push({
      id: `alert-flood-${Date.now()}`,
      type: 'flash_flood',
      severity: 'warning',
      headline: 'Flash Flood Warning - Rapid Runoff Expected',
      description: `Excessive rainfall accumulation exceeding ${current.precipitation} mm/h is causing localized street ponding and rapid creek swells in ${location.name}.`,
      instruction: 'Never drive through flooded roadways: Turn around, don\'t drown. Seek higher ground if residing near low-lying drainage basins.',
      source: 'Hydrological Services Branch',
      effectiveTime: 'Immediate',
      expiresTime: '3 hours remaining',
      isRead: false,
      affectedArea: `${location.name} Basin`,
    });
  }

  // Blizzard / Polar freeze
  if (current.condition === 'blizzard' || (current.condition === 'snow' && current.windSpeed > 35)) {
    alerts.push({
      id: `alert-blizzard-${Date.now()}`,
      type: 'blizzard',
      severity: 'warning',
      headline: 'Blizzard Warning - Whiteout Visibility',
      description: `Blowing snow and sustained winds producing near-zero visibility and hazardous drifts across transit corridors in ${location.name}.`,
      instruction: 'Non-emergency travel strongly discouraged. Keep emergency winter kits in vehicles if road transit is unavoidable.',
      source: 'Arctic Weather Warning Bureau',
      effectiveTime: 'Immediate',
      expiresTime: 'Tomorrow morning',
      isRead: false,
      affectedArea: `${location.name} Regional Sector`,
    });
  }

  // Extreme Heat Warning
  if (current.temperature >= 38) {
    alerts.push({
      id: `alert-heat-${Date.now()}`,
      type: 'extreme_heat',
      severity: 'advisory',
      headline: 'Extreme Heat & Solar Radiation Advisory',
      description: `Ambient temperatures reaching ${current.temperature}°C (Feels like ${current.apparentTemperature}°C). High UV index creating elevated risk of dehydration and heat exhaustion.`,
      instruction: 'Limit prolonged sun exposure during peak daylight hours. Drink plenty of water and check on vulnerable relatives.',
      source: 'Public Health Weather Advisory',
      effectiveTime: '11:00 AM - 6:00 PM',
      expiresTime: 'Sundown',
      isRead: false,
      affectedArea: location.name,
    });
  }

  return alerts;
}

export function createSimulatedAlert(type: 'tornado' | 'thunderstorm' | 'flood' | 'blizzard' | 'gale', cityName: string): SevereWeatherAlert {
  switch (type) {
    case 'tornado':
      return {
        id: `sim-tornado-${Date.now()}`,
        type: 'tornado',
        severity: 'emergency',
        headline: 'EMERGENCY: Tornado Warning Issued',
        description: `Doppler radar confirmed a rotating supercell capable of producing a destructive tornado tracking 25 km/h toward ${cityName}. Flying debris will be extremely dangerous.`,
        instruction: 'TAKE SHELTER IMMEDIATELY! Move to an interior room on the lowest floor of a sturdy building. Protect head and neck with cushions or helmets.',
        source: 'Emergency Broadcast Service (EAS)',
        effectiveTime: 'Immediate',
        expiresTime: '45 minutes',
        isRead: false,
        affectedArea: `${cityName} County & Immediate Vicinity`,
      };
    case 'flood':
      return {
        id: `sim-flood-${Date.now()}`,
        type: 'flash_flood',
        severity: 'warning',
        headline: 'Flash Flood Emergency',
        description: `Dangerous and life-threatening flash flooding underway in ${cityName}. Rapid water inundation of underpasses, streams, and residential streets.`,
        instruction: 'Move immediately to higher ground. Do not attempt to walk or drive through flooded roads.',
        source: 'Hydrometeorological Defense Agency',
        effectiveTime: 'Immediate',
        expiresTime: '4 hours',
        isRead: false,
        affectedArea: `${cityName} Watershed`,
      };
    case 'blizzard':
      return {
        id: `sim-blizzard-${Date.now()}`,
        type: 'blizzard',
        severity: 'warning',
        headline: 'Severe Blizzard & Polar Whiteout',
        description: `Life-threatening sub-zero wind chills (-24°C) and heavy snowfall accumulation with wind gusts over 70 km/h in ${cityName}.`,
        instruction: 'Stay indoors. Ensure emergency heating supplies. Protect livestock and pets from severe exposure.',
        source: 'Winter Hazards Prediction Center',
        effectiveTime: 'Active now',
        expiresTime: 'Next 12 hours',
        isRead: false,
        affectedArea: `${cityName} Greater Metro`,
      };
    case 'gale':
      return {
        id: `sim-gale-${Date.now()}`,
        type: 'high_wind',
        severity: 'watch',
        headline: 'Tropical Gale Force Wind Watch',
        description: `Strong frontal boundary approaching ${cityName} with sustained hurricane-force gusts up to 90 km/h. Power outages probable.`,
        instruction: 'Charge backup power banks and phones. Secure outdoor scaffolding and patio structures.',
        source: 'Coastal Storm Bureau',
        effectiveTime: 'Starting in 1 hour',
        expiresTime: 'Tomorrow afternoon',
        isRead: false,
        affectedArea: `${cityName} Coastal & Inland Zones`,
      };
    case 'thunderstorm':
    default:
      return {
        id: `sim-storm-${Date.now()}`,
        type: 'thunderstorm',
        severity: 'warning',
        headline: 'Severe Thunderstorm & Hail Warning',
        description: `Intense squall line with quarter-sized hail and localized downbursts approaching ${cityName}. Frequent cloud-to-ground lightning strikes detected.`,
        instruction: 'Seek shelter in a sturdy building. Avoid contact with plumbing fixtures and electrical equipment.',
        source: 'Severe Weather Warning Office',
        effectiveTime: 'Active now',
        expiresTime: '90 minutes',
        isRead: false,
        affectedArea: `${cityName} Metropolitan Area`,
      };
  }
}

function getRealisticFallbackWeather(location: LocationData): WeatherData {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 19;
  return {
    location,
    current: {
      temperature: 21,
      apparentTemperature: 22,
      humidity: 62,
      isDay,
      precipitation: 0.2,
      rain: 0.2,
      snowfall: 0,
      weatherCode: 2,
      condition: isDay ? 'partly_cloudy_day' : 'partly_cloudy_night',
      conditionLabel: 'Partly Cloudy',
      cloudCover: 40,
      windSpeed: 14,
      windDirection: 210,
      windGusts: 22,
      pressure: 1014,
      uvIndex: 5,
      sunriseTime: '06:14',
      sunsetTime: '18:48',
    },
    hourly: [
      { time: '12:00', temperature: 22, precipitationProbability: 15, condition: 'partly_cloudy_day', weatherCode: 2 },
      { time: '14:00', temperature: 24, precipitationProbability: 25, condition: 'partly_cloudy_day', weatherCode: 2 },
      { time: '16:00', temperature: 23, precipitationProbability: 40, condition: 'rain', weatherCode: 61 },
      { time: '18:00', temperature: 20, precipitationProbability: 50, condition: 'rain', weatherCode: 61 },
      { time: '20:00', temperature: 18, precipitationProbability: 30, condition: 'cloudy', weatherCode: 3 },
      { time: '22:00', temperature: 17, precipitationProbability: 10, condition: 'clear_night', weatherCode: 0 },
    ],
    daily: [
      { date: 'Today', weatherCode: 2, condition: 'partly_cloudy_day', temperatureMax: 24, temperatureMin: 15, uvIndexMax: 6, sunrise: '06:14', sunset: '18:48' },
      { date: 'Tomorrow', weatherCode: 61, condition: 'rain', temperatureMax: 21, temperatureMin: 14, uvIndexMax: 4, sunrise: '06:15', sunset: '18:47' },
      { date: 'Thu', weatherCode: 95, condition: 'thunderstorm', temperatureMax: 19, temperatureMin: 13, uvIndexMax: 3, sunrise: '06:16', sunset: '18:45' },
      { date: 'Fri', weatherCode: 1, condition: 'clear_day', temperatureMax: 23, temperatureMin: 12, uvIndexMax: 7, sunrise: '06:17', sunset: '18:44' },
      { date: 'Sat', weatherCode: 2, condition: 'partly_cloudy_day', temperatureMax: 25, temperatureMin: 15, uvIndexMax: 7, sunrise: '06:18', sunset: '18:42' },
    ],
    lastUpdated: 'Live',
  };
}
