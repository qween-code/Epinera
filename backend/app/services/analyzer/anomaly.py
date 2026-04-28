"""
Çok hafif anomali tespiti — şimdilik kural bazlı.
Daha gelişmiş ML modeli (Isolation Forest / Prophet) ileride eklenecek.
"""
from collections import Counter
from dataclasses import dataclass


@dataclass
class AnomalySignal:
    score: float  # 0.0 - 1.0
    reasons: list[str]


CRITICAL_KEYWORDS = (
    "error",
    "exception",
    "fail",
    "denied",
    "timeout",
    "deadlock",
    "abend",
    "dump",
    "fatal",
    "kritik",
    "hata",
)


def score_message(message: str) -> AnomalySignal:
    lower = message.lower()
    hits = [kw for kw in CRITICAL_KEYWORDS if kw in lower]
    if not hits:
        return AnomalySignal(score=0.0, reasons=[])
    score = min(1.0, 0.3 + 0.15 * len(hits))
    return AnomalySignal(score=score, reasons=hits)


def burst_detection(timestamps_per_minute: list[int], threshold_factor: float = 3.0) -> bool:
    if len(timestamps_per_minute) < 3:
        return False
    avg = sum(timestamps_per_minute[:-1]) / max(1, len(timestamps_per_minute) - 1)
    return timestamps_per_minute[-1] > max(5, avg * threshold_factor)


def fingerprint_topk(messages: list[str], k: int = 5) -> list[tuple[str, int]]:
    counter: Counter[str] = Counter()
    for m in messages:
        # ilk 80 karakter genelde mesajın template'idir
        counter[m[:80]] += 1
    return counter.most_common(k)
