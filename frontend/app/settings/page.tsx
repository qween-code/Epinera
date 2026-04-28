import { TopBar } from "@/components/topbar";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Ayarlar" subtitle="Servis konfigürasyonu .env dosyasından yapılır" />
      <div className="p-6 max-w-3xl space-y-4 text-sm">
        <section>
          <h3 className="font-semibold mb-2">Yapılandırma</h3>
          <p className="text-muted">
            Tüm ayarlar projenin kökündeki <code>.env</code> dosyasındadır.
            Değişiklikten sonra <code>docker compose up -d</code> ile servisler
            yeniden başlatılmalıdır.
          </p>
        </section>
        <section>
          <h3 className="font-semibold mb-2">Önemli alanlar</h3>
          <ul className="list-disc pl-6 space-y-1 text-muted">
            <li>
              <code>AI_PROVIDER</code> — anthropic | ollama
            </li>
            <li>
              <code>ANTHROPIC_API_KEY</code> — Anthropic API anahtarı
            </li>
            <li>
              <code>OLLAMA_BASE_URL</code> — Lokal Ollama servisi
              (varsayılan: <code>http://host.docker.internal:11434</code>)
            </li>
            <li>
              <code>PROMANAGE_LOG_STREAM_URL</code> — Canlı log endpoint'i
            </li>
            <li>
              <code>SMTP_*</code> — Mail gönderimi
            </li>
            <li>
              <code>TICKET_TO_EMAIL</code> — SAP/Albil ticket'ları için hedef
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
