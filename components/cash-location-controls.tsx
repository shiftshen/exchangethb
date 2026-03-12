'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics-client';

export function CashLocationControls({
  initialEnabled = false,
  enabledLabel,
  disabledLabel,
  requestLabel,
  clearLabel,
  pendingLabel,
  unavailableLabel,
  deniedLabel,
}: {
  initialEnabled?: boolean;
  enabledLabel: string;
  disabledLabel: string;
  requestLabel: string;
  clearLabel: string;
  pendingLabel: string;
  unavailableLabel: string;
  deniedLabel: string;
}) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'enabled' | 'denied' | 'unavailable'>(initialEnabled ? 'enabled' : 'idle');

  function updateInputs(latitude: string, longitude: string) {
    const latInput = document.querySelector<HTMLInputElement>('input[name="userLat"]');
    const lngInput = document.querySelector<HTMLInputElement>('input[name="userLng"]');
    if (!latInput || !lngInput) return;
    latInput.value = latitude;
    lngInput.value = longitude;
    latInput.dispatchEvent(new Event('input', { bubbles: true }));
    lngInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      return;
    }
    setStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateInputs(String(position.coords.latitude), String(position.coords.longitude));
        setStatus('enabled');
        trackEvent('cash_location_enabled');
      },
      () => {
        setStatus('denied');
        trackEvent('cash_location_denied');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  function clearLocation() {
    updateInputs('', '');
    setStatus('idle');
    trackEvent('cash_location_cleared');
  }

  const statusLabel = status === 'enabled'
    ? enabledLabel
    : status === 'pending'
      ? pendingLabel
      : status === 'denied'
        ? deniedLabel
        : status === 'unavailable'
          ? unavailableLabel
          : disabledLabel;

  return (
    <div className="rounded-[1.6rem] border border-surface-700 bg-surface-900/90 p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={requestLocation} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-surface-950 transition hover:bg-brand-400">
          {requestLabel}
        </button>
        <button type="button" onClick={clearLocation} disabled={status === 'idle'} className="rounded-full border border-surface-600 px-4 py-2 text-sm font-medium text-stone-300 transition hover:border-brand-500 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-50">
          {clearLabel}
        </button>
        <span className="text-sm text-stone-400">{statusLabel}</span>
      </div>
    </div>
  );
}
