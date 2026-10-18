import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const privacy = readFileSync(new URL('../app/[locale]/legal/[slug]/page.tsx', import.meta.url), 'utf8');

describe('Travelpayouts Drive integration', () => {
  it('places one guarded installer in the shared document head', () => {
    const head = layout.split('<head>')[1].split('</head>')[0];
    expect(head.match(/id="travelpayouts-drive"/g)).toHaveLength(1);
    expect(head).toContain('document.querySelector');
    expect(head).toContain("script.src = 'https://tpembars.com/NTgwMjY5.js?t=580269'");
    expect(head).toContain('document.head.appendChild(script)');
    expect(head).toContain('data-cmp-ab="2"');
    expect(head).toContain('script.async = 1');
  });
  it('retains AdSense and discloses referrals on both privacy rendering branches', () => {
    expect(layout).toContain('adsbygoogle.js?client=ca-pub-8386341379958173');
    expect(privacy).toContain('Travelpayouts Drive');
    expect(privacy).toContain('cookies, device and click information');
    expect(privacy.match(/<p>\{travelpayoutsPrivacy\}<\/p>/g)).toHaveLength(2);
  });
});
