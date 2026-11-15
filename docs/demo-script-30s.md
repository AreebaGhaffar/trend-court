# Trend Court — 30-second demo script (word for word)

For Member 2 to record. One click-path only: Home / Case Board → The Trial → Verdict & Planner Action. Do not tour Evidence, Lab, or About in the video — judges can open them from the navigation afterwards. Read as written; 92 words, about 30 seconds at a brisk pace.

> "This is Trend Court, on the Home page. Faisalabad is on trial — I click Put on Trial for Rainfall. On the Trial page: the charge is rainfall is rising. The evidence is 26 years of NASA data. Confidence: 99.95 percent, up 13.5 millimetres a year. But checked on 2000 to 2019 alone, it is not significant. Now the Verdict page: Not Proven as a steady climb. The change-points are 2011 and 2019, eight years apart — it is the wet 2020s. Plan for wetter years — do not trust the line."

## Numbers check (all from src/data/trends.json)

- Rainfall: +13.5 mm per year, Hamed-Rao p ≈ 0.0005, confidence 99.95%.
- Temperature (not spoken in this script, shown on screen if clicked): −0.054 °C per year, Hamed-Rao p ≈ 0.0057, confidence 99.4%.
- Both verdicts: "Not Proven — Don't trust it yet" as a steady 26-year trend.
- Change-points (Pettitt's test): temperature new regime 2011 (K=111, p≈0.035); rainfall new regime 2019 (K=117, p≈0.022). Eight years apart — no coincident shift. Do NOT say 2020 is the change-point.
- Rainfall is NASA POWER model/reanalysis (PRECTOTCORR), not rain-gauge data.
- Confidence is (1 − Hamed-Rao p) × 100, a frequentist label — not a Bayesian posterior.
