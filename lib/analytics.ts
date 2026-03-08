export const gaMeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-EXCHANGETHB';

export function gaScript() {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} 
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${gaMeasurementId}');
  `;
}
