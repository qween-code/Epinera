const WS = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export function buildLogStreamUrl(token: string) {
  return `${WS}/logs/stream?token=${encodeURIComponent(token)}`;
}
