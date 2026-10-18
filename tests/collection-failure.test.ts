import { describe, expect, it } from 'vitest';
import { collectionFailure } from '../lib/scrapers/collection-failure';

describe('collection failure diagnostics', () => {
  it('distinguishes a rejected source while excluding private diagnostics', () => {
    expect(collectionFailure({ stdout: Buffer.from(JSON.stringify({ code: 'http_failure', http_status: 403, url: 'private', cookie: 'secret' })), stderr: 'secret' })).toEqual({ code: 'http_failure', httpStatus: 403 });
  });
  it('does not persist arbitrary error messages or unknown helper output', () => {
    expect(collectionFailure(new Error('secret'))).toEqual({ code: 'unclassified_failure', httpStatus: null });
    expect(collectionFailure({ stdout: '{"code":"secret","http_status":999}' })).toEqual({ code: 'unclassified_failure', httpStatus: null });
  });
});
