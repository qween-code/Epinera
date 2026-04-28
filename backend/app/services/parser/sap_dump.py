"""
SAP ABAP short dump / hata metni için temel ayrıştırıcı.
Tam SAP RFC erişimimiz yok; kullanıcı dump dosyalarını manuel yüklediğinde
özet alanları çıkartmaya çalışır.
"""
import re
from dataclasses import dataclass


@dataclass
class SapDump:
    runtime_error: str | None
    short_text: str | None
    program: str | None
    transaction: str | None
    user: str | None
    raw: str


def parse_sap_dump(content: str) -> SapDump:
    def find(pattern: str) -> str | None:
        m = re.search(pattern, content, re.IGNORECASE | re.MULTILINE)
        return m.group(1).strip() if m else None

    return SapDump(
        runtime_error=find(r"Runtime Errors?\s*[:.]?\s*(.+)"),
        short_text=find(r"Short text\s*[:.]?\s*(.+)"),
        program=find(r"Program\s*[:.]?\s*([\w/]+)"),
        transaction=find(r"Transaction\s*[:.]?\s*([\w/]+)"),
        user=find(r"User\s*[:.]?\s*([\w.@-]+)"),
        raw=content,
    )
