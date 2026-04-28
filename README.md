# Epinera — SAP & ProManage Sentinel

Proaktif gözetim ve problem önleme sistemi. SAP ve ProManage tarafından üretilen
log, dosya ve ekran görüntülerini otomatik olarak analiz eder; üretim
durmadan müdahale önerir veya uygular, gerektiğinde ticket açar / mail gönderir.

## Hedefler

- ProManage canlı log akışını sürekli izlemek ve anomali tespit etmek
- SAP/ProManage hata ekran görüntülerini OCR + LLM ile yorumlamak
- ProManage tarafında **yetki sınırı içinde** doğrudan aksiyon almak
- SAP tarafında (yetki yok) **ticket aç + mail gönder** ile süreci tetiklemek
- Her vakayı *Problem / Kök neden / Çözüm / Aktör / Süre* olarak kayıt altına almak
- Geçmiş vakalardan vektör arama (RAG) ile hızlı çözüm önerisi üretmek

## Tech Stack

| Katman          | Teknoloji                                                  |
|-----------------|-----------------------------------------------------------|
| Backend         | Python 3.12 + FastAPI + SQLAlchemy 2 + Alembic            |
| Veritabanı      | PostgreSQL 16 + pgvector                                  |
| Realtime        | Redis pub/sub + FastAPI WebSocket                         |
| AI (on-prem)    | Ollama → **Qwen3.5 / Qwen3-VL / Gemma 4** (varsayılan)    |
| AI (API)        | Anthropic Claude (multimodal)                             |
| AI (köprü)      | OpenAI-compatible: LM Studio / vLLM / LiteLLM / OpenRouter|
| OCR             | PaddleOCR (Türkçe dahil)                                  |
| Frontend        | Next.js 15 + TypeScript + Tailwind                        |
| Canlı log       | WebSocket + Redis pub/sub                                 |
| Lokal           | Docker Compose                                            |
| Self-hosted     | Coolify (ileride; bkz `docs/deployment-coolify.md`)       |

## Hızlı başlangıç

```bash
cp .env.example .env
# .env içindeki ANTHROPIC_API_KEY, SMTP_* ve PROMANAGE_* alanlarını doldur

docker compose up -d --build

# İlk migration
docker compose exec backend alembic upgrade head

# Frontend: http://localhost:3000
# Backend swagger: http://localhost:8000/docs
```

## Klasör yapısı

```
backend/        FastAPI servisi, AI/parser/OCR/KB modülleri
frontend/       Next.js dashboard (canlı log, chat, KB, upload)
docker/         Postgres init, ek konteyner config'leri
docs/           Mimari ve entegrasyon dökümanları
scripts/        Yardımcı bakım/seed scriptleri
```

## Geliştirme

| Komut                                        | Açıklama                       |
|----------------------------------------------|--------------------------------|
| `docker compose up -d`                       | Tüm yığını başlatır            |
| `docker compose logs -f backend`             | Backend loglarını izler        |
| `docker compose exec backend pytest`         | Backend testleri               |
| `docker compose exec backend ruff check .`   | Lint                           |
| `docker compose exec backend alembic ...`    | Migration komutları            |
| `docker compose exec backend python -m scripts.list_openrouter_models` | Free modelleri listele |

## Dokümantasyon

- [Mimari](docs/architecture.md)
- [Veri modeli](docs/data-model.md)
- [Runbook](docs/runbook.md)
- [AI provider seçimi & LiteLLM köprüsü](docs/integration-ai-providers.md)
- [OpenRouter free model curation](docs/ai-models-curation.md)
- [Vector DB / RAG karşılaştırma](docs/vector-stores.md)
- [ProManage entegrasyonu](docs/integration-promanage.md)
- [SAP entegrasyonu](docs/integration-sap.md)
- [Coolify deployment](docs/deployment-coolify.md)
- [Yol haritası](docs/roadmap.md)
