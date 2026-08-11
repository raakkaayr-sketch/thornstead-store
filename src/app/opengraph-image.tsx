import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#f8f6f1',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: '#4a693e',
            }}
          />
          <span style={{ fontSize: 40, color: '#2a2723' }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span style={{ fontSize: 68, color: '#2a2723', lineHeight: 1.1 }}>
            Home &amp; garden, made by us.
          </span>
          <span style={{ fontSize: 30, color: '#6b665e' }}>
            {siteConfig.tagline} Delivered across the United Kingdom.
          </span>
        </div>
      </div>
    ),
    size
  );
}
