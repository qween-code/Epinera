"""
Demo amaçlı: birkaç örnek know-how kaydını KB'ye yazar.
Çalıştırma:
  docker compose exec backend python -m scripts.seed_kb
"""
import asyncio

from app.db.session import SessionLocal
from app.services.kb.store import upsert_knowledge_entry

EXAMPLES = [
    {
        "title": "ProManage: WMS senkronizasyonunda timeout",
        "problem": "WMS Sync iş emrinde 'Connection timeout' hatası alınıyor.",
        "root_cause": "WMS endpoint'i ağ kesintisi nedeniyle yanıt vermedi.",
        "resolution": "1) Bağlantı testi (telnet host 8080)\n2) Endpoint'i restart\n3) İş emrini tekrar çalıştır",
        "actors": ["Murat (DevOps)"],
        "duration_minutes": 15,
        "tags": ["wms", "timeout", "ağ"],
        "system": "promanage",
    },
    {
        "title": "SAP ABAP dump: TIME_OUT sırasında uzun süreli sorgu",
        "problem": "MM modülünde MIGO işlemi sırasında ABAP TIME_OUT runtime error.",
        "root_cause": "Hatalı endeks; tablo MSEG'de full scan.",
        "resolution": "DBA ile irtibat, gerekli index oluşturulmasını talep et. Geçici: işlemi off-peak saatte tekrarla.",
        "actors": ["SAP Basis"],
        "duration_minutes": 60,
        "tags": ["sap", "abap", "time_out", "performans"],
        "system": "sap",
    },
]


async def main() -> None:
    with SessionLocal() as db:
        for e in EXAMPLES:
            entry = await upsert_knowledge_entry(db, **e)
            print(f"created: {entry.id}  {entry.title}")


if __name__ == "__main__":
    asyncio.run(main())
