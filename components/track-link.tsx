'use client';

import Link, { LinkProps } from 'next/link';
import type * as React from 'react';
import { trackEvent } from '@/lib/analytics-client';

export function TrackLink({ eventName, eventParams, onClick, ...props }: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { eventName: string; eventParams?: Record<string, string | number | boolean | undefined> }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    />
  );
}

export function TrackAnchor({ eventName, eventParams, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { eventName: string; eventParams?: Record<string, string | number | boolean | undefined> }) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams);
        onClick?.(event);
      }}
    />
  );
}
