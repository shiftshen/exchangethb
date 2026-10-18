const allowedCodes = new Set([
  'http_failure', 'proxy_http_failure', 'transport_or_io_failure',
  'cleanup_requires_review', 'target_rejected', 'output_rejected',
  'arguments_rejected', 'limits_rejected', 'cross_origin_redirect',
  'redirect_rejected', 'redirect_limit', 'size_limit', 'body_time_limit',
  'incomplete_body', 'encoding_rejected',
]);

// Keep only the helper's public diagnostics. Never persist stderr, URLs or headers.
export function collectionFailure(error: unknown) {
  try {
    if (!error || typeof error !== 'object' || !('stdout' in error)) throw new Error();
    const stdout = error.stdout;
    if (!Buffer.isBuffer(stdout) && typeof stdout !== 'string') throw new Error();
    const parsed = JSON.parse(stdout.toString());
    return {
      code: allowedCodes.has(parsed.code) ? parsed.code as string : 'unclassified_failure',
      httpStatus: Number.isInteger(parsed.http_status) && parsed.http_status >= 100 && parsed.http_status <= 599 ? parsed.http_status as number : null,
    };
  } catch {
    return { code: 'unclassified_failure', httpStatus: null };
  }
}
