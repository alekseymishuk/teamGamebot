const ADMIN_IDS = [123456789]; // ← твой Telegram ID

export function isAdmin(userId: number): boolean {
  return ADMIN_IDS.includes(userId);
}
