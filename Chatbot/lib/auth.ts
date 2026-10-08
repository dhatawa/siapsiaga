/**
 * Verifikasi token login ke backend Express Siap Siaga (GET /api/auth/me).
 * Backend yang sama memeriksa tanda tangan JWT, masa berlaku, dan status akun.
 */
export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function verifyUser(authHeader: string | null): Promise<AuthUser | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data?.data?.user ?? null;
  } catch (err) {
    console.error("Gagal menghubungi backend untuk verifikasi token:", err);
    return null;
  }
}
