# Trend Court — ready-to-paste NASA Space Apps submission copy

Paste into the Project Page fields in written English. Replace [LIVE LINK] only after the live link is verified logged out. All numbers are from src/data/trends.json (NASA POWER, Faisalabad 31.42°N, 73.08°E, 2000–2025).

## High-Level Summary

Trend Court is a multi-page web app that puts Faisalabad's climate trends on trial. Using 26 years of NASA POWER data (2000–2025), it tests whether temperature and rainfall trends are real or misleading. Both trends are statistically significant over the full period after autocorrelation correction, but neither is significant on 2000–2019 alone — the change is driven by the 2020s. Across its pages — Home / Case Board, The Trial, Evidence Vault, Verdict & Planner Action, Method / Change-Point Lab, and About / Data & Caveats — the app shows the evidence chart, a confidence label, confirmed change-points — temperature 2011 and rainfall 2019, eight years apart, so no coincident shift — and a plain verdict — Proven, Not Proven, or Too Weak to Trust — so a city water and drainage planner knows whether a trend is strong enough to act on.

## Project Demo

[LIVE LINK TO ADD — paste the public 30-second video link here. The video follows one click-path only: Home / Case Board → The Trial → Verdict & Planner Action.]

## Final Project

[LIVE LINK TO ADD — paste the public live project link here.]

Live app (GitHub Pages, to be verified logged out): https://areebaghaffar.github.io/trend-court/
Code repository (public): https://github.com/AreebaGhaffar/trend-court

## Project Details

Trend Court is a multi-page web app with six routes: Home / Case Board, The Trial, Evidence Vault, Verdict & Planner Action, Method / Change-Point Lab, and About / Data & Caveats, all reading a single data file so every page quotes the same numbers. Region: Faisalabad, Punjab, Pakistan (31.42° N, 73.08° E). Variables: annual mean 2-metre air temperature (T2M, °C) and annual total corrected precipitation (PRECTOTCORR, mm). Method: Mann-Kendall trend test with Sen's slope, Hamed-Rao and Yue-Pilon autocorrelation corrections, a 2000–2019 sub-period check, and a drop-2020 sensitivity check, plus Pettitt's change-point test recorded in the project data file: temperature splits after 2010, new regime 2011 (K=111, p≈0.035); rainfall splits after 2018, new regime 2019 (K=117, p≈0.022). The two change-points are eight years apart, so there is no coincident shift. Results: temperature −0.054 °C per year (Hamed-Rao p ≈ 0.0057) and rainfall +13.5 mm per year (Hamed-Rao p ≈ 0.0005) over 2000–2025; neither trend is significant on 2000–2019 alone after correction, so both receive the verdict "Not Proven — don't trust it yet" as a steady long-term trend. Caveats: POWER precipitation is a model and reanalysis product, not rain-gauge data; the temperature result needs a MODIS land-surface-temperature cross-check and must not be used to relax heat planning.

## Use of AI

Team Mind Flayer used Muse AI, paired with Member 1, as a building helper for data and backend code, debugging, checking numbers against the project data file, and drafting submission text. All data, statistical tests, and results are from the NASA dataset and methods stated above, and the team reviewed and verified the final project. Muse AI is not a registered team member.

## Space Agency Data References

NASA POWER (Prediction of Worldwide Energy Resources), variables T2M and PRECTOTCORR, Faisalabad point (31.42° N, 73.08° E), 2000–2025, 26 annual values.

## Use of SI

Temperature in degrees Celsius (°C), precipitation in millimetres (mm), trend rates in °C per year and mm per year, coordinates in decimal degrees.
