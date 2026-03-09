'use client';

import type * as React from 'react';
import { trackEvent } from '@/lib/analytics-client';

export function TrackButton({ eventName, eventParams, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { eventName: string; eventParams?: Record<string, string | number | boolean | undefined> }) {
  return (
    <button
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    />
  );
}
