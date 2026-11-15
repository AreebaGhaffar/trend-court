# Pettitt change-point test — Faisalabad, 2000–2025

Run: Sun 2026-11-15, Python 3.12 (stdlib only, no new packages).
Script: `analysis/pettitt_test.py` (pure Python, no scipy needed).
Source data: `power-faisalabad-annual-2000-2025.csv` (NASA POWER, 26 annual values),
identical to `src/data/trends.json` annual series. Verified by a second,
independent recomputation in the same run — same K, split year and p for both series.

## Method

Pettitt (1979). For t = 1..n-1:
`U_t = sum_{i<=t} sum_{j>t} sgn(x_i - x_j)`, `K = max |U_t|`.
The split is AFTER the year attaining K; the new regime starts the next year.
Approximate p-value: `p ≈ 2 * exp(-6*K^2 / (n^3 + n^2))`, n = 26.

## Results

| Series | K (max |U_t|) | U_t at max | Split after | New regime starts | p ≈ | Significant at 0.05? |
|---|---|---|---|---|---|---|
| Temperature (T2M, °C) | 111 | +111 | 2010 | 2011 | 0.035 | Yes |
| Rainfall (PRECTOTCORR, mm) | 117 | −117 | 2018 | 2019 | 0.022 | Yes |

Means around the split (for context only, not a trend claim):
- Temperature: 2000–2010 mean 26.64 °C (n=11) → 2011–2025 mean 25.87 °C (n=15).
- Rainfall: 2000–2018 mean 381.49 mm (n=19) → 2019–2025 mean 667.61 mm (n=7).

For comparison, the U_t at a split after 2019 is 93 (temperature) and −117
(rainfall, its maximum); after 2020 it is 78 and −114. So rainfall's shift is
late-2010s, temperature's is 2010/2011 — not the same year.

## What this changes — and what it does NOT change

- Pettitt DOES confirm a single change-point year for each series at p < 0.05
  (neither is significant at p < 0.01: 0.035 and 0.022).
- The earlier "candidate change-point around 2020" is therefore WRONG as a
  single year, and the "coincident regime shift around 2020" is NOT supported:
  the two confirmed change-points are 8 years apart (2011 vs 2019).
  Do not quote 2020 as the change-point year, and do not claim the two series
  shifted together.
- The Mann-Kendall / Sen's slope results and verdicts are UNCHANGED:
  temperature −0.054 °C/yr (Hamed-Rao p ≈ 0.0057), rainfall +13.5 mm/yr
  (Hamed-Rao p ≈ 0.0005), both "Not Proven — Don't trust it yet" as a steady
  26-year trend, because neither is significant on 2000–2019 alone.
- The rainfall rise is still a wet-2020s story in the sub-period sense
  (2020: 1,075.2 mm; 2022–2025: 620–708.6 mm), but Pettitt's formal
  change-point for rainfall is the start of 2019, not 2020.
