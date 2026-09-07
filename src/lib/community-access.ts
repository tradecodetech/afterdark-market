export function hasCommunityAccess(owner: boolean, membership: { expiresAt: Date; cancelled: boolean; isDemo: boolean } | null, demoEnabled: boolean, now = new Date()) {
  return owner || Boolean(membership && !membership.cancelled && membership.expiresAt > now && (!membership.isDemo || demoEnabled));
}

export function validAmount(value: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && cents >= 100 && cents <= 50000 ? cents : null;
}
