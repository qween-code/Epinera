# OpenRouter Free Model Seçimi

> Son güncelleme: 2026-04-28. Bu dokümanı güncel tutmak için
> `scripts/list_openrouter_models.py` ile haftalık olarak liste yenileyin
> (aşağıda detay).

## Sentinel için görev bazlı seçim

Sistem `complete(profile=...)` ile farklı modellere yönlendirme yapar.
`.env`'de tanımlı dört "rol" vardır:

| Rol      | Env değişkeni                        | Kullanım                            |
|----------|--------------------------------------|-------------------------------------|
| text     | `OPENAI_COMPAT_TEXT_MODEL`           | Varsayılan analiz, chat             |
| vision   | `OPENAI_COMPAT_VISION_MODEL`         | Resim ekli istekler (OCR sonrası)   |
| triage   | `OPENAI_COMPAT_TRIAGE_MODEL`         | Hızlı sınıflandırma, anomali skoru  |
| heavy    | `OPENAI_COMPAT_HEAVY_MODEL`          | Büyük log + karmaşık kök neden      |

## Mevcut Free model haritası (Nisan 2026)

### Multimodal (text + image)

| Model                                          | Params       | Güçlü olduğu konu               | Notlar                              |
|------------------------------------------------|--------------|---------------------------------|-------------------------------------|
| `google/gemma-4-31b-it:free`                   | 31B          | Genel amaçlı, multimodal, tr/en | **Birincil text & vision**          |
| `tencent/hy3-preview:free`                     | preview      | Çok dilli, vision               | Stabilite test ediliyor             |

### Reasoning / heavy

| Model                                          | Params              | Güçlü olduğu konu             | Notlar                              |
|------------------------------------------------|---------------------|--------------------------------|-------------------------------------|
| `nvidia/nemotron-3-super-120b-a12b:free`       | 120B / 12B aktif   | Akıl yürütme, hızlı (MoE)      | **Birincil heavy** — büyük loglar  |
| `inclusionai/ling-2.6-1t:free`                 | 1T (sparse)        | Çok büyük bağlam, derin yorum  | Yavaş; nadir vakalarda             |

### Hızlı / küçük (triage)

| Model                                          | Params  | Güçlü olduğu konu          | Notlar                              |
|------------------------------------------------|---------|-----------------------------|-------------------------------------|
| `liquid/lfm-2.5-1.2b-thinking:free`            | 1.2B    | Hızlı triage, etiketleme    | **Birincil triage** — sub-saniye   |

## Seçim mantığı

```
yeni log/dosya gelir
   │
   ▼
[triage modeli] ── severity + tag tahmini ──► gerekirse incident aç
   │ (gerek varsa)
   ▼
[text/vision modeli] ── tam analiz, kök neden, aksiyon önerisi
   │ (yetersiz kaldıysa)
   ▼
[heavy modeli] ── geniş bağlam ile derin yorum
```

## Limitler ve risk yönetimi

OpenRouter free modellerin günlük/dakika limitleri vardır
(`https://openrouter.ai/docs/limits`). Sistem zaten `FallbackProvider`
ile birinci başarısız olursa Ollama'ya düşüyor; lokal Ollama her zaman
hazır olmalı. **Önerilir:** lokalde en az `qwen3.5:9b` ve `bge-m3`
indirilmiş olsun.

## Listeyi güncelleme

```bash
docker compose exec backend python -m scripts.list_openrouter_models
```

Çıktıda:
- En yeni free modeller (son 30 gün)
- Bağlam uzunluğu (4K → 1M)
- Multimodal destekleyenler işaretli

Çıktıyı bu dokümana yapıştırın; periyodik olarak (haftada 1) çalıştırın.

## OpenRouter dışı kontrollü deneme

Bir modeli göreve almadan önce `/chat/completions` ile sentetik bir
test atın:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_COMPAT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemma-4-31b-it:free",
    "messages": [{"role":"user","content":"merhaba"}]
  }'
```

200 + JSON dönüyorsa ekle. 429/503 sık alıyorsanız listeden çıkarın.

## Faturalandırma kontrolü

OpenRouter dashboard'da "Activity" sekmesinden free istekleri gözleyin.
`HTTP-Referer` ve `X-Title` header'ları sistem tarafından otomatik
gönderiliyor → orada "Sentinel" olarak listelenir.
