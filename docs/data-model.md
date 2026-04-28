# Veri modeli

## ER özeti

```
knowledge_entries 1───* incidents 1───* file_assets
                              │
                              ├───* actions
                              │
                              ├───* chat_messages
                              │
                              └───* log_events
```

## Tablolar

### incidents
- `title`, `source` (promanage|sap|manual_upload), `severity`, `status`
- `summary`, `root_cause`, `resolution`, `resolver`, `resolved_at`
- `tags` (json), `raw_payload` (json)
- `knowledge_entry_id` — çözüldükten sonra KB'ye damıtıldıysa

### log_events
- `source`, `stream`, `severity`, `message`, `observed_at`
- `fingerprint` (mesaj template hash'i — burst ve repetition tespiti için)
- `extra` (json)
- Index: `(source, observed_at)`, `severity`

### file_assets
- `incident_id`, `filename`, `content_type`, `size_bytes`, `storage_path`
- `sha256` — dedup için
- `extracted_text` — OCR/parser çıktısı
- `analysis` (json) — LLM yorumu, anomali skoru

### actions
- `incident_id`, `type` (promanage_inplace|email|ticket|note)
- `status` (proposed|approved|executing|succeeded|failed|skipped)
- `requires_approval` (bool)
- `payload` (json) — tipe özel veri
- `result` (json) — yürütme sonucu

### chat_messages
- `incident_id` (nullable — bağımsız sohbet için)
- `role` (user|assistant|system)
- `content`

### knowledge_entries
- `title`, `problem`, `root_cause`, `resolution`
- `actors` (json) — kim ne yaptı
- `duration_minutes` — çözüm süresi
- `tags` (json), `system` (sap|promanage|other)
- `embedding` — pgvector(1024) — RAG araması

## Yaşam döngüsü

```
detected → analyzing → awaiting_action → in_progress → resolved → closed
                                              │
                                              └─ optional → KB entry
```
