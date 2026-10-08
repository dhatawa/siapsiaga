"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import LoginForm from "@/components/LoginForm";
import { clearSession, getSession, saveSession, type StoredUser } from "@/lib/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type Session = { token: string; user: StoredUser };

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function init() {
      // Token dari website Siap Siaga (tombol "Layar penuh" di popup chatbot)
      // dikirim lewat hash URL agar tidak ikut terkirim ke server/log.
      const hashToken = new URLSearchParams(window.location.hash.slice(1)).get("token");
      if (hashToken) {
        saveSession(hashToken);
        window.history.replaceState(null, "", window.location.pathname);
      }

      const { token } = getSession();
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data?.data?.user) {
          saveSession(token, data.data.user);
          setSession({ token, user: data.data.user });
        } else {
          clearSession();
        }
      } catch {
        // Backend tidak bisa dihubungi: pakai data tersimpan, API chat tetap memverifikasi token.
        const stored = getSession();
        if (stored.user) setSession({ token, user: stored.user });
      }
      setChecking(false);
    }
    init();
  }, []);

  function handleLogout() {
    clearSession();
    setSession(null);
  }

  if (checking) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
          <p className="mt-4 text-sm text-gray-500">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <LoginForm
        backendUrl={BACKEND_URL}
        onLogin={(token, user) => {
          saveSession(token, user);
          setSession({ token, user });
        }}
      />
    );
  }

  return <ChatWindow token={session.token} user={session.user} onLogout={handleLogout} />;
}
