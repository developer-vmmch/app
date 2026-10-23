/**
 * NOVEA Medical Network - Privacy-Friendly Just-In-Time (JIT) Permission Service
 * Enforces pre-explanation dialogs before requesting native Android permissions.
 */

export type PermissionType = 'camera' | 'microphone' | 'location' | 'contacts' | 'notifications';

export interface PermissionRationale {
  title: string;
  purpose: string;
  iconName: string;
}

export const PERMISSION_RATIONALES: Record<PermissionType, PermissionRationale> = {
  camera: {
    title: 'Camera Access',
    purpose: 'NOVEA requires Camera access to capture live clinical snapshots and participate in 1-to-1 video consultations.',
    iconName: 'Camera',
  },
  microphone: {
    title: 'Microphone Access',
    purpose: 'NOVEA requires Microphone access for sending voice notes and participating in doctor-to-doctor voice consultations.',
    iconName: 'Mic',
  },
  location: {
    title: 'Location Services',
    purpose: 'NOVEA uses Location access to highlight nearby medical centers, hospital networks, and local doctor circles on the Doctor Knowledge Map.',
    iconName: 'MapPin',
  },
  contacts: {
    title: 'Address Book Discovery',
    purpose: 'NOVEA uses Contacts access solely to discover verified medical colleagues in your address book. Contacts are never stored or uploaded externally.',
    iconName: 'Users',
  },
  notifications: {
    title: 'Push Notifications',
    purpose: 'NOVEA requires Notification access to alert you about urgent peer consults, incoming calls, and clinical messages.',
    iconName: 'Bell',
  },
};

class PermissionService {
  private grantedPermissions: Set<PermissionType> = new Set();

  constructor() {
    try {
      const saved = localStorage.getItem('novea_permissions_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((p) => this.grantedPermissions.add(p));
        }
      }
    } catch {}
  }

  private saveState(): void {
    try {
      localStorage.setItem('novea_permissions_state', JSON.stringify(Array.from(this.grantedPermissions)));
    } catch {}
  }

  public isGranted(type: PermissionType): boolean {
    return this.grantedPermissions.has(type);
  }

  public async requestPermission(type: PermissionType): Promise<boolean> {
    if (this.isGranted(type)) {
      return true;
    }

    // Geolocation API check
    if (type === 'location' && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            this.grantedPermissions.add('location');
            this.saveState();
            resolve(true);
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              console.warn('Location permission denied by user.');
            }
            resolve(false);
          },
          { timeout: 8000 }
        );
      });
    }

    // MediaDevices check for Camera / Microphone
    if ((type === 'camera' || type === 'microphone') && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      try {
        const constraints: MediaStreamConstraints =
          type === 'camera' ? { video: true, audio: false } : { video: false, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) => track.stop());
        this.grantedPermissions.add(type);
        this.saveState();
        return true;
      } catch (err) {
        console.warn(`${type} permission denied or unavailable:`, err);
        return false;
      }
    }

    // Default grant simulation for Web/Capacitor JIT permissions
    this.grantedPermissions.add(type);
    this.saveState();
    return true;
  }

  public revokePermission(type: PermissionType): void {
    this.grantedPermissions.delete(type);
    this.saveState();
  }
}

export const permissionService = new PermissionService();
