'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface OrderNotificationState {
  pendingCount: number;
  hasNewOrders: boolean;
  lastChecked: Date | null;
}

/**
 * Hook for order notifications in admin panel
 * - Polls for new orders every 30 seconds
 * - Plays sound when new order arrives
 * - Shows badge with pending orders count
 */
export function useOrderNotifications() {
  const [state, setState] = useState<OrderNotificationState>({
    pendingCount: 0,
    hasNewOrders: false,
    lastChecked: null,
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousCountRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasUserInteracted = useRef(false);

  // Initialize audio context on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      hasUserInteracted.current = true;
    }
  }, []);

  // Play notification sound using Web Audio API
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled || !hasUserInteracted.current) return;

    try {
      // Initialize on first play attempt
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;

      // Resume if suspended (browser policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create a pleasant "ding" sound like Shopify
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Two-tone notification (like cash register)
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
      oscillator.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1); // C#6

      oscillator.type = 'sine';

      // Volume envelope
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);

      // Play second ding after short delay
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.4);
      }, 150);

    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }, [soundEnabled]);

  // Fetch pending orders count
  const fetchPendingCount = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders/pending-count', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const newCount = data.count || 0;

        setState(prev => {
          // Check if we have new orders
          const isNew = newCount > previousCountRef.current && previousCountRef.current !== 0;

          if (isNew) {
            // Play sound for new orders
            playNotificationSound();
          }

          previousCountRef.current = newCount;

          return {
            pendingCount: newCount,
            hasNewOrders: isNew,
            lastChecked: new Date(),
          };
        });
      }
    } catch (error) {
      console.error('Failed to fetch pending orders count:', error);
    }
  }, [playNotificationSound]);

  // Mark orders as seen (reset hasNewOrders flag)
  const markAsSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasNewOrders: false }));
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Set up polling
  useEffect(() => {
    // Initial fetch
    fetchPendingCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, [fetchPendingCount]);

  // Listen for user interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      hasUserInteracted.current = true;
      initAudioContext();
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [initAudioContext]);

  return {
    pendingCount: state.pendingCount,
    hasNewOrders: state.hasNewOrders,
    lastChecked: state.lastChecked,
    soundEnabled,
    toggleSound,
    markAsSeen,
    refresh: fetchPendingCount,
  };
}
