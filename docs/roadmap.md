# Yol haritası

## Tamamlanan (Faz 0 — iskelet)
- [x] Proje yapısı, docker-compose, README
- [x] FastAPI + Next.js iskeleti
- [x] DB modelleri ve initial migration (incidents, log_events, file_assets, actions, chat, KB)
- [x] AI adapter (Anthropic + Ollama, fallback)
- [x] OCR (PaddleOCR) + SAP/ProManage/generic log parser
- [x] Upload + analiz endpoint'i + multimodal LLM JSON yanıt
- [x] Canlı log WebSocket + Redis pub/sub
- [x] Chat endpoint (RAG dahil)
- [x] KB CRUD + semantik arama
- [x] Action execute (email + ticket-via-mail + ProManage placeholder)
- [x] Frontend: login, dashboard, incident detay, canlı log, chat, upload, KB

## Sonraki — Faz 1 (production-ready küçük adımlar)
- [ ] file_watcher → background analiz görevi (RQ)
- [ ] Otomatik anomali kuralları (`anomaly.py`) → otomatik incident
- [ ] Burst & duplicate suppression (fingerprint)
- [ ] Frontend: incident detayda "tüm chat geçmişi" yükleme
- [ ] Otomatik KB damıtma (incident kapanırken LLM'e "bunu KB için özetle")

## Faz 2 — proaktif aksiyon
- [ ] ProManage operasyon whitelist'i (otomatik onay)
- [ ] Eşik bazlı otomatik mail/ticket
- [ ] Slack / MS Teams notifier (opsiyonel kanal)
- [ ] Tek satırlı runtime alert paneli

## Faz 3 — gözlemlenebilirlik & ölçek
- [ ] OpenTelemetry trace
- [ ] Time-series tablo (TimescaleDB extension veya partition)
- [ ] Düşük seviye log retention politikası
- [ ] Performans testi (burst senaryoları)

## Faz 4 — ileri AI
- [ ] Otomatik etiketleme (zero-shot classifier)
- [ ] Trend & forecast (Prophet) — proaktif uyarı
- [ ] Multi-incident korelasyon (aynı kök neden mi?)
