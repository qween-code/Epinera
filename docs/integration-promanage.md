# ProManage Entegrasyonu

## Neden gerekiyor

- Canlı log akışı (anomali tespiti, otomatik incident oluşturma)
- Yerinde aksiyon yürütme (kullanıcı yetki sınırı içinde)
- Hata raporlamada bağlam (modül adı, kullanıcı, zaman damgası)

## Toplama modları

`.env` üzerinden seçilir: `PROMANAGE_STREAM_MODE=poll|sse|websocket`

### poll (varsayılan, en geniş uyumluluk)
- `PROMANAGE_LOG_STREAM_URL` → REST endpoint
- `PROMANAGE_POLL_INTERVAL_SECONDS=5`
- Endpoint cevabı `{events: [...], cursor: "..."}` veya doğrudan dizi olabilir
- Cursor varsa bir sonraki istekte `?since=<cursor>` ile gönderilir

### sse / websocket
- Şu an iskelet — kullanım belirginleştiğinde implemente edilecek

## Olay normalizasyonu

`app/services/parser/promanage.py` her olayı şu şekle dönüştürür:

```json
{
  "ts": "2026-04-28T10:01:00+03:00",
  "severity": "ERROR",
  "module": "...",
  "message": "...",
  "raw": { ... orijinal ... }
}
```

Bu mesaj `Redis pub/sub: logs:promanage` kanalına yayınlanır;
`/logs/stream` WebSocket'i tüm istemcilere iletir.

## Yerinde aksiyon

`app/services/actions/promanage_action.py`. Etkinleştirmek için:

```
PROMANAGE_BASE_URL=https://promanage.local
PROMANAGE_USERNAME=...
PROMANAGE_PASSWORD=...
```

LLM'in önerdiği aksiyonlar `actions` tablosunda `requires_approval=true`
olarak saklanır; kullanıcı onaylayınca tetiklenir. İlk faz hep manuel
onaylı; otomatik (whitelist) aksiyonlar Faz 2'de eklenecek.

## Açık sorular (kullanıcı tarafı)

- ProManage hangi kimlik doğrulama mekanizmasını kullanıyor? (Basic, OAuth, token?)
- Canlı log endpoint'inin tam şeması (örnek payload gerekli)
- "Yerinde aksiyon" altında hangi operasyonlara izin var? (whitelist gerekli)
