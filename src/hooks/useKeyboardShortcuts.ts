import { useEffect, useCallback } from 'react';

// ─── useKeyboardShortcuts Hook ────────────────────────────────────────────────

interface ShortcutHandlers {
  onSpacePress?: () => void;  // Pause/Resume
  onRPress?: () => void;       // Reset
  onSPress?: () => void;       // Skip
  onPPress?: () => void;       // Toggle PiP
  onEPress?: () => void;       // Exercise library
  onEscapePress?: () => void;  // Close dialog
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire shortcuts when user is typing
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Don't fire with modifier keys (except Escape)
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key !== 'Escape') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onSpacePress?.();
          break;
        case 'r':
        case 'R':
          handlers.onRPress?.();
          break;
        case 's':
        case 'S':
          handlers.onSPress?.();
          break;
        case 'p':
        case 'P':
          handlers.onPPress?.();
          break;
        case 'e':
        case 'E':
          handlers.onEPress?.();
          break;
        case 'Escape':
          handlers.onEscapePress?.();
          break;
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
