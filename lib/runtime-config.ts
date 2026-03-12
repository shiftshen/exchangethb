const placeholderValues = new Set([
  '',
  'replace_with_strong_password',
  'scrypt_replace_with_salt_and_hash',
  'replace_with_long_random_secret',
  'admin@exchangethb.com',
  'dev-session-secret-change-me',
]);

function isPlaceholder(value?: string | null) {
  return placeholderValues.has((value || '').trim());
}

export function getRuntimeConfigWarnings() {
  const warnings: string[] = [];
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@exchangethb.com';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || 'dev-session-secret-change-me';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exchangethb.com';

  if (isPlaceholder(adminEmail)) warnings.push('ADMIN_EMAIL is still using the default placeholder value.');
  if (!adminPasswordHash && !adminPassword) warnings.push('No admin password or password hash is configured.');
  if (adminPassword && isPlaceholder(adminPassword)) warnings.push('ADMIN_PASSWORD is still using the placeholder value.');
  if (adminPasswordHash && isPlaceholder(adminPasswordHash)) warnings.push('ADMIN_PASSWORD_HASH is still using the placeholder value.');
  if (isPlaceholder(adminSessionSecret) || adminSessionSecret.length < 24) warnings.push('ADMIN_SESSION_SECRET is missing or too short for production use.');
  if (!siteUrl.startsWith('https://')) warnings.push('NEXT_PUBLIC_SITE_URL should use HTTPS in production.');

  return warnings;
}

export function hasUnsafeProductionConfig() {
  return process.env.NODE_ENV === 'production' && getRuntimeConfigWarnings().length > 0;
}
