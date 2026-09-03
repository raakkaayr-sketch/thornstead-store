import Script from 'next/script';
import { ADS_CONSENT_KEY, GOOGLE_ADS_ID } from '@/lib/ads';

/**
 * Google-Tag inkl. Consent Mode v2.
 *
 * beforeInteractive muss im Root-Layout liegen, damit die Standard-Verweigerung
 * gesetzt ist, bevor gtag.js Cookies anlegen kann. Eine zuvor erteilte
 * Einwilligung wird aus dem Local Storage wiederhergestellt.
 */
export function GoogleAdsScripts() {
  return (
    <>
      <Script id="gtag-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);}
          window.gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
          window.gtag('set', 'ads_data_redaction', true);
          window.gtag('set', 'url_passthrough', true);
          try {
            if (localStorage.getItem('${ADS_CONSENT_KEY}') === 'granted') {
              window.gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            }
          } catch (e) {}
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
          window.gtag('js', new Date());
          window.gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
