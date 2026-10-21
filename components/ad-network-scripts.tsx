'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

// Third-party ad networks are loaded only after the visitor accepts the analytics/ads
// consent that SiteAnalytics already collects, so no ad cookie is set before a choice.
// Infolinks publisher id (publisher "Exchange THB", registered 2026-10-22).
const IN_FOLINKS_PID = '3448819';

export function AdNetworkScripts() {
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        setAccepted(localStorage.getItem('exchangethb-analytics-consent') === 'accepted');
      } catch {
        setAccepted(false);
      }
    };
    read();
    window.addEventListener('exchangethb-consent', read);
    return () => window.removeEventListener('exchangethb-consent', read);
  }, []);

  if (!accepted) return null;
  return (
    <>
      <Script id="exthb-ad-config" strategy="afterInteractive">
        {`var infolinks_pid = ${IN_FOLINKS_PID}; var infolinks_wsid = 0;`}
      </Script>
      <Script id="exthb-infolinks" src="//resources.infolinks.com/js/infolinks_main.js" strategy="afterInteractive" />
    </>
  );
}
