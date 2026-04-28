# Mimari

## Üst düzey akış

```
        ┌──────────────────┐
ProManage│  Canlı log feed  │ ────► PROMANAGE_LOG_STREAM_URL
        └──────────────────┘
                    │
                    ▼
        ┌──────────────────────┐         ┌──────────────────────┐
        │ collector.poller     │ Redis   │ FastAPI WebSocket    │
        │ (poll/sse/ws)        │  pub    │  /logs/stream        │ ────► Frontend
        └──────────────────────┘  →sub   └──────────────────────┘  (xterm-style)

        ┌──────────────────┐
Manuel  │  /uploads/analyze │ ────► OCR (PaddleOCR) + parser → analyzer
yükleme └──────────────────┘                                   │
                                                               ▼
                                                  ┌────────────────────┐
                                                  │  AI Provider       │
                                                  │  (Anthropic/Ollama)│
                                                  └────────────────────┘
                                                               │
                                                               ▼
                                                  ┌────────────────────┐
                                                  │ Incident + Actions │
                                                  └────────────────────┘
                                                               │
                                       ┌───────────────────────┼───────────────────────┐
                                       ▼                       ▼                       ▼
                              promanage_action            send_email              open_ticket
                                (yetki içi)              (SMTP)                  (mail bazlı)
```

## Bileşenler

### Backend (FastAPI)
- `app/api/*` — REST + WebSocket endpoint'leri
- `app/services/ai/*` — LLM router (Anthropic + Ollama, fallback destekli)
- `app/services/ocr/paddle.py` — Resimden Türkçe + İngilizce metin çıkarma
- `app/services/parser/*` — SAP dump, ProManage event ve generic log
- `app/services/analyzer/engine.py` — LLM ile yapılandırılmış JSON analizi
- `app/services/kb/*` — pgvector tabanlı semantik arama (RAG)
- `app/services/actions/*` — email, ticket, ProManage in-place
- `app/services/collector/promanage_stream.py` — Redis pub/sub yayıncı

### Frontend (Next.js)
- `/` Login
- `/dashboard` — Incident listesi
- `/dashboard/[id]` — Detay + aksiyon onayı + chat + çözüm kaydı
- `/logs` — Canlı log akışı (WebSocket)
- `/upload` — Dosya / resim analizi
- `/chat` — Bağımsız asistan
- `/knowledge` — Know-how semantik arama

## AI seçimi

`AI_PROVIDER=anthropic|ollama` (env). Birinci başarısız olursa
`AI_FALLBACK_PROVIDER` devreye girer. Multimodal istek (resim ekli)
geldiğinde router otomatik olarak vision-capable modele yönlendirir.

## Veri modeli özeti

| Tablo               | Amaç                                               |
|---------------------|----------------------------------------------------|
| `incidents`         | Tespit edilen / yüklenen vakalar                   |
| `log_events`        | Kalıcı log (filtre, tarih aralığı sorguları için)  |
| `file_assets`       | Yüklenmiş dosya/resim, çıkarılan metin, analiz    |
| `actions`           | Önerilen/yürütülen aksiyonlar (onay akışı)         |
| `chat_messages`     | Asistan ile sohbet geçmişi                         |
| `knowledge_entries` | Damıtılmış know-how (problem/kök neden/çözüm + vec)|
