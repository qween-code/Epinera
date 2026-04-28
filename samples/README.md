# Test verileri

Bu klasör; sistemin parser, OCR ve LLM analiz katmanlarını **gerçek
formatla benzer** içeriklerle test etmek için hazırlanmış senaryolardır.

> Buradaki tüm veriler **uydurma** — gerçek müşteri/şirket bilgisi içermez.
> Ortam değişkenlerini (`PROMANAGE_*`, `SMTP_*`) doldurmadan dry-run
> yapabilirsin.

## Hızlı kullanım

```bash
# Web arayüzünden
/upload  → seçili senaryoyu yükle  → kaynağı (sap / promanage) belirt

# Direkt API ile
curl -X POST http://localhost:8000/uploads/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -F "source=sap" \
  -F "description=Murat MIGO yaparken aldı" \
  -F "file=@samples/sap/sap_dump_migo_timeout.txt"
```

## Senaryolar

### `sap/` — SAP tarafı (ticket/mail aksiyonu beklenir)

| Dosya                              | Senaryo                                 | Beklenen severity |
|------------------------------------|------------------------------------------|-------------------|
| `sap_dump_migo_timeout.txt`        | MIGO sırasında ABAP TIME_OUT (MSEG scan) | high              |
| `sap_dump_authorization.txt`       | Kullanıcının VL01N yetkisi yok           | medium            |
| `sap_message_locked.txt`           | "User locked" mesajı                    | medium            |
| `sap_short_dump_db_full.txt`       | Tablespace dolu — kritik                | critical          |

### `promanage/` — ProManage tarafı (in-place aksiyon önerilir)

| Dosya                              | Senaryo                                 | Beklenen severity |
|------------------------------------|------------------------------------------|-------------------|
| `promanage_wms_timeout.log`        | WMS Sync iş emri timeout                 | high              |
| `promanage_license_failed.log`     | License check failed                     | medium            |
| `promanage_burst_errors.log`       | 1 dk içinde 50+ "DB connection refused" | critical          |
| `promanage_disk_warning.log`       | Disk %92 (uyarı eşiği)                  | medium            |

## Akan log testi

`promanage_burst_errors.log` dosyasını canlı olarak Redis'e basmak için:

```bash
docker compose exec backend python -m scripts.replay_log \
  --source promanage \
  --file samples/promanage/promanage_burst_errors.log \
  --speed 0.05   # her satır arası 50ms
```

Bu, gerçek bir akış simüle eder; canlı log paneli olayları sırayla görür.
