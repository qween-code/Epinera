# AI Provider Entegrasyonu

Sistem 3 farklı sağlayıcı tipini destekler. `.env` üzerinden seçim yapılır.

```env
AI_PROVIDER=ollama|anthropic|openai_compat
AI_FALLBACK_PROVIDER=ollama|anthropic|openai_compat|none
```

İlk başarısız olursa fallback devreye girer.

## 1) Ollama (varsayılan, on-prem, ücretsiz)

Lokalde Ollama servisini çalıştırırsın; modeller bilgisayarında.

### Önerilen güncel modeller (2026)

| Görev          | Model              | RAM/VRAM (yaklaşık) |
|----------------|--------------------|---------------------|
| Metin & akıl   | `qwen3.5:9b`       | ~9 GB               |
| Metin & akıl   | `gemma4:e4b`       | ~6 GB               |
| Vision         | `qwen3-vl:8b`      | ~10 GB              |
| Vision (küçük) | `gemma4:e2b`       | ~4 GB               |
| Embedding      | `bge-m3`           | ~1 GB (1024 dim)    |
| Üst seviye     | `qwen3.6:27b`      | ~28 GB              |

```bash
ollama pull qwen3.5:9b
ollama pull qwen3-vl:8b
ollama pull bge-m3
```

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_TEXT_MODEL=qwen3.5:9b
OLLAMA_VISION_MODEL=qwen3-vl:8b
OLLAMA_EMBED_MODEL=bge-m3
```

> **Not:** Embedding modelinin boyutu pgvector kolon boyutu (1024) ile
> uyumlu olmalı. `bge-m3` zaten 1024'tür. Farklı boyutta bir model
> kullanmak isterseniz `alembic` ile yeni bir migration gerekir.

## 2) Anthropic API

Resmi Claude API.

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
AI_TEXT_MODEL=claude-opus-4-7
AI_VISION_MODEL=claude-opus-4-7
```

> Anthropic native embedding sunmuyor. Embedding fallback olarak Ollama'ya
> düşer; bu yüzden Ollama'yı yine de kurman önerilir.

## 3) OpenAI-Compatible (LM Studio / vLLM / LiteLLM / OpenRouter / Together / vb.)

`/v1/chat/completions` ve `/v1/embeddings` standart endpoint'lerini
sunan herhangi bir servisle çalışır.

### A. Lokal: LM Studio (UI ile model indir, abonelik gerektirmez)

```env
AI_PROVIDER=openai_compat
OPENAI_COMPAT_BASE_URL=http://host.docker.internal:1234/v1
OPENAI_COMPAT_API_KEY=lm-studio
OPENAI_COMPAT_TEXT_MODEL=qwen/qwen3.5-9b-gguf
OPENAI_COMPAT_VISION_MODEL=qwen/qwen3-vl-8b-gguf
OPENAI_COMPAT_EMBED_MODEL=bge-m3
```

### B. Lokal: vLLM (GPU varsa, çok daha hızlı)

```bash
docker run --gpus all -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen3.5-9B-Instruct
```

```env
OPENAI_COMPAT_BASE_URL=http://vllm:8000/v1
```

### C. LiteLLM Proxy (köprü — abonelik bazlı servisleri tek noktadan)

LiteLLM, 100+ sağlayıcıyı tek bir OpenAI-compatible endpoint arkasında
toplar. **Subscription bazlı kullanım örnekleri:**

```yaml
# litellm-config.yaml
model_list:
  - model_name: claude-opus-4-7
    litellm_params:
      model: anthropic/claude-opus-4-7
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
  - model_name: qwen-local
    litellm_params:
      model: ollama/qwen3.5:9b
      api_base: http://host.docker.internal:11434
```

```bash
docker run -p 4000:4000 \
  -v $PWD/litellm-config.yaml:/app/config.yaml \
  -e ANTHROPIC_API_KEY=... \
  -e OPENAI_API_KEY=... \
  ghcr.io/berriai/litellm:main \
  --config /app/config.yaml
```

```env
AI_PROVIDER=openai_compat
OPENAI_COMPAT_BASE_URL=http://litellm:4000/v1
OPENAI_COMPAT_TEXT_MODEL=claude-opus-4-7
OPENAI_COMPAT_VISION_MODEL=gpt-4o
```

### D. OpenRouter (tek API key — yüzlerce model)

```env
OPENAI_COMPAT_BASE_URL=https://openrouter.ai/api/v1
OPENAI_COMPAT_API_KEY=sk-or-...
OPENAI_COMPAT_TEXT_MODEL=qwen/qwen3.5-9b-instruct
OPENAI_COMPAT_VISION_MODEL=qwen/qwen3-vl-8b
```

## Abonelik (Web login) ile kullanım hakkında

ChatGPT.com / Claude.ai gibi web arayüzlerine **çerez/oturum tabanlı**
otomatik bağlanmak resmi olarak desteklenmiyor ve her iki servisin de
ToS'una aykırıdır. Bunun yerine pratik yollar:

1. **Claude Pro + LiteLLM:** Anthropic API anahtarını al (Claude Pro
   aboneliğinden bağımsız bir kontör değildir; ayrı kotalı). LiteLLM
   ile köprüle.
2. **GitHub Copilot Subscription bridge:** `copilot-api` benzeri açık
   kaynak köprüler GitHub Copilot aboneliğini OpenAI-compatible'a
   dönüştürür.
3. **Lokal modeller:** Abonelik gerekmez, sınır yok. Qwen3.5 / Gemma 4
   açık ağırlıklarla yeterince güçlü; bu sistem zaten varsayılanda
   bunları kullanıyor.

Sistem bu üç yolun hepsiyle uyumlu — `.env` ile geçiş yaparsın.
