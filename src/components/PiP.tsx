import { memo } from 'react';
import { PictureInPicture2, X } from 'lucide-react';
import { getBrowserCapabilities } from '../utils/browserCapabilities';
import { formatTime } from '../utils/timerEngine';
import type { TimerPhase, TimerStatus } from '../types';

interface PiPButtonProps {
  remainingMs: number;
  phase: TimerPhase;
  status: TimerStatus;
  onToggle: () => void;
  isPiPActive: boolean;
}

export const PiPButton = memo(function PiPButton({
  onToggle,
  isPiPActive,
}: PiPButtonProps) {
  const caps = getBrowserCapabilities();

  if (!caps.documentPiP) {
    return null; // Silently not shown if not supported
  }

  return (
    <button
      id="btn-pip"
      onClick={onToggle}
      className={`btn btn-ghost btn-sm ${isPiPActive ? 'btn-active' : ''}`}
      aria-label={isPiPActive ? 'Close Picture-in-Picture' : 'Open Picture-in-Picture mini timer'}
      title="Toggle PiP (P)"
    >
      {isPiPActive ? (
        <X size={15} aria-hidden="true" />
      ) : (
        <PictureInPicture2 size={15} aria-hidden="true" />
      )}
      {isPiPActive ? 'Close PiP' : 'Mini Timer'}
    </button>
  );
});

// ─── PiP Manager ──────────────────────────────────────────────────────────────

// We render a minimal DOM inside the PiP window
// The PiP window content is managed via a React portal + DocumentPiP API

let pipWindow: Window | null = null;

export async function openDocumentPiP(
  initialContent: string
): Promise<Window | null> {
  if (!getBrowserCapabilities().documentPiP) return null;
  if (pipWindow && !pipWindow.closed) {
    pipWindow.close();
    pipWindow = null;
    return null;
  }

  try {
    // @ts-expect-error — documentPictureInPicture is not yet in lib.dom.d.ts
    const pip = await window.documentPictureInPicture.requestWindow({
      width: 240,
      height: 160,
    }) as Window;

    pip.document.title = 'ErgoBreak Timer';

    // Copy base styles
    const style = pip.document.createElement('style');
    style.textContent = `
      :root { font-family: system-ui, sans-serif; }
      body { margin: 0; padding: 12px; background: #0f172a; color: #f1f5f9;
             display: flex; flex-direction: column; align-items: center;
             justify-content: center; height: 100vh; box-sizing: border-box; }
      .pip-phase { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
                   opacity: 0.6; margin-bottom: 4px; }
      .pip-time { font-size: 44px; font-weight: 700; letter-spacing: -0.02em;
                  font-variant-numeric: tabular-nums; }
      .pip-status { font-size: 11px; opacity: 0.5; margin-top: 4px; }
    `;
    pip.document.head.appendChild(style);
    pip.document.body.innerHTML = initialContent;

    pip.addEventListener('pagehide', () => {
      pipWindow = null;
    });

    pipWindow = pip;
    return pip;
  } catch {
    return null;
  }
}

export function updatePiPContent(
  phase: TimerPhase,
  remainingMs: number,
  status: TimerStatus
): void {
  if (!pipWindow || pipWindow.closed) return;

  const phaseLabels: Record<TimerPhase, string> = {
    focus: 'Focus',
    eyeBreak: 'Eye Break',
    movementBreak: 'Move & Stretch',
  };

  const statusLabel = status === 'paused' ? 'Paused' : status === 'idle' ? 'Idle' : '';

  pipWindow.document.body.innerHTML = `
    <div class="pip-phase">${phaseLabels[phase]}</div>
    <div class="pip-time">${formatTime(remainingMs)}</div>
    ${statusLabel ? `<div class="pip-status">${statusLabel}</div>` : ''}
  `;
}

export function closePiP(): void {
  if (pipWindow && !pipWindow.closed) {
    pipWindow.close();
    pipWindow = null;
  }
}

export function isPiPOpen(): boolean {
  return pipWindow !== null && !pipWindow.closed;
}
