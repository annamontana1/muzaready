import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: (e: KeyboardEvent) => void;
  description?: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

/**
 * Custom hook pro keyboard shortcuts
 *
 * @example
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     {
 *       key: 'k',
 *       ctrlKey: true,
 *       metaKey: true,
 *       handler: () => focusSearch(),
 *       description: 'Focus search',
 *     }
 *   ]
 * });
 */
export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey === undefined || e.ctrlKey === shortcut.ctrlKey;
        const metaMatches = shortcut.metaKey === undefined || e.metaKey === shortcut.metaKey;
        const shiftMatches = shortcut.shiftKey === undefined || e.shiftKey === shortcut.shiftKey;

        // Check if shortcut matches
        if (keyMatches && ctrlMatches && metaMatches && shiftMatches) {
          // Don't trigger if user is typing in input/textarea
          const target = e.target as HTMLElement;
          const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
          const isContentEditable = target.contentEditable === 'true';

          if (!isInput && !isContentEditable) {
            if (shortcut.preventDefault !== false) {
              e.preventDefault();
            }
            shortcut.handler(e);
          }
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Helper hook pro Cmd/Ctrl + K (focus search)
 */
export function useSearchShortcut(handler: () => void, enabled = true) {
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'k',
        ctrlKey: true,
        metaKey: true,
        handler,
        description: 'Focus search',
      },
    ],
    enabled,
  });
}

/**
 * Helper hook pro Cmd/Ctrl + S (save)
 */
export function useSaveShortcut(handler: () => void, enabled = true) {
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 's',
        ctrlKey: true,
        metaKey: true,
        handler,
        description: 'Save',
      },
    ],
    enabled,
  });
}
