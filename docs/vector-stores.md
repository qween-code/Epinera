# Vector Database / RAG Stack — Karşılaştırma

Sentinel'de "know-how" geçmiş vakalardan benzerlik araması (RAG) gerektirir.
Aşağıda **tamamen ücretsiz, açık kaynak, self-hosted edilebilir** vector store
seçenekleri kıyaslandı; Sentinel için seçim **pgvector** (zaten kuruldu).

## Karşılaştırma

| Çözüm        | Kurulum                | Özellikler                                    | Bizim için uygunluk |
|--------------|------------------------|-----------------------------------------------|---------------------|
| **pgvector** | Postgres extension     | SQL + vector tek yerde, JOIN'lerle KB kaydı   | ✅ **Seçildi**       |
| Qdrant       | Docker (Rust)          | Hızlı, payload filter güçlü, gRPC + REST      | ✅ Alternatif         |
| Weaviate     | Docker (Go)            | Modular, hibrit arama, sınıf bazlı şema       | ⚠ Karmaşık başlangıç |
| Milvus       | Docker (Go) + etcd     | Çok büyük ölçek, kompleks                     | ❌ Tek kullanıcı için |
| Chroma       | Embedded Python        | Pratik, tek dosyalı, küçük projeler için      | ⚠ Postgres yeter      |
| LanceDB      | Embedded Rust          | Çok hızlı, columnar, dosya tabanlı           | ⚠ Postgres yeter      |
| FAISS        | Python lib             | In-memory, persistence yok                    | ❌ Kalıcılık yok      |
| Vespa        | JVM, kompleks          | Production search engine                      | ❌ Aşırı              |

## Neden pgvector

- Halihazırda Postgres var (incidents, log_events vs.)
- KB kayıtları + embedding aynı tabloda → JOIN'le metadata + vector arama
- Yedekleme tek `pg_dump` ile olur
- Coolify üzerinde tek servis — operasyonel basit
- 1024 dim'e kadar HNSW index ile performanslı (`bge-m3` 1024 dim ✓)

## Migrasyon kolaylığı

Eğer ileride pgvector yetersiz kalırsa (örn 100K+ vaka, sub-50ms arama
gereği), Qdrant'a geçiş yarım gün:

1. `services/kb/store.py` ve `search.py` → Qdrant client'a değiştirilir
2. `KnowledgeEntry.embedding` Postgres'ten silinir; ID + payload bağı kalır
3. Bir kerelik backfill scripti

`services/kb/` modülü tek bir adapter pattern içinde olduğu için bu
geçiş maliyeti düşük — sistem mimarisi pgvector'a kilitli değil.

## Embedding üretimi (free seçenekler)

| Model                       | Boyut   | Çok dilli (TR) | Çalıştırma         |
|-----------------------------|---------|-----------------|--------------------|
| `bge-m3`                    | 1024    | ✅ Çok iyi      | Ollama (varsayılan)|
| `nomic-embed-text:v1.5`     | 768     | ⚠ Sınırlı       | Ollama             |
| `mxbai-embed-large`         | 1024    | ⚠ Sınırlı       | Ollama             |
| `Qwen3-Embedding`           | değişken | ✅              | HuggingFace        |
| `intfloat/multilingual-e5`  | 1024    | ✅              | HuggingFace        |

**Şu anki seçim:** `bge-m3` (Ollama). Türkçe + İngilizce hibrit içerik için
açık ara en güçlü ücretsiz seçeneklerden biri.

## Alternatif: HuggingFace `sentence-transformers` (Ollama olmadan)

Eğer Ollama kurmak istemezseniz, embedding'i Python süreci içinde
`sentence-transformers` ile üretebiliriz (ek RAM kullanır, ~600 MB).
Bu opsiyon henüz aktif değil; ihtiyaç olursa
`backend/app/services/ai/local_embed_provider.py` olarak eklenebilir.

## RAG katmanı için açık kaynak ekosistem (referans)

İleride lazım olursa hazır araçlar:

- **LlamaIndex** (`llama-index`) — RAG pipeline + 100+ kaynak adapter
- **Haystack 2** (Deepset) — production-grade pipeline
- **DSPy** — RAG'i öğrenilebilir yapan framework
- **txtai** — embedded, NumPy tabanlı, hafif
- **Verba** (Weaviate) — chat UI ile gelen RAG starter

Sentinel şu an basit bir RAG yapısı kullanıyor (`kb/search.py` doğrudan
pgvector cosine distance) — bu yeterli. Aşamalı olarak LlamaIndex'e
geçiş yapılabilir, ihtiyaç doğarsa.
