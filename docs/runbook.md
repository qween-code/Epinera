# Runbook — günlük kullanım

## İlk kurulum (lokal makine)

```bash
git clone <repo> Epinera
cd Epinera
cp .env.example .env
# .env içinde minimum:
#   ADMIN_PASSWORD=
#   ANTHROPIC_API_KEY=  (anthropic kullanılacaksa)
#   PROMANAGE_LOG_STREAM_URL=  (canlı log için)
#   SMTP_*  (mail/ticket için)

docker compose up -d --build
docker compose exec backend alembic upgrade head
```

Frontend: <http://localhost:3000> (admin / .env'de tanımlı parola)
Backend swagger: <http://localhost:8000/docs>

## Ollama kullanmak istiyorsan

Host makinede çalışan Ollama servisine container'dan
`host.docker.internal:11434` ile erişilir. Modelleri çek:

```bash
ollama pull llama3.1:8b
ollama pull qwen2-vl:7b
ollama pull mxbai-embed-large
```

Sonra `.env`:
```
AI_PROVIDER=ollama
AI_FALLBACK_PROVIDER=anthropic
```

## Tipik akışlar

### 1. Manuel hata analizi (ProManage ekran görüntüsü)
1. `/upload` sayfasına git
2. Görseli sürükle, kaynak: ProManage
3. "Analiz et" → OCR + LLM → incident oluşur
4. Detay sayfasında önerilen aksiyonları onayla
5. Çözüldükten sonra "Know-How'a kaydet"

### 2. Canlı log izleme
1. `.env` içinde `PROMANAGE_LOG_STREAM_URL` doluysa, backend başlangıçta
   poller'ı çalıştırır
2. `/logs` sayfası WebSocket üzerinden olayları gösterir
3. (İleride) anomali tespiti otomatik incident oluşturacak

### 3. SAP problemi → ticket akışı
1. Hata ekranını veya log dump'ını yükle (kaynak: SAP)
2. LLM SAP-yetki-yok bağlamında ticket aksiyonu önerir
3. Aksiyonu onayla → `TICKET_TO_EMAIL` adresine yapılandırılmış mail gider

## Bakım

| İşlem                        | Komut                                                  |
|------------------------------|-------------------------------------------------------|
| Migration üret               | `docker compose exec backend alembic revision --autogenerate -m "msg"` |
| Migration uygula             | `docker compose exec backend alembic upgrade head`    |
| Veritabanını sıfırla         | `docker compose down && rm -rf docker/data/postgres`  |
| Backend logları              | `docker compose logs -f backend`                      |
| Frontend lint                | `docker compose exec frontend npm run lint`           |
| Backend test                 | `docker compose exec backend pytest`                  |

## Sorun giderme

- **WebSocket bağlanmıyor**: `.env` içinde `NEXT_PUBLIC_WS_URL` doğru mu?
  Tarayıcı localStorage'ında token var mı? (Logout/login dene.)
- **OCR yavaş ilk istekte**: PaddleOCR ilk çağrıda model indirir (1-2 dk).
  Sonraki istekler hızlı olur.
- **pgvector hatası**: `CREATE EXTENSION vector` çalışmadıysa
  `pgvector/pgvector:pg16` imajı kullanıldığını doğrula.
