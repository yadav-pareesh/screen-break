import { memo } from 'react';
import {
  X,
  Bell,
  Volume2,
  Monitor,
  Sun,
  Moon,
  Clock,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import type { AppSettings } from '../types';
import {
  requestNotificationPermission,
  getNotificationPermission,
  getBrowserCapabilities,
} from '../utils/browserCapabilities';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateTimer: (update: Partial<AppSettings['timer']>) => void;
  onUpdateNotifications: (update: Partial<AppSettings['notifications']>) => void;
  onUpdateSound: (update: Partial<AppSettings['sound']>) => void;
  onUpdateAppearance: (update: Partial<AppSettings['appearance']>) => void;
  onReset: () => void;
  onClose: () => void;
}

export const SettingsPanel = memo(function SettingsPanel({
  settings,
  onUpdateTimer,
  onUpdateNotifications,
  onUpdateSound,
  onUpdateAppearance,
  onReset,
  onClose,
}: SettingsPanelProps) {
  const capabilities = getBrowserCapabilities();
  const notifPermission = getNotificationPermission();

  const handleEnableNotifications = async () => {
    if (!capabilities.notifications) return;
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      onUpdateNotifications({ enabled: true });
    }
  };

  return (
    <div
      className="settings-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="settings-header">
        <div>
          <h2 id="settings-title" className="panel-title">Settings</h2>
          <p className="panel-subtitle">Preferences & timer configuration</p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-icon"
          aria-label="Close settings"
          id="settings-close-btn"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="settings-body">
        {/* ─── Timer Settings ──────────────────────────────────────────── */}
        <SettingsSection
          title="Timer"
          icon={<Clock size={15} />}
          iconVariant="timer"
        >
          <RangeControl
            id="focus-duration"
            label="Focus Duration"
            description="Work interval before rest breaks"
            value={settings.timer.focusDurationMin}
            min={5}
            max={120}
            step={5}
            unit="min"
            onChange={(v) => onUpdateTimer({ focusDurationMin: v })}
          />
          <RangeControl
            id="eye-break-duration"
            label="Eye Break Duration"
            description="Look at an object 20 feet away"
            value={settings.timer.eyeBreakDurationSec}
            min={10}
            max={120}
            step={5}
            unit="sec"
            onChange={(v) => onUpdateTimer({ eyeBreakDurationSec: v })}
          />
          <RangeControl
            id="movement-interval"
            label="Movement Interval"
            description="Time between postural stretch pauses"
            value={settings.timer.movementIntervalMin}
            min={10}
            max={180}
            step={10}
            unit="min"
            onChange={(v) => onUpdateTimer({ movementIntervalMin: v })}
          />
          <RangeControl
            id="movement-duration"
            label="Movement Duration"
            description="Guided physical desk stretch length"
            value={settings.timer.movementDurationMin}
            min={1}
            max={10}
            step={1}
            unit="min"
            onChange={(v) => onUpdateTimer({ movementDurationMin: v })}
          />
          <ToggleControl
            id="eye-break-enabled"
            label="Enable Eye Breaks"
            description="Periodic 20-20-20 visual rest reminders"
            checked={settings.timer.eyeBreakEnabled}
            onChange={(v) => onUpdateTimer({ eyeBreakEnabled: v })}
          />
          <ToggleControl
            id="movement-break-enabled"
            label="Enable Movement Breaks"
            description="Periodic posture and stretch breaks"
            checked={settings.timer.movementBreakEnabled}
            onChange={(v) => onUpdateTimer({ movementBreakEnabled: v })}
          />
          <ToggleControl
            id="auto-start"
            label="Auto-start Next Phase"
            description="Advance cycles without manual resume click"
            checked={settings.timer.autoStartNextPhase}
            onChange={(v) => onUpdateTimer({ autoStartNextPhase: v })}
          />
          <ToggleControl
            id="pause-when-hidden"
            label="Pause When Tab Hidden"
            description="Pause timer when switching to another browser tab"
            checked={settings.timer.pauseWhenHidden}
            onChange={(v) => onUpdateTimer({ pauseWhenHidden: v })}
          />
        </SettingsSection>

        {/* ─── Notifications ────────────────────────────────────────────── */}
        <SettingsSection
          title="Notifications"
          icon={<Bell size={15} />}
          iconVariant="notification"
          badge={settings.notifications.enabled ? 'Enabled' : 'Off'}
        >
          {!capabilities.notifications ? (
            <div className="settings-note-banner settings-note-banner--muted">
              <AlertCircle size={15} />
              <span>Browser notifications are not supported in this environment.</span>
            </div>
          ) : notifPermission === 'denied' ? (
            <div className="settings-note-banner settings-note-banner--warning">
              <AlertCircle size={15} />
              <div>
                <strong>Notifications Blocked</strong>
                <p>Please allow notifications in browser site settings to receive break alerts.</p>
              </div>
            </div>
          ) : !settings.notifications.enabled && notifPermission !== 'granted' ? (
            <div className="control-row">
              <div className="control-text-group">
                <span className="control-label">Browser Notifications</span>
                <p className="control-desc">Get system alerts when it's time to rest</p>
              </div>
              <button
                id="btn-enable-notifications"
                onClick={handleEnableNotifications}
                className="btn btn-primary btn-sm"
              >
                <Bell size={13} />
                <span>Enable</span>
              </button>
            </div>
          ) : (
            <ToggleControl
              id="notifications-enabled"
              label="Browser Notifications"
              description="Show desktop alerts when intervals complete"
              checked={settings.notifications.enabled}
              onChange={(v) => onUpdateNotifications({ enabled: v })}
            />
          )}

          <ToggleControl
            id="notify-eye-break"
            label="Eye Break Alerts"
            description="Send notification for 20-20-20 visual rest"
            checked={settings.notifications.eyeBreak}
            onChange={(v) => onUpdateNotifications({ eyeBreak: v })}
            disabled={!settings.notifications.enabled}
          />
          <ToggleControl
            id="notify-movement"
            label="Movement Break Alerts"
            description="Send notification for physical stretch prompts"
            checked={settings.notifications.movementBreak}
            onChange={(v) => onUpdateNotifications({ movementBreak: v })}
            disabled={!settings.notifications.enabled}
          />
        </SettingsSection>

        {/* ─── Sound ───────────────────────────────────────────────────── */}
        <SettingsSection
          title="Sound"
          icon={<Volume2 size={15} />}
          iconVariant="sound"
          badge={settings.sound.enabled ? `${Math.round(settings.sound.volume * 100)}%` : 'Muted'}
        >
          {!capabilities.audioContext ? (
            <div className="settings-note-banner settings-note-banner--muted">
              <AlertCircle size={15} />
              <span>Web Audio API is not supported in this browser.</span>
            </div>
          ) : (
            <>
              <ToggleControl
                id="sound-enabled"
                label="Sound Alerts"
                description="Play audio chimes when phases start and complete"
                checked={settings.sound.enabled}
                onChange={(v) => onUpdateSound({ enabled: v })}
              />
              <RangeControl
                id="sound-volume"
                label="Alert Volume"
                description="Adjust audio chime loudness"
                value={Math.round(settings.sound.volume * 100)}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={(v) => onUpdateSound({ volume: v / 100 })}
                disabled={!settings.sound.enabled}
              />
            </>
          )}
        </SettingsSection>

        {/* ─── Appearance ───────────────────────────────────────────────── */}
        <SettingsSection
          title="Appearance"
          icon={<Monitor size={15} />}
          iconVariant="appearance"
        >
          <ThemeSelector
            value={settings.appearance.theme}
            onChange={(v) => onUpdateAppearance({ theme: v })}
          />
          <ToggleControl
            id="large-timer"
            label="Large Timer Display"
            description="Enlarge digits for distant workstation viewing"
            checked={settings.appearance.largeTimer}
            onChange={(v) => onUpdateAppearance({ largeTimer: v })}
          />
          <ToggleControl
            id="reduced-motion"
            label="Reduced Motion"
            description="Minimize decorative transitions and pulse animations"
            checked={settings.appearance.reducedMotion}
            onChange={(v) => onUpdateAppearance({ reducedMotion: v })}
          />
          <ToggleControl
            id="high-contrast"
            label="High Contrast"
            description="Increase border contrast and text legibility"
            checked={settings.appearance.highContrast}
            onChange={(v) => onUpdateAppearance({ highContrast: v })}
          />
        </SettingsSection>

        {/* ─── Reset ───────────────────────────────────────────────────── */}
        <div className="settings-footer">
          <button
            id="btn-reset-settings"
            onClick={() => {
              if (window.confirm('Reset all settings to defaults?')) {
                onReset();
              }
            }}
            className="btn-reset-all"
          >
            <RotateCcw size={13} />
            <span>Reset All to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
});

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  iconVariant?: 'timer' | 'notification' | 'sound' | 'appearance';
  badge?: string;
  children: React.ReactNode;
}

function SettingsSection({
  title,
  icon,
  iconVariant = 'timer',
  badge,
  children,
}: SettingsSectionProps) {
  const headingId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section className="settings-section" aria-labelledby={headingId}>
      <div className="settings-section-title">
        <div className="settings-section-title-left">
          <span
            className={`settings-section-icon settings-section-icon--${iconVariant}`}
            aria-hidden="true"
          >
            {icon}
          </span>
          <h3 id={headingId} className="settings-section-name">
            {title}
          </h3>
        </div>
        {badge && <span className="settings-section-badge">{badge}</span>}
      </div>
      <div className="settings-section-body">{children}</div>
    </section>
  );
}

interface ToggleControlProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function ToggleControl({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: ToggleControlProps) {
  return (
    <div className={`control-row ${disabled ? 'control-row--disabled' : ''}`}>
      <div className="control-text-group">
        <label htmlFor={id} className="control-label">
          {label}
        </label>
        {description && <p className="control-desc">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`toggle ${checked ? 'toggle--on' : ''} ${disabled ? 'toggle--disabled' : ''}`}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

interface RangeControlProps {
  id: string;
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function RangeControl({
  id,
  label,
  description,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  disabled,
}: RangeControlProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));

  return (
    <div className={`control-row control-row--column ${disabled ? 'control-row--disabled' : ''}`}>
      <div className="control-row-top">
        <div className="control-text-group">
          <label htmlFor={id} className="control-label">
            {label}
          </label>
          {description && <p className="control-desc">{description}</p>}
        </div>
        <span className="control-value">
          {value} {unit}
        </span>
      </div>
      <div className="range-wrapper">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-input"
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
          }}
          aria-label={`${label}: ${value} ${unit}`}
        />
      </div>
    </div>
  );
}

interface ThemeSelectorProps {
  value: AppSettings['appearance']['theme'];
  onChange: (value: AppSettings['appearance']['theme']) => void;
}

function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const options: { value: AppSettings['appearance']['theme']; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={13} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={13} /> },
    { value: 'system', label: 'System', icon: <Monitor size={13} /> },
  ];

  return (
    <div className="control-row">
      <div className="control-text-group">
        <span className="control-label">Theme Mode</span>
        <p className="control-desc">Select dark, light, or system appearance</p>
      </div>
      <div className="theme-selector" role="group" aria-label="Choose theme">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            id={`theme-${opt.value}`}
            onClick={() => onChange(opt.value)}
            className={`theme-btn ${value === opt.value ? 'active' : ''}`}
            aria-pressed={value === opt.value}
            aria-label={`${opt.label} theme`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
