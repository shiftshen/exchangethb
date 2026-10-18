const configured = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
export const gaMeasurementId = configured && /^G-[A-Z0-9]{8,12}$/.test(configured) && configured !== 'G-EXCHANGETHB' ? configured : undefined;

export function gaScript() {
  if (!gaMeasurementId) return '';
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} 
    window.gtag = gtag;
    gtag('consent', 'default', {analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js', new Date());
    const campaignParams = new URLSearchParams(location.search);
    const campaign = {};
    const campaignAllow = {utm_source:['google','facebook','line','telegram','tiktok','x','qrcode','partner'],utm_medium:['organic','social','referral','email','cpc','offline'],utm_campaign:['exchange_thb_launch','cash_comparison','crypto_comparison']};
    for (const [key, values] of Object.entries(campaignAllow)) { const value=campaignParams.get(key); if(values.includes(value)) campaign[key==='utm_campaign'?'campaign_name':key.replace('utm_','campaign_')]=value; }
    let referrer='';
    try { const ref=new URL(document.referrer); if(['google.com','google.co.th','facebook.com','t.co','line.me','tiktok.com','t.me'].some(host=>ref.hostname===host||ref.hostname.endsWith('.'+host))) referrer=ref.origin; } catch {}
    window.exchangeAnalyticsReferrer=referrer;
    gtag('config', '${gaMeasurementId}', {...campaign,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_referrer:referrer});
  `;
}
