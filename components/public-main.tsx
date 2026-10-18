'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function PublicMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const simple = /^\/(en|th|zh|ja|ru|ko|fr|de|id|vi)(\/(cash|crypto|data-status))?\/?$/.test(pathname) || /^\/(ja|ru|ko|fr|de|id|vi)\/legal\/(methodology|disclaimer|privacy-policy)\/?$/.test(pathname);
  return <main id="main-content" className={simple ? 'simple-main' : 'legacy-main container-shell py-10'}>{children}</main>;
}
