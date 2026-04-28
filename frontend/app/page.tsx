"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Loader2 } from "lucide-react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-border bg-surface rounded-lg p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Activity className="text-accent" />
          <div>
            <div className="font-semibold">Sentinel</div>
            <div className="text-xs text-muted">SAP &amp; ProManage Gözetim</div>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted">Kullanıcı adı</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 bg-bg border border-border rounded-md px-3 py-2 text-sm"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Parola</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 bg-bg border border-border rounded-md px-3 py-2 text-sm"
            autoComplete="current-password"
          />
        </div>

        {error && <div className="text-xs text-danger">{error}</div>}

        <button
          disabled={busy}
          className="w-full py-2 rounded-md bg-accent text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          Giriş yap
        </button>
      </form>
    </div>
  );
}
