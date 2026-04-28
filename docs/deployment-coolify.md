# Coolify Self-Hosted Deployment

İleride lokalden çıkıp self-hosted bir sunucuya deploy etmek için
[Coolify](https://coolify.io/) kullanacağız. Coolify, Heroku/Vercel/Railway
benzeri bir self-hosted PaaS — Docker Compose'u native olarak destekler.

## Ön koşullar

- Bir Linux sunucu (4 CPU / 8 GB RAM önerilir, GPU isteğe bağlı)
- Domain (opsiyonel — Caddy/Traefik ile otomatik HTTPS)
- Coolify kurulu: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`

## Adımlar

### 1. Coolify'da yeni "Resource" → "Docker Compose" oluştur

- **Source:** Git repository (qween-code/Epinera)
- **Branch:** `main` (veya istediğin)
- **Compose file:** `docker-compose.yml`
- **Build pack:** Docker Compose

### 2. Environment variables'ı Coolify UI'sinden gir

`.env.example` içindeki tüm anahtarları Coolify'ın "Environment" sekmesine
ekle. Hassas alanlar (`ANTHROPIC_API_KEY`, `SMTP_PASSWORD`,
`PROMANAGE_PASSWORD`, `ADMIN_PASSWORD`):
- "Is Build Time" işaretini KAPALI tut
- "Is Locked" işaretini AÇIK tut

### 3. Persistent volumes

Coolify'ın "Storages" sekmesinde aşağıdakileri NamedVolume olarak tanımla:

| Volume                     | Mount path                       | Servis    |
|----------------------------|----------------------------------|-----------|
| `sentinel_postgres_data`   | `/var/lib/postgresql/data`       | postgres  |
| `sentinel_redis_data`      | `/data`                          | redis     |
| `sentinel_storage`         | `/app/storage`                   | backend   |

(Mevcut `docker-compose.yml`'deki bind mount'lar yerine.)

### 4. Domain & TLS

Backend ve frontend için iki ayrı domain bağla:
- `sentinel.<senin-domain>.com` → frontend (port 3000)
- `api.sentinel.<senin-domain>.com` → backend (port 8000)

Coolify Caddy ile Let's Encrypt sertifikasını otomatik alır.

### 5. WebSocket

Backend `/logs/stream` WebSocket endpoint'i için Coolify proxy
varsayılan olarak WS desteği veriyor; özel bir konfigürasyon gerekmiyor.

### 6. AI servisleri

İki seçenek:

**A. Aynı sunucuda Ollama:**
Coolify'da yeni bir resource olarak `ollama/ollama` imajını ekle, GPU
varsa `--gpus all` runtime ile çalıştır. `.env`'de
`OLLAMA_BASE_URL=http://ollama:11434` yap (network'leri Coolify'da bağla).

**B. Anthropic API + LM Studio uzaktan:**
Lokal makinende çalışan LM Studio'yu Tailscale ile expose et,
`OPENAI_COMPAT_BASE_URL=http://lm-studio.tailnet:1234/v1` yap.

## Migration

İlk deploy sonrası bir kez:

```bash
docker exec -it sentinel-backend alembic upgrade head
```

Coolify'ın "Pre-deploy command" alanına da yazılabilir:
```
alembic upgrade head
```

## Yedekleme

Coolify "Backups" sekmesinden Postgres için günlük backup planla.
`storage/uploads` için dış bir S3-uyumlu (MinIO/Backblaze/R2)
hedef tanımla.

## Geçiş yol haritası

1. **Şimdi (Faz 0):** Lokalde Docker Compose
2. **Faz 1:** Coolify'a deploy, hala tek kullanıcı
3. **Faz 2 (gerekirse):** GPU sunucu eklemesi (vLLM ile self-hosted Qwen3.5)
4. **Faz 3:** Yedek + monitoring (Coolify built-in)
