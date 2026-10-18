import { describe, expect, it } from 'vitest';
import { parseSuperRichPage } from '../lib/scrapers/superrich-page';
const date = '2026-10-01T21:20:00Z';
const table = (rows: string) => `<table><tr><th>Currency</th><th>Denomination</th><th>Buying Rate</th><th>Selling Rate</th></tr>${rows}</table>`;
const row = (...cells: string[]) => `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
describe('SuperRich official table', () => {
  it('inherits rowspan currency but resets on unsupported currencies', () => {
    const rates = parseSuperRichPage(table(row('SGD','1000','29.70','29.90') + row('100 - 50','26.15','26.30') + row('NOK','100','3','4') + row('50','3','4')), date);
    expect(rates).toHaveLength(2);
    expect(rates[1]).toMatchObject({ currency:'SGD', denomination:'100 - 50', buyRate:26.15, timestampKind:'collected', fetchedAt:date });
  });
  it('rejects invalid spreads and does not duplicate a second mobile table', () => {
    const html = table(row('USD','100','34','33') + row('SGD','100','26','27'));
    expect(parseSuperRichPage(html + html, date)).toHaveLength(1);
    expect(parseSuperRichPage(html, 'invalid')).toEqual([]);
  });
});
