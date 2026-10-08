/**
 * Penyimpanan sesi di browser. Memakai key yang sama dengan Frontend Vite
 * (siapsiaga_token / siapsiaga_user) agar konsisten.
 */
export type StoredUser = { id: number; name: string; email: string; role: string };

const TOKEN_KEY = "siapsiaga_token";
const USER_KEY = "siapsiaga_user";

export function getSession(): { token: string | null; user: StoredUser | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    return { token, user: userStr ? JSON.parse(userStr) : null };
  } catch {
    return { token: null, user: null };
  }
}

export function saveSession(token: string, user?: StoredUser | null) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // localStorage tidak tersedia (mode privat, dsb.)
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // abaikan
  }
}
