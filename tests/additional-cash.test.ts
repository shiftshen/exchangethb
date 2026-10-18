import { describe,expect,it } from 'vitest';
import { parseAdditionalCash,publicationTime } from '@/lib/scrapers/additional-cash';
// Representative public-page structures; this fixture is not a live-source acceptance result.
describe('additional official cash parsers',()=>{
  it('reads Vasu denominations and official Bangkok publication time',()=>{
    const html='<p>Latest Update : Thu 1 October 2026 - 11:35</p><table><tr><td><img></td><td>USD L United States</td><td>USD 100</td><td>33.550</td><td>33.650</td></tr><tr><td>EUR</td><td>EUR 50</td><td>37.90</td><td>38.10</td></tr></table>';
    const rows=parseAdditionalCash(html,'vasu','2026-10-01T05:00:00Z');expect(rows).toHaveLength(2);expect(rows[0]).toMatchObject({buyRate:33.55,sellRate:33.65,denomination:'USD 100',observedAt:'2026-10-01T04:35:00.000Z',fetchedAt:'2026-10-01T05:00:00Z',timestampKind:'published'});
  });
  it('reads Twelve Victory headline rate with explicit banknote uncertainty',()=>{
    const rows=parseAdditionalCash('<p>Latest Update : 2026-10-01 09:20:25 Update 5</p><div>USD UNITED STATES OF AMERICA Buying 33.550 Selling 33.650</div>','twelve-victory');
    expect(rows[0]).toMatchObject({currency:'USD',buyRate:33.55,observedAt:'2026-10-01T02:20:25.000Z'});expect(rows[0].denomination).toContain('confirm');
  });
  it('rejects missing timestamps, mismatched buy/sell and unsupported currencies',()=>{
    expect(publicationTime('<p>No date</p>')).toBeNull();
    expect(publicationTime('<p>Latest Update : 2026-99-99 99:99</p>')).toBeNull();
    expect(parseAdditionalCash('<tr><td>USD</td><td>33.55</td><td>33.65</td></tr>','vasu')).toEqual([]);
    expect(parseAdditionalCash('<p>Latest Update : 2026-10-01 09:20</p><tr><td>USD</td><td>34</td><td>33</td></tr><tr><td>XXX</td><td>30</td><td>31</td></tr>','vasu')).toEqual([]);
  });
});
