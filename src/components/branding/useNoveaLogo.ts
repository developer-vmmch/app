import { useState, useEffect } from 'react';
import { logoService, LogoSettings } from '../../services/logoService';
import { NoveaLogoDefinition } from './noveaLogos';

export interface UseNoveaLogoResult {
  activeLogo: NoveaLogoDefinition;
  settings: LogoSettings;
  timeUntilNextRotationMs: number;
  formattedCountdown: string;
  setLogo: (id: number, autoRotate?: boolean) => void;
  setAutoRotate: (enabled: boolean) => void;
  setIntervalMinutes: (minutes: number) => void;
  resetToDefault: () => void;
  updateSettings: (partial: Partial<LogoSettings>) => void;
}

export const useNoveaLogo = (): UseNoveaLogoResult => {
  const [activeLogo, setActiveLogo] = useState<NoveaLogoDefinition>(() => logoService.getActiveLogo());
  const [settings, setSettings] = useState<LogoSettings>(() => logoService.getSettings());
  const [timeUntilNextRotationMs, setTimeUntilNextRotationMs] = useState<number>(() =>
    logoService.getTimeUntilNextRotationMs()
  );

  useEffect(() => {
    // Subscribe to logo changes
    const unsubscribe = logoService.subscribe((newLogo, newSettings) => {
      setActiveLogo(newLogo);
      setSettings(newSettings);
      setTimeUntilNextRotationMs(logoService.getTimeUntilNextRotationMs());
    });

    // Update countdown every second
    const interval = window.setInterval(() => {
      setTimeUntilNextRotationMs(logoService.getTimeUntilNextRotationMs());
    }, 1000);

    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, []);

  const totalSeconds = Math.max(0, Math.floor(timeUntilNextRotationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    activeLogo,
    settings,
    timeUntilNextRotationMs,
    formattedCountdown,
    setLogo: (id: number, autoRotate?: boolean) => logoService.setLogo(id, autoRotate),
    setAutoRotate: (enabled: boolean) => logoService.setAutoRotate(enabled),
    setIntervalMinutes: (minutes: number) => logoService.setIntervalMinutes(minutes),
    resetToDefault: () => logoService.resetToDefault(),
    updateSettings: (partial: Partial<LogoSettings>) => logoService.updateSettings(partial),
  };
};
