export function parsePositiveDecimal(raw: string | string[] | undefined, fallback: number, minimum = 0) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return fallback;
  const normalized = value.trim().replace(/,/g, '');
  if (!/^\d+(\.\d+)?$/.test(normalized)) return fallback;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < minimum) return fallback;
  return parsed;
}

export function inspectPositiveDecimal(raw: string | string[] | undefined, minimum = 0) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) {
    return { raw: '', normalized: '', valid: false, reason: 'empty' as const, parsed: null };
  }

  const normalized = value.trim().replace(/,/g, '');
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return { raw: value, normalized, valid: false, reason: 'format' as const, parsed: null };
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < minimum) {
    return { raw: value, normalized, valid: false, reason: 'minimum' as const, parsed: null };
  }

  return { raw: value, normalized, valid: true, reason: null, parsed };
}

export function formatInputAmount(value: number, maximumFractionDigits = 8) {
  if (!Number.isFinite(value)) return '';
  return value.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits,
  });
}

export function formatDisplayAmount(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
) {
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('en-US', {
    useGrouping: true,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  });
}

export function isCompletePositiveDecimal(value: string) {
  const normalized = value.trim().replace(/,/g, '');
  return /^\d+(\.\d+)?$/.test(normalized);
}
