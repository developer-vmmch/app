import { NOVEA_LOGOS, NoveaLogoDefinition, getLogoById } from '../components/branding/noveaLogos';

export interface LogoSettings {
  currentLogoId: number;
  isAutoRotate: boolean;
  intervalMinutes: number; // e.g. 10
  rotationStartTimestamp: number; // timestamp when current rotation period began
  lastSavedAt?: number;
}

const STORAGE_KEY = 'novea_logo_settings_v1';
export const DEFAULT_ROTATION_INTERVAL_MINUTES = 10;
export const DEFAULT_ROTATION_INTERVAL_MS = DEFAULT_ROTATION_INTERVAL_MINUTES * 60 * 1000; // 600,000 ms

const getDefaultSettings = (): LogoSettings => ({
  currentLogoId: 1,
  isAutoRotate: true,
  intervalMinutes: DEFAULT_ROTATION_INTERVAL_MINUTES,
  rotationStartTimestamp: Date.now(),
});

class LogoService {
  private settings: LogoSettings;
  private timerId: number | null = null;
  private listeners: Set<(logo: NoveaLogoDefinition, settings: LogoSettings) => void> = new Set();

  constructor() {
    this.settings = this.loadSettings();
    this.recalculateActiveLogo();
    this.startTimer();
  }

  private loadSettings(): LogoSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentLogoId === 'number') {
          return {
            currentLogoId: Math.max(1, Math.min(36, parsed.currentLogoId)),
            isAutoRotate: parsed.isAutoRotate ?? true,
            intervalMinutes: parsed.intervalMinutes || DEFAULT_ROTATION_INTERVAL_MINUTES,
            rotationStartTimestamp: parsed.rotationStartTimestamp || Date.now(),
            lastSavedAt: parsed.lastSavedAt,
          };
        }
      }
    } catch {
      // Fallback to default
    }
    return getDefaultSettings();
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // ignore storage errors
    }
  }

  /**
   * Recalculates the active logo based on elapsed time if auto-rotate is enabled.
   */
  public recalculateActiveLogo(): void {
    if (!this.settings.isAutoRotate) {
      return;
    }

    const intervalMs = this.settings.intervalMinutes * 60 * 1000;
    const now = Date.now();
    const elapsed = Math.max(0, now - this.settings.rotationStartTimestamp);

    if (elapsed >= intervalMs) {
      const stepAdvancement = Math.floor(elapsed / intervalMs);
      const remainingRemainder = elapsed % intervalMs;

      // Advance by stepAdvancement through 1..36
      const zeroIndexedCurrent = this.settings.currentLogoId - 1;
      const nextZeroIndexed = (zeroIndexedCurrent + stepAdvancement) % 36;
      this.settings.currentLogoId = nextZeroIndexed + 1;
      this.settings.rotationStartTimestamp = now - remainingRemainder;

      this.saveSettings();
      this.notifyListeners();
    }
  }

  public getSettings(): LogoSettings {
    return { ...this.settings };
  }

  public getActiveLogo(): NoveaLogoDefinition {
    this.recalculateActiveLogo();
    return getLogoById(this.settings.currentLogoId);
  }

  public getTimeUntilNextRotationMs(): number {
    if (!this.settings.isAutoRotate) return 0;
    const intervalMs = this.settings.intervalMinutes * 60 * 1000;
    const now = Date.now();
    const elapsed = Math.max(0, now - this.settings.rotationStartTimestamp);
    return Math.max(0, intervalMs - (elapsed % intervalMs));
  }

  public setLogo(logoId: number, autoRotate?: boolean): void {
    const validId = Math.max(1, Math.min(36, logoId));
    this.settings.currentLogoId = validId;
    this.settings.rotationStartTimestamp = Date.now();
    if (typeof autoRotate === 'boolean') {
      this.settings.isAutoRotate = autoRotate;
    }
    this.settings.lastSavedAt = Date.now();
    this.saveSettings();
    this.notifyListeners();
    this.restartTimer();
  }

  public setAutoRotate(enabled: boolean): void {
    this.settings.isAutoRotate = enabled;
    if (enabled) {
      this.settings.rotationStartTimestamp = Date.now();
    }
    this.settings.lastSavedAt = Date.now();
    this.saveSettings();
    this.notifyListeners();
    this.restartTimer();
  }

  public setIntervalMinutes(minutes: number): void {
    const validMinutes = Math.max(1, Math.min(1440, minutes));
    this.settings.intervalMinutes = validMinutes;
    this.settings.rotationStartTimestamp = Date.now();
    this.settings.lastSavedAt = Date.now();
    this.saveSettings();
    this.notifyListeners();
    this.restartTimer();
  }

  public updateSettings(partial: Partial<LogoSettings>): void {
    if (typeof partial.currentLogoId === 'number') {
      this.settings.currentLogoId = Math.max(1, Math.min(36, partial.currentLogoId));
    }
    if (typeof partial.isAutoRotate === 'boolean') {
      this.settings.isAutoRotate = partial.isAutoRotate;
    }
    if (typeof partial.intervalMinutes === 'number') {
      this.settings.intervalMinutes = Math.max(1, Math.min(1440, partial.intervalMinutes));
    }
    this.settings.rotationStartTimestamp = Date.now();
    this.settings.lastSavedAt = Date.now();
    this.saveSettings();
    this.notifyListeners();
    this.restartTimer();
  }

  public resetToDefault(): void {
    this.settings = getDefaultSettings();
    this.saveSettings();
    this.notifyListeners();
    this.restartTimer();
  }

  private startTimer(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }

    // Check every second to cleanly fire on interval boundaries and support live countdowns
    this.timerId = window.setInterval(() => {
      if (this.settings.isAutoRotate) {
        const intervalMs = this.settings.intervalMinutes * 60 * 1000;
        const now = Date.now();
        const elapsed = now - this.settings.rotationStartTimestamp;

        if (elapsed >= intervalMs) {
          // Advance to next sequential logo (1..36)
          const nextId = (this.settings.currentLogoId % 36) + 1;
          this.settings.currentLogoId = nextId;
          this.settings.rotationStartTimestamp = now;
          this.saveSettings();
          this.notifyListeners();
        }
      }
    }, 1000);
  }

  private restartTimer(): void {
    this.startTimer();
  }

  public subscribe(listener: (logo: NoveaLogoDefinition, settings: LogoSettings) => void): () => void {
    this.listeners.add(listener);
    // Immediately invoke with current state
    listener(this.getActiveLogo(), this.getSettings());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const active = getLogoById(this.settings.currentLogoId);
    const settings = this.getSettings();
    this.listeners.forEach((fn) => {
      try {
        fn(active, settings);
      } catch {
        // ignore listener errors
      }
    });
  }
}

export const logoService = new LogoService();
