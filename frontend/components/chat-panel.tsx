"use client";
import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChatPanel({ incidentId }: { incidentId?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput("");
    setBusy(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      incident_id: incidentId ?? null,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const reply = await apiFetch<ChatMessage>("/chat/", {
        method: "POST",
        body: JSON.stringify({ incident_id: incidentId, content: text }),
      });
      setMessages((m) => [...m, reply]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          incident_id: null,
          role: "assistant",
          content: `Hata: ${(e as Error).message}`,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted">
            Hata ekran metnini, log özetini veya sorunu yazın. Sistem geçmiş
            vakalardan benzer çözümleri bulup öneri sunar.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-3",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {m.role !== "user" && (
              <Bot size={16} className="mt-1 text-accent shrink-0" />
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-accent/15 border border-accent/30"
                  : "bg-elev border border-border",
              )}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <User size={16} className="mt-1 text-muted shrink-0" />
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3 flex gap-2 bg-surface">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder="Sorunu, hata mesajını veya log parçasını yazın…"
          className="flex-1 bg-bg border border-border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-accent"
        />
        <button
          onClick={send}
          disabled={busy}
          className="px-3 py-2 rounded-md bg-accent text-white text-sm hover:bg-accent/90 disabled:opacity-50 flex items-center gap-1"
        >
          <Send size={14} /> Gönder
        </button>
      </div>
    </div>
  );
}
