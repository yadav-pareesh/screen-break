import type { BrowserCapabilities } from '../types';

// ─── Browser Capability Detection ────────────────────────────────────────────

function detectDocumentPiP(): boolean {
  return (
    typeof window !== 'undefined' &&
    'documentPictureInPicture' in window
  );
}

function detectNotifications(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window
  );
}

function detectServiceWorker(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator
  );
}

function detectBroadcastChannel(): boolean {
  return (
    typeof window !== 'undefined' &&
    'BroadcastChannel' in window
  );
}

function detectPageVisibility(): boolean {
  return (
    typeof document !== 'undefined' &&
    'visibilityState' in document
  );
}

function detectAudioContext(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('AudioContext' in window || 'webkitAudioContext' in window)
  );
}

let _capabilities: BrowserCapabilities | null = null;

export function getBrowserCapabilities(): BrowserCapabilities {
  if (_capabilities) return _capabilities;
  _capabilities = {
    notifications: detectNotifications(),
    documentPiP: detectDocumentPiP(),
    serviceWorker: detectServiceWorker(),
    broadcastChannel: detectBroadcastChannel(),
    pageVisibility: detectPageVisibility(),
    audioContext: detectAudioContext(),
  };
  return _capabilities;
}

// ─── Notification Permission ──────────────────────────────────────────────────

export type NotificationPermission = 'default' | 'granted' | 'denied';

export function getNotificationPermission(): NotificationPermission {
  if (!detectNotifications()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!detectNotifications()) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'denied';
  }
}

export function sendNotification(title: string, body: string, tag?: string): void {
  if (!detectNotifications()) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, tag, icon: '/icon-192.png' });
  } catch {
    // Notification may fail in some edge cases — ignore gracefully
  }
}
