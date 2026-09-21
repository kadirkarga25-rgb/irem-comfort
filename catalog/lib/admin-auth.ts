import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'ic_admin';
const TTL = 1000 * 60 * 60 * 12;

function secret() { return process.env.ADMIN_SESSION_SECRET || 'change-this-irem-comfort-session-secret'; }
export function signAdminToken() { const ts = String(Date.now()); const sig = createHmac('sha256', secret()).update(ts).digest('hex'); return `${ts}.${sig}`; }
export function verifyAdminToken(token?: string) {
  if (!token) return false; const [ts,sig] = token.split('.'); if (!ts || !sig) return false;
  if (Date.now() - Number(ts) > TTL || Number(ts) > Date.now()) return false;
  const expected = createHmac('sha256', secret()).update(ts).digest('hex');
  try { return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)); } catch { return false; }
}
