# SAP Entegrasyonu

## Mevcut yetki

Sentinel kullanıcısının SAP'ye **doğrudan API erişimi yok** (Albil tarafından
yönetiliyor). Bu nedenle entegrasyon iki aşamalı:

1. **Pasif**: kullanıcı SAP hata ekran görüntüsünü / ABAP dump dosyasını
   yükler, sistem yorumlar
2. **Aktif**: ticket açılması veya destek mailı gönderilmesi gerekiyorsa
   action engine yapılandırılmış mail/ticket çıkarır

## SAP Dump parser'ı

`app/services/parser/sap_dump.py` — yüklenen txt içinden tipik alanları
çıkarır:

- Runtime Errors
- Short text
- Program / Transaction / User

Bu metin LLM'e bağlam olarak verilir; LLM:
- Olası kök neden
- Albil tarafına iletilecek somut bilgi (transaction kodu, user, zaman, dump no)
- Önerilen ticket başlığı / önceliği

üretir.

## Ticket adapter

`app/services/actions/ticket.py`. Bugün için kanal: SMTP mail.
İleride bir ticket sistemi (Jira / ServiceNow / Albil portal API) eklenirse
bu modülün altına yeni bir adapter sınıfı eklenebilir.

```env
TICKET_TO_EMAIL=destek@firma.com
SMTP_HOST=smtp.firma.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=sentinel@firma.com
```

## İleride eklenebilecekler

- SAP RFC bağlantısı (PyRFC) — yetki açılırsa
- IDoc dosyası parser'ı
- Solution Manager entegrasyonu
- SAProuter logları
