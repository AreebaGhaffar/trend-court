"""Pettitt change-point test — pure Python standard library only.

Reads the saved NASA POWER annual file for Faisalabad (2000-2025) and runs
Pettitt's (1979) test on each series.

Definition (Pettitt 1979):
  For t = 1..n-1,  U_t = sum_{i<=t} sum_{j>t} sgn(x_i - x_j)
  K = max_t |U_t| ;  the change point is the t that attains K.
  The split is AFTER year[t] — the new regime starts in year[t+1].
  Approximate p-value:  p ~= 2 * exp(-6*K^2 / (n^3 + n^2))

No third-party library is used, so this runs on any Python 3.12 install
(Areeba's is Python 3.12.9) with no pip install.
"""
import csv
import math
from pathlib import Path

CSV_PATH = Path(__file__).resolve().parents[2] / "power-faisalabad-annual-2000-2025.csv"


def pettitt(values):
    n = len(values)
    uts = []
    for t in range(1, n):  # split after index t-1 (0-based), i.e. first t values vs rest
        u = 0
        for i in range(t):
            for j in range(t, n):
                if values[i] > values[j]:
                    u += 1
                elif values[i] < values[j]:
                    u -= 1
        uts.append(u)
    k = max(abs(u) for u in uts)
    t_star = max(range(len(uts)), key=lambda i: abs(uts[i]))  # 0-based index into uts
    p_approx = 2.0 * math.exp(-6.0 * k * k / (n ** 3 + n ** 2))
    return {"K": k, "U_t": uts, "t_index": t_star, "p_approx": p_approx}


def main():
    rows = []
    with open(CSV_PATH, newline="") as f:
        for row in csv.DictReader(f):
            rows.append((int(row["year"]), float(row["mean_T2M_C"]), float(row["total_precip_mm"])))
    years = [r[0] for r in rows]
    for name, values, unit in [
        ("temperature", [r[1] for r in rows], "deg C"),
        ("rainfall", [r[2] for r in rows], "mm"),
    ]:
        res = pettitt(values)
        t = res["t_index"]  # split after the (t+1)-th value
        print(f"{name}: n={len(values)}")
        print(f"  K (max |U_t|) = {res['K']}")
        print(f"  U_t at max = {res['U_t'][t]}")
        print(f"  split after year {years[t]} (index {t}, first {t + 1} values)")
        print(f"  new regime starts {years[t + 1]}")
        print(f"  p approx = 2*exp(-6K^2/(n^3+n^2)) = {res['p_approx']:.6g}")
        print(f"  significant at 0.05: {res['p_approx'] < 0.05}")
        print(f"  U_t series: {res['U_t']}")


if __name__ == "__main__":
    main()
