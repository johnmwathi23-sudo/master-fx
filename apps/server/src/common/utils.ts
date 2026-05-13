export function generateReferralCode(username: string): string {
  const prefix = username.slice(0, 4).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${suffix}`;
}
