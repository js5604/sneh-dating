import React, { useEffect, useRef } from 'react';
import { CurrentWeather } from '../types/weather';
import { ThemePreset, WallpaperSettings } from '../types/theme';
import { weatherAudio } from '../utils/audioEngine';

interface WeatherCanvasProps {
  weather: CurrentWeather;
  theme: ThemePreset;
  settings: WallpaperSettings;
  customTimeHour?: number;
  onTapWallpaper?: (x: number, y: number) => void;
}

// 3D Bird with depth perspective
interface RealisticBird {
  x: number;
  y: number;
  z: number; // 0 (near) to 800 (distant)
  vx: number;
  vy: number;
  vz: number;
  wingAngle: number;
  wingSpeed: number;
  glideCounter: number;
  isGliding: boolean;
  scale: number;
}

// Wet glass water bead/drip on camera lens
interface ScreenGlassDroplet {
  x: number;
  y: number;
  radius: number;
  tailLength: number;
  speed: number;
  isTrickling: boolean;
  alpha: number;
}

interface LakeRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface RainParticle {
  x: number;
  y: number;
  z: number; // depth
  speed: number;
  length: number;
}

interface VolumetricCloud {
  x: number;
  y: number;
  speed: number;
  scale: number;
  opacity: number;
  puffs: Array<{ dx: number; dy: number; r: number; shade: number }>;
}

export const WeatherCanvas: React.FC<WeatherCanvasProps> = ({
  weather,
  theme,
  settings,
  customTimeHour,
  onTapWallpaper,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const mouseTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Offscreen pre-rendered terrain layers for fast photorealistic composite
  const mountainOffscreenRef = useRef<HTMLCanvasElement | null>(null);
  const midHillsOffscreenRef = useRef<HTMLCanvasElement | null>(null);
  const foregroundOffscreenRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Simulation arrays
  const birdsRef = useRef<RealisticBird[]>([]);
  const screenDropletsRef = useRef<ScreenGlassDroplet[]>([]);
  const lakeRipplesRef = useRef<LakeRipple[]>([]);
  const rainRef = useRef<RainParticle[]>([]);
  const cloudsRef = useRef<VolumetricCloud[]>([]);

  // Natural state
  const windWaveRef = useRef<number>(0);
  const lightningActiveRef = useRef<boolean>(false);
  const lightningOpacityRef = useRef<number>(0);
  const nextLightningTimeRef = useRef<number>(Date.now() + 4000);

  // Time calculations
  const parseTimeString = (timeStr?: string, defaultH = 6) => {
    if (!timeStr) return defaultH;
    try {
      const parts = timeStr.includes('T') ? timeStr.split('T')[1].split(':') : timeStr.split(':');
      if (parts.length >= 2) return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
    } catch {
      // fallback
    }
    return defaultH;
  };

  const sunriseHour = parseTimeString(weather.sunriseTime, 6.2);
  const sunsetHour = parseTimeString(weather.sunsetTime, 18.8);

  const now = new Date();
  const effectiveHour = customTimeHour !== undefined
    ? customTimeHour
    : now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

  const isSunUp = effectiveHour >= sunriseHour && effectiveHour <= sunsetHour;
  const isNight = effectiveHour < sunriseHour - 0.75 || effectiveHour > sunsetHour + 0.75;
  const isSunset = Math.abs(effectiveHour - sunsetHour) <= 1.2;
  const isSunrise = Math.abs(effectiveHour - sunriseHour) <= 1.0;

  // Sync atmospheric audio
  useEffect(() => {
    if (settings.enableAudioAmbience) {
      weatherAudio.setMuted(false);
      weatherAudio.setVolume(settings.audioVolume);
      const intensity = weather.condition === 'heavy_rain' ? 0.9 : weather.condition === 'rain' ? 0.5 : 0.2;
      weatherAudio.updateWeatherAmbience(weather.condition, intensity, weather.windSpeed);
    } else {
      weatherAudio.setMuted(true);
    }
  }, [settings.enableAudioAmbience, settings.audioVolume, weather.condition, weather.windSpeed]);

  // Handle device orientation for 3D parallax
  useEffect(() => {
    if (!settings.enableParallax) return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const tiltX = Math.max(-1, Math.min(1, e.gamma / 25));
        const tiltY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        mouseTiltRef.current = {
          x: tiltX * settings.parallaxSensitivity,
          y: tiltY * settings.parallaxSensitivity,
        };
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [settings.enableParallax, settings.parallaxSensitivity]);

  // Build Procedural Photorealistic Terrain Texture Canvases
  const buildRealisticTerrainLayers = (w: number, h: number) => {
    // 1. Far Alpine Mountain Range with snowcaps & crag shading
    const mountC = document.createElement('canvas');
    mountC.width = w;
    mountC.height = h;
    const mCtx = mountC.getContext('2d');
    if (mCtx) {
      // Procedural alpine ridgeline using multi-frequency fractals
      const baseY = h * 0.44;
      const peaks = [
        { x: 0, y: baseY + 20 },
        { x: w * 0.12, y: baseY - 40 },
        { x: w * 0.26, y: baseY - 120 }, // High Peak 1
        { x: w * 0.38, y: baseY - 60 },
        { x: w * 0.52, y: baseY - 150 }, // Giant Center Peak
        { x: w * 0.65, y: baseY - 80 },
        { x: w * 0.78, y: baseY - 130 }, // High Peak 2
        { x: w * 0.9, y: baseY - 30 },
        { x: w, y: baseY + 10 },
      ];

      // Draw rock face gradient
      mCtx.save();
      const rockGrad = mCtx.createLinearGradient(0, baseY - 150, 0, baseY + 60);
      rockGrad.addColorStop(0, '#334155');
      rockGrad.addColorStop(0.4, '#1e293b');
      rockGrad.addColorStop(0.8, '#0f172a');
      rockGrad.addColorStop(1, '#020617');

      mCtx.fillStyle = rockGrad;
      mCtx.beginPath();
      mCtx.moveTo(0, h * 0.65);
      mCtx.lineTo(peaks[0].x, peaks[0].y);

      // Micro-crag interpolation
      for (let i = 0; i < peaks.length - 1; i++) {
        const p1 = peaks[i];
        const p2 = peaks[i + 1];
        const subSteps = 6;
        for (let s = 1; s <= subSteps; s++) {
          const t = s / subSteps;
          const mx = p1.x + (p2.x - p1.x) * t;
          const rough = (Math.sin(mx * 0.08) * 8 + Math.cos(mx * 0.18) * 4);
          const my = p1.y + (p2.y - p1.y) * t + rough;
          mCtx.lineTo(mx, my);
        }
      }
      mCtx.lineTo(w, h * 0.65);
      mCtx.closePath();
      mCtx.fill();

      // Shaded crags & rock fissures (facet lighting)
      mCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      mCtx.lineWidth = 1.5;
      for (let rx = 10; rx < w; rx += 22) {
        const topY = baseY - 80 + Math.sin(rx * 0.04) * 50;
        mCtx.beginPath();
        mCtx.moveTo(rx, topY);
        mCtx.lineTo(rx - 15 + Math.sin(rx) * 10, topY + 60 + Math.cos(rx) * 20);
        mCtx.stroke();
      }

      // Snowcap layer with realistic altitude cutoff
      mCtx.fillStyle = '#f8fafc';
      for (const p of [peaks[2], peaks[4], peaks[6]]) {
        mCtx.beginPath();
        mCtx.moveTo(p.x - 35, p.y + 40);
        mCtx.lineTo(p.x, p.y);
        mCtx.lineTo(p.x + 35, p.y + 45);
        mCtx.lineTo(p.x + 20, p.y + 55);
        mCtx.lineTo(p.x + 5, p.y + 42);
        mCtx.lineTo(p.x - 12, p.y + 52);
        mCtx.closePath();
        mCtx.fill();
      }
      mCtx.restore();
    }
    mountainOffscreenRef.current = mountC;

    // 2. Midground Forested Hills & Conifer Ridge
    const midC = document.createElement('canvas');
    midC.width = w;
    midC.height = h;
    const midCtx = midC.getContext('2d');
    if (midCtx) {
      midCtx.save();
      const forestGrad = midCtx.createLinearGradient(0, h * 0.48, 0, h * 0.64);
      forestGrad.addColorStop(0, '#0f291e');
      forestGrad.addColorStop(0.5, '#091c14');
      forestGrad.addColorStop(1, '#05110c');

      midCtx.fillStyle = forestGrad;
      midCtx.beginPath();
      midCtx.moveTo(0, h * 0.65);
      midCtx.lineTo(0, h * 0.54);
      midCtx.quadraticCurveTo(w * 0.3, h * 0.50, w * 0.55, h * 0.54);
      midCtx.quadraticCurveTo(w * 0.8, h * 0.58, w, h * 0.52);
      midCtx.lineTo(w, h * 0.65);
      midCtx.closePath();
      midCtx.fill();

      // Dense pine tree ridge silhouette with realistic serrated crowns
      midCtx.fillStyle = '#06160f';
      for (let x = 0; x < w; x += 6) {
        const treeH = 12 + (Math.sin(x * 0.1) * 5 + Math.cos(x * 0.25) * 3);
        const yBase = h * 0.54 + Math.sin(x * 0.01) * 15;
        midCtx.beginPath();
        midCtx.moveTo(x - 3, yBase);
        midCtx.lineTo(x, yBase - treeH);
        midCtx.lineTo(x + 3, yBase);
        midCtx.closePath();
        midCtx.fill();
      }
      midCtx.restore();
    }
    midHillsOffscreenRef.current = midC;

    // 3. Foreground Shoreline, Granite Boulders & High-Detail Evergreen Pines
    const foreC = document.createElement('canvas');
    foreC.width = w;
    foreC.height = h;
    const foreCtx = foreC.getContext('2d');
    if (foreCtx) {
      foreCtx.save();
      const landGrad = foreCtx.createLinearGradient(0, h * 0.68, 0, h);
      landGrad.addColorStop(0, '#0b1d14');
      landGrad.addColorStop(0.4, '#07150e');
      landGrad.addColorStop(1, '#030a07');

      foreCtx.fillStyle = landGrad;
      foreCtx.beginPath();
      foreCtx.moveTo(0, h);
      foreCtx.lineTo(0, h * 0.72);
      foreCtx.bezierCurveTo(w * 0.3, h * 0.69, w * 0.6, h * 0.74, w, h * 0.71);
      foreCtx.lineTo(w, h);
      foreCtx.closePath();
      foreCtx.fill();

      // Granite shoreline boulders & textures
      foreCtx.fillStyle = '#1e293b';
      foreCtx.beginPath();
      foreCtx.ellipse(w * 0.28, h * 0.73, 24, 10, -0.1, 0, Math.PI * 2);
      foreCtx.ellipse(w * 0.65, h * 0.74, 32, 12, 0.15, 0, Math.PI * 2);
      foreCtx.fill();

      // Detailed Realistic Pine Trees on Foreground Banks
      const drawPhotorealisticPine = (x: number, y: number, height: number) => {
        // Wood trunk
        foreCtx.fillStyle = '#1c1917';
        foreCtx.fillRect(x - 3, y - height * 0.35, 6, height * 0.35);

        // Organic branch tiers with textured needle clusters
        const tiers = 5;
        const colors = ['#062315', '#082d1c', '#0a3622', '#0e422a'];
        for (let t = 0; t < tiers; t++) {
          const tierY = y - (height * (0.25 + t * 0.15));
          const tierW = height * (0.45 - t * 0.07);
          foreCtx.fillStyle = colors[t % colors.length];

          // Serrated foliage shape
          foreCtx.beginPath();
          foreCtx.moveTo(x - tierW / 2, tierY);
          foreCtx.quadraticCurveTo(x - tierW * 0.25, tierY - 8, x, tierY - height * 0.22);
          foreCtx.quadraticCurveTo(x + tierW * 0.25, tierY - 8, x + tierW / 2, tierY);
          foreCtx.quadraticCurveTo(x, tierY + 4, x - tierW / 2, tierY);
          foreCtx.closePath();
          foreCtx.fill();
        }
      };

      drawPhotorealisticPine(w * 0.14, h * 0.82, 140);
      drawPhotorealisticPine(w * 0.25, h * 0.86, 105);
      drawPhotorealisticPine(w * 0.04, h * 0.88, 160);
      drawPhotorealisticPine(w * 0.88, h * 0.83, 145);
      drawPhotorealisticPine(w * 0.76, h * 0.86, 115);

      foreCtx.restore();
    }
    foregroundOffscreenRef.current = foreC;
    offscreenSizeRef.current = { w, h };
  };

  // Initialize Dynamic Entities
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth || 360;
    const h = canvas.clientHeight || 780;

    // 1. Realistic Volumetric Clouds
    const cloudCount = Math.min(Math.floor((weather.cloudCover / 100) * 8) + 4, 10);
    const newClouds: VolumetricCloud[] = [];
    for (let c = 0; c < cloudCount; c++) {
      const puffs: Array<{ dx: number; dy: number; r: number; shade: number }> = [];
      const numPuffs = 9 + Math.floor(Math.random() * 6);
      for (let p = 0; p < numPuffs; p++) {
        puffs.push({
          dx: (Math.random() - 0.5) * 160,
          dy: (Math.random() - 0.5) * 50,
          r: Math.random() * 45 + 30,
          shade: Math.random() * 0.25,
        });
      }
      newClouds.push({
        x: Math.random() * (w + 400) - 200,
        y: Math.random() * (h * 0.32) + 20,
        scale: Math.random() * 0.5 + 0.8,
        speed: (Math.random() * 0.2 + 0.1) * (weather.windSpeed / 15 + 0.6),
        opacity: Math.random() * 0.25 + 0.45,
        puffs,
      });
    }
    cloudsRef.current = newClouds;

    // 2. Realistic 3D Birds (Flocking home at sunset!)
    const birdsList: RealisticBird[] = [];
    const isStormy = weather.condition.includes('rain') || weather.condition.includes('thunder') || weather.condition === 'blizzard';
    if (settings.enableWildlife && !isStormy) {
      // Heavy flocking at sunset (birds returning to mountain trees)
      const count = isSunset ? 18 : isSunrise ? 10 : 6;
      for (let b = 0; b < count; b++) {
        const flockIndex = Math.floor(b / 6);
        const zDepth = Math.random() * 500 + 100; // 3D depth

        birdsList.push({
          x: (b % 6) * -35 - (flockIndex * 150) + (Math.random() * 30),
          // At sunset, birds head across the sky descending towards the mountain valley roosts
          y: isSunset ? (h * 0.15) + (b * 8) + (Math.random() * 20) : (h * 0.18) + (Math.random() * 60),
          z: zDepth,
          vx: isSunset ? 1.8 + Math.random() * 0.4 : 1.3 + Math.random() * 0.5,
          vy: isSunset ? 0.22 + Math.random() * 0.12 : (Math.random() - 0.5) * 0.15,
          vz: (Math.random() - 0.5) * 0.2,
          wingAngle: Math.random() * Math.PI * 2,
          wingSpeed: 0.18 + Math.random() * 0.08,
          glideCounter: 0,
          isGliding: false,
          scale: Math.max(0.4, 1.2 - zDepth / 600),
        });
      }
    }
    birdsRef.current = birdsList;

    // 3. Realistic Rain with Screen Droplets (Wet Glass Effect)
    const isRainy = weather.condition.includes('rain') || weather.condition.includes('drizzle') || weather.condition.includes('thunderstorm');
    const rainCount = isRainy ? (weather.condition === 'heavy_rain' ? 240 : 120) : 0;
    const newRain: RainParticle[] = [];
    for (let r = 0; r < rainCount; r++) {
      newRain.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 300,
        speed: Math.random() * 12 + 16,
        length: Math.random() * 20 + 16,
      });
    }
    rainRef.current = newRain;

    // Screen Glass Rain Droplets (Condensation & Trickles)
    const droplets: ScreenGlassDroplet[] = [];
    if (isRainy) {
      const dropCount = weather.condition === 'heavy_rain' ? 45 : 22;
      for (let d = 0; d < dropCount; d++) {
        droplets.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3.5 + 2.0,
          tailLength: Math.random() * 25,
          speed: Math.random() * 1.5 + 0.5,
          isTrickling: Math.random() > 0.6,
          alpha: Math.random() * 0.4 + 0.45,
        });
      }
    }
    screenDropletsRef.current = droplets;
  }, [weather.condition, weather.cloudCover, weather.windSpeed, isSunset, isSunrise, settings.enableWildlife]);

  // Main 60fps Photorealistic Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    if (settings.batterySaver) dpr = Math.min(dpr, 1.25);

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const displayW = Math.floor(rect.width * dpr);
      const displayH = Math.floor(rect.height * dpr);

      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
        buildRealisticTerrainLayers(displayW, displayH);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const w = canvas.width;
      const h = canvas.height;

      if (!mountainOffscreenRef.current || offscreenSizeRef.current.w !== w) {
        buildRealisticTerrainLayers(w, h);
      }

      windWaveRef.current += delta * (1.2 + weather.windSpeed / 15);
      const windDrift = Math.sin(windWaveRef.current) * (3 * dpr);

      // 3D Tilt Parallax offsets
      const tiltX = mouseTiltRef.current.x * 24 * dpr;
      const tiltY = mouseTiltRef.current.y * 24 * dpr;

      // -------------------------------------------------------------
      // 1. PHOTOREALISTIC SKY DOME (Rayleigh Atmospheric Light)
      // -------------------------------------------------------------
      let skyZenith = '#1d4ed8';
      let skyHorizon = '#93c5fd';

      if (isSunrise) {
        skyZenith = '#2e1065';
        skyHorizon = '#fb923c';
      } else if (isSunset) {
        // Fiery golden hour & dusk
        skyZenith = '#3b0764';
        skyHorizon = '#f97316';
      } else if (isNight) {
        skyZenith = '#020617';
        skyHorizon = '#0f172a';
      } else {
        if (weather.condition === 'thunderstorm' || weather.condition === 'heavy_rain') {
          skyZenith = '#1e293b';
          skyHorizon = '#475569';
        } else if (weather.condition === 'cloudy' || weather.condition === 'fog') {
          skyZenith = '#475569';
          skyHorizon = '#94a3b8';
        }
      }

      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      skyGrad.addColorStop(0, skyZenith);
      skyGrad.addColorStop(0.6, isSunset ? '#c026d3' : isSunrise ? '#db2777' : skyZenith);
      skyGrad.addColorStop(1, skyHorizon);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // -------------------------------------------------------------
      // 2. CELESTIAL SUN / MOON & ATMOSPHERIC GOD RAYS
      // -------------------------------------------------------------
      ctx.save();
      ctx.translate(tiltX * 0.25, tiltY * 0.25);

      if (isSunUp) {
        const dayDuration = Math.max(1, sunsetHour - sunriseHour);
        const dayProg = Math.max(0, Math.min(1, (effectiveHour - sunriseHour) / dayDuration));
        const sunAngle = dayProg * Math.PI;
        const sunX = w * 0.15 + (w * 0.7) * (1 - Math.cos(sunAngle)) / 2;
        const sunY = (h * 0.58) - Math.sin(sunAngle) * (h * 0.38);

        // Volumetric Crepuscular Sun Rays
        if (!weather.condition.includes('cloudy') && !weather.condition.includes('rain')) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          for (let ray = 0; ray < 5; ray++) {
            const rayAngle = (ray - 2) * 0.28 + Math.PI / 2;
            const rayLength = h * 0.7;
            const rayGrad = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(rayAngle) * rayLength, sunY + Math.sin(rayAngle) * rayLength);
            rayGrad.addColorStop(0, isSunset ? 'rgba(251, 146, 60, 0.35)' : 'rgba(255, 245, 180, 0.3)');
            rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = rayGrad;
            ctx.beginPath();
            ctx.moveTo(sunX, sunY);
            ctx.lineTo(sunX + Math.cos(rayAngle - 0.08) * rayLength, sunY + Math.sin(rayAngle - 0.08) * rayLength);
            ctx.lineTo(sunX + Math.cos(rayAngle + 0.08) * rayLength, sunY + Math.sin(rayAngle + 0.08) * rayLength);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }

        // Sun Flare Corona & Core
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 12 * dpr, sunX, sunY, 140 * dpr);
        sunGlow.addColorStop(0, isSunset ? 'rgba(251, 146, 60, 0.95)' : 'rgba(255, 235, 150, 0.95)');
        sunGlow.addColorStop(0.4, isSunset ? 'rgba(244, 63, 94, 0.35)' : 'rgba(255, 240, 180, 0.3)');
        sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 140 * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = isSunset ? 'rgba(251, 146, 60, 1)' : 'rgba(255, 220, 120, 1)';
        ctx.shadowBlur = 25 * dpr;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 22 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Photorealistic Moon with Atmospheric Halo
        const moonX = w * 0.76;
        const moonY = h * 0.22;

        const moonHalo = ctx.createRadialGradient(moonX, moonY, 10 * dpr, moonX, moonY, 80 * dpr);
        moonHalo.addColorStop(0, 'rgba(224, 231, 255, 0.6)');
        moonHalo.addColorStop(1, 'rgba(224, 231, 255, 0)');
        ctx.fillStyle = moonHalo;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 80 * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 14 * dpr;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 20 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(moonX - 8 * dpr, moonY - 3 * dpr, 18 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 3. VOLUMETRIC REAL CLOUDS (Atmospheric Shading)
      // -------------------------------------------------------------
      ctx.save();
      ctx.translate(tiltX * 0.4, tiltY * 0.4);
      for (const cloud of cloudsRef.current) {
        cloud.x += cloud.speed * dpr * (delta * 60);
        if (cloud.x > w + 200 * dpr) cloud.x = -200 * dpr;

        for (const puff of cloud.puffs) {
          const px = cloud.x + puff.dx * cloud.scale * dpr;
          const py = cloud.y * dpr + puff.dy * cloud.scale * dpr;
          const pr = puff.r * cloud.scale * dpr;

          const puffGrad = ctx.createRadialGradient(px, py - pr * 0.2, pr * 0.1, px, py, pr);
          if (isSunset) {
            puffGrad.addColorStop(0, 'rgba(254, 215, 170, 0.7)');
            puffGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');
          } else if (isNight) {
            puffGrad.addColorStop(0, 'rgba(148, 163, 184, 0.25)');
            puffGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
          } else if (weather.condition === 'thunderstorm' || weather.condition === 'heavy_rain') {
            puffGrad.addColorStop(0, 'rgba(71, 85, 105, 0.75)');
            puffGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
          } else {
            puffGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
            puffGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          }

          ctx.fillStyle = puffGrad;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 4. PHOTOREALISTIC LANDSCAPE COMPOSITING (Mountains, Mid Hills)
      // -------------------------------------------------------------
      if (settings.enableLandscape) {
        // Far Mountains (depth plane 1)
        if (mountainOffscreenRef.current) {
          ctx.save();
          ctx.translate(tiltX * 0.35, tiltY * 0.35);

          // Apply natural lighting tone
          if (isSunset) {
            ctx.filter = 'brightness(1.1) sepia(0.3) hue-rotate(-25deg)';
          } else if (isNight) {
            ctx.filter = 'brightness(0.35) contrast(1.2)';
          } else if (weather.condition === 'heavy_rain' || weather.condition === 'thunderstorm') {
            ctx.filter = 'brightness(0.65) saturate(0.7)';
          }
          ctx.drawImage(mountainOffscreenRef.current, 0, 0);
          ctx.restore();
        }

        // Midground Forest Hills (depth plane 2)
        if (midHillsOffscreenRef.current) {
          ctx.save();
          ctx.translate(tiltX * 0.2, tiltY * 0.2);
          if (isSunset) {
            ctx.filter = 'brightness(0.9) sepia(0.2)';
          } else if (isNight) {
            ctx.filter = 'brightness(0.3)';
          }
          ctx.drawImage(midHillsOffscreenRef.current, 0, 0);
          ctx.restore();
        }

        // -------------------------------------------------------------
        // 5. REFLECTIVE ALPINE WATER BODY (Lake with Waves & Ripples)
        // -------------------------------------------------------------
        const lakeY = h * 0.61;
        const lakeH = h * 0.17;

        ctx.save();
        const waterGrad = ctx.createLinearGradient(0, lakeY, 0, lakeY + lakeH);
        waterGrad.addColorStop(0, isSunset ? '#4a044e' : isNight ? '#050c1e' : '#1e3a8a');
        waterGrad.addColorStop(0.5, isSunset ? '#701a75' : isNight ? '#09152e' : '#1d4ed8');
        waterGrad.addColorStop(1, isSunset ? '#a21caf' : isNight ? '#0f172a' : '#2563eb');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, lakeY, w, lakeH);

        // Water surface horizontal wave reflections
        ctx.strokeStyle = isSunset ? 'rgba(253, 186, 116, 0.35)' : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1 * dpr;
        for (let wy = lakeY + 4 * dpr; wy < lakeY + lakeH; wy += 6 * dpr) {
          const waveShift = Math.sin((wy * 0.05) + windWaveRef.current) * 12 * dpr;
          ctx.beginPath();
          ctx.moveTo(w * 0.15 + waveShift, wy);
          ctx.lineTo(w * 0.85 + waveShift, wy);
          ctx.stroke();
        }

        // Rain impact ripples on lake surface
        for (let r = lakeRipplesRef.current.length - 1; r >= 0; r--) {
          const rip = lakeRipplesRef.current[r];
          rip.radius += rip.speed;
          rip.opacity -= 0.02;

          if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
            lakeRipplesRef.current.splice(r, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${rip.opacity * 0.7})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.radius * 2.2, rip.radius * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Foreground Granite Shore & Pine Trees (depth plane 3)
        if (foregroundOffscreenRef.current) {
          ctx.save();
          ctx.translate(tiltX * 0.1 + windDrift * 0.2, tiltY * 0.1);
          if (isSunset) {
            ctx.filter = 'brightness(0.85) sepia(0.2)';
          } else if (isNight) {
            ctx.filter = 'brightness(0.25)';
          }
          ctx.drawImage(foregroundOffscreenRef.current, 0, 0);
          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // 6. NATURE CREATURES: 3D BIRDS FLOCKING HOME AT SUNSET
      // -------------------------------------------------------------
      if (settings.enableWildlife && birdsRef.current.length > 0) {
        ctx.save();
        for (const bird of birdsRef.current) {
          bird.wingAngle += bird.wingSpeed;
          bird.x += bird.vx * dpr * (delta * 60);
          bird.y += bird.vy * dpr * (delta * 60);
          bird.z += bird.vz * dpr * (delta * 60);

          // Wrap-around screen
          if (bird.x > w + 60 * dpr) {
            bird.x = -60 * dpr;
            bird.y = isSunset ? h * 0.16 + Math.random() * 80 * dpr : h * 0.2 + Math.random() * 120 * dpr;
          }

          // In sunset, birds steadily glide down to roost in the mountain pine trees
          if (isSunset && bird.y < h * 0.62) {
            bird.y += 0.12 * dpr;
          }

          // Perspective scaling
          const perspectiveScale = bird.scale * dpr;
          const wingSpan = 9 * perspectiveScale;
          const flap = Math.sin(bird.wingAngle) * (6 * perspectiveScale);

          ctx.fillStyle = isSunset ? '#1a0628' : isNight ? '#0b1120' : '#1e293b';
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 1.6 * perspectiveScale;
          ctx.lineCap = 'round';

          // Realistic Avian Silhouette with Body & Wings
          ctx.beginPath();
          // Left wing
          ctx.moveTo(bird.x - wingSpan, bird.y + flap);
          ctx.quadraticCurveTo(bird.x - wingSpan * 0.4, bird.y - flap * 0.5, bird.x, bird.y);
          // Right wing
          ctx.quadraticCurveTo(bird.x + wingSpan * 0.4, bird.y - flap * 0.5, bird.x + wingSpan, bird.y + flap);
          ctx.stroke();

          // Small aerodynamic bird torso
          ctx.beginPath();
          ctx.ellipse(bird.x, bird.y, 2.5 * perspectiveScale, 1.2 * perspectiveScale, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 7. REAL RAIN PARTICLES & WATER IMPACTS
      // -------------------------------------------------------------
      if (rainRef.current.length > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(219, 234, 254, 0.75)';
        ctx.lineCap = 'round';
        ctx.lineWidth = 1.2 * dpr;

        const windAngle = ((weather.windDirection - 180) * Math.PI) / 180 * 0.16;
        const rainAngle = Math.PI / 2 + Math.max(-0.35, Math.min(0.35, windAngle));

        for (const drop of rainRef.current) {
          drop.y += drop.speed * (delta * 60) * dpr;
          drop.x += Math.cos(rainAngle) * drop.speed * (delta * 60) * dpr;

          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - Math.cos(rainAngle) * drop.length * dpr, drop.y - Math.sin(rainAngle) * drop.length * dpr);
          ctx.stroke();

          // Hit lake surface: spawn ripple
          const inLake = drop.y >= h * 0.61 && drop.y <= h * 0.78;
          if (drop.y > h || (inLake && Math.random() < 0.06)) {
            if (inLake && lakeRipplesRef.current.length < 35) {
              lakeRipplesRef.current.push({
                x: drop.x,
                y: drop.y,
                radius: 1 * dpr,
                maxRadius: (Math.random() * 8 + 4) * dpr,
                opacity: 0.7,
                speed: (Math.random() * 0.4 + 0.3) * dpr,
              });
            }
            drop.y = -drop.length * dpr;
            drop.x = Math.random() * w;
          }
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 8. WET CAMERA SCREEN DROPLETS (Photorealistic Water On Lens)
      // -------------------------------------------------------------
      if (screenDropletsRef.current.length > 0) {
        ctx.save();
        for (const drop of screenDropletsRef.current) {
          if (drop.isTrickling) {
            drop.y += drop.speed * (delta * 60) * dpr;
            if (drop.y > h + 20) {
              drop.y = -10;
              drop.x = Math.random() * w;
            }
          }

          const dr = drop.radius * dpr;

          // Water droplet body (refraction highlight + drop shadow)
          ctx.fillStyle = `rgba(255, 255, 255, ${drop.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, dr, 0, Math.PI * 2);
          ctx.fill();

          // Dark refraction rim
          ctx.strokeStyle = `rgba(0, 0, 0, ${drop.alpha * 0.35})`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();

          // Bright specular glare point
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(drop.x - dr * 0.35, drop.y - dr * 0.35, dr * 0.35, 0, Math.PI * 2);
          ctx.fill();

          // Droplet trickle tail
          if (drop.isTrickling && drop.tailLength > 0) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${drop.alpha * 0.4})`;
            ctx.lineWidth = dr * 0.6;
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y - dr);
            ctx.lineTo(drop.x, drop.y - dr - drop.tailLength * dpr);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 9. THUNDERSTORM: REAL LIGHTNING FLASH OVER MOUNTAINS
      // -------------------------------------------------------------
      const isThunder = weather.condition === 'thunderstorm' || weather.condition === 'hail' || weather.weatherCode >= 95;
      if (isThunder && settings.enableLightning) {
        const currentTime = Date.now();
        if (currentTime > nextLightningTimeRef.current) {
          lightningActiveRef.current = true;
          lightningOpacityRef.current = 0.9;
          nextLightningTimeRef.current = currentTime + Math.random() * 4500 + 3500;
          if (settings.enableAudioAmbience) setTimeout(() => weatherAudio.playThunder(), 120);
        }

        if (lightningActiveRef.current) {
          ctx.save();
          ctx.fillStyle = `rgba(255, 255, 255, ${lightningOpacityRef.current * 0.75})`;
          ctx.fillRect(0, 0, w, h);
          lightningOpacityRef.current -= 0.08;
          if (lightningOpacityRef.current <= 0) lightningActiveRef.current = false;
          ctx.restore();
        }
      }

      // Frame throttle (30fps battery saver mode if enabled)
      if (settings.batterySaver) {
        setTimeout(() => {
          animationFrameRef.current = requestAnimationFrame(render);
        }, 1000 / 30);
      } else {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [weather, theme, settings, effectiveHour, isNight, isSunUp, isSunset, isSunrise, sunriseHour, sunsetHour]);

  // Handle pointer down for water ripple and bird interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;

    lakeRipplesRef.current.push({
      x,
      y,
      radius: 4 * dpr,
      maxRadius: 80 * dpr,
      opacity: 0.9,
      speed: 1.6 * dpr,
    });

    // Startle birds slightly upwards if tapped nearby
    for (const b of birdsRef.current) {
      if (Math.abs(b.x - x) < 130 * dpr && Math.abs(b.y - y) < 130 * dpr) {
        b.vy = -1.5;
        b.wingSpeed = 0.35;
      }
    }

    if (onTapWallpaper) onTapWallpaper(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      className="absolute inset-0 w-full h-full block cursor-pointer select-none touch-none"
      style={{ touchAction: 'none' }}
    />
  );
};
