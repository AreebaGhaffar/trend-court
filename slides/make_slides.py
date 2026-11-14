import json
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

ROOT = "/home/hatch/workspace/trend-court"
data = json.load(open(f"{ROOT}/public/trends.json"))
temp = next(d for d in data["defendants"] if d["id"] == "temperature")
rain = next(d for d in data["defendants"] if d["id"] == "rainfall")

NAVY = RGBColor(0x0F, 0x1E, 0x38)
NAVY2 = RGBColor(0x14, 0x33, 0x5F)
GOLD = RGBColor(0xC9, 0xA2, 0x27)
CREAM = RGBColor(0xFA, 0xF7, 0xEF)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
INK = RGBColor(0x1D, 0x27, 0x35)
MUTED = RGBColor(0x5D, 0x68, 0x78)
RED = RGBColor(0xC0, 0x39, 0x2B)
GREY = RGBColor(0x7A, 0x8A, 0xA0)

prs = Presentation()
prs.slide_width = Inches(13.33)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
W, H = 13.33, 7.5


def bg(slide, colour):
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = colour


def box(slide, x, y, w, h, text, size=24, colour=INK, bold=False, align=PP_ALIGN.LEFT,
        font="Calibri"):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = colour
    p.font.name = font
    p.alignment = align
    return tb


def para(tb, text, size=20, colour=INK, bold=False, space_before=10, font="Calibri"):
    p = tb.text_frame.add_paragraph()
    p.text = text
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = colour
    p.font.name = font
    p.space_before = Pt(space_before)
    return p


def rect(slide, x, y, w, h, colour):
    sh = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid()
    sh.fill.fore_color.rgb = colour
    sh.line.fill.background()
    sh.shadow.inherit = False
    return sh


def header(slide, kicker, title):
    bg(slide, CREAM)
    rect(slide, 0, 0, W, 0.14, GOLD)
    box(slide, 0.7, 0.45, 12, 0.5, kicker, size=15, colour=GOLD, bold=True)
    box(slide, 0.7, 0.9, 12, 1.1, title, size=36, colour=NAVY, bold=True, font="Georgia")


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def means_bars(slide, defendant, x=0.9, y=3.4, max_w=6.2):
    """Two period-mean bars drawn from trends.json values only."""
    means = defendant["period_means"]
    top = max(m["value"] for m in means)
    for i, m in enumerate(means):
        yy = y + i * 1.15
        box(slide, x, yy, 2.2, 0.5, m["period"], size=18, colour=MUTED, bold=True)
        rect(slide, x + 2.2, yy + 0.05, max_w * (m["value"] / top), 0.5,
             GREY if i == 0 else RED)
        box(slide, x + 2.3 + max_w * (m["value"] / top), yy, 2.2, 0.5,
            f"{m['value']} {defendant['unit']}", size=18, colour=INK, bold=True)


# ---------- Slide 1: Title ----------
s = prs.slides.add_slide(BLANK)
bg(s, NAVY)
rect(s, 0, 3.02, W, 0.06, GOLD)
box(s, 0.9, 1.5, 11.5, 1.4, "Trend Court — Faisalabad on Trial", size=48, colour=WHITE,
    bold=True, font="Georgia")
box(s, 0.9, 3.3, 11.5, 0.8, "Team Mind Flayer — a multi-page courtroom app",
    size=26, colour=GOLD)
box(s, 0.9, 4.4, 11.5, 1.2,
    "Every climate trend for Faisalabad, 2000–2025, is put on trial. "
    "The data is the evidence. The verdict is the feature.",
    size=20, colour=WHITE)
box(s, 0.9, 6.5, 11.5, 0.5,
    "NASA Space Apps Challenge 2026 · Be An Earth System Trend Detective!",
    size=15, colour=GREY)
notes(s, "Slide 1 — Title (plan outline). One idea: the project and the team. "
         "All numbers in this deck are read from public/trends.json.")

# ---------- Slide 2: Home / Case Board — the problem ----------
s = prs.slides.add_slide(BLANK)
header(s, "HOME / CASE BOARD", "Planners act on trends nobody has tested")
tb = box(s, 0.7, 2.2, 11.9, 1.4,
         "A Faisalabad city water and drainage planner must decide whether to plan for "
         "wetter years — and whether a small fall in temperature means heat planning can relax.",
         size=22)
para(tb, "Trend Court puts each trend on trial before anyone acts on it.", size=22, bold=True)
for i, d in enumerate([temp, rain]):
    x = 0.7 + i * 6.1
    rect(s, x, 4.35, 5.8, 2.35, WHITE)
    rect(s, x, 4.35, 5.8, 0.08, NAVY2)
    box(s, x + 0.3, 4.6, 5.2, 0.6, f"Defendant: {d['name']}", size=22, colour=NAVY, bold=True)
    box(s, x + 0.3, 5.25, 5.2, 0.7, d["trend_display"], size=28, colour=NAVY2, bold=True)
    box(s, x + 0.3, 6.05, 5.2, 0.5, f"Badge: {d['verdict_short']}", size=17, colour=RED, bold=True)
box(s, 0.7, 6.9, 12, 0.4, "A third defendant slot is shown only as “Not yet tested.”",
    size=15, colour=MUTED)
notes(s, "Slide 2 — Home / Case Board (plan outline). One idea: the problem. "
         "Two defendants are listed, each with its verdict badge.")

# ---------- Slide 3: The Trial (Rainfall) ----------
s = prs.slides.add_slide(BLANK)
header(s, "THE TRIAL — RAINFALL", f"The charge: “{rain['charge']}”")
box(s, 0.7, 2.1, 7.6, 0.9, rain["trend_display"], size=44, colour=NAVY2, bold=True)
tb = box(s, 0.7, 3.0, 11.9, 0.6,
         f"Confidence: {rain['confidence_percent']}%  ·  Full period significant after "
         f"correction (Hamed-Rao p ≈ {rain['p_hamed_rao']})", size=20)
box(s, 0.7, 3.85, 11.9, 0.6,
    "Mean annual total, early period vs recent period (NASA POWER, PRECTOTCORR):",
    size=17, colour=MUTED)
means_bars(s, rain, y=4.45)
box(s, 0.7, 6.85, 12, 0.4,
    "Caveat: NASA POWER rainfall is a model / reanalysis product, not rain-gauge data.",
    size=15, colour=MUTED)
notes(s, "Slide 3 — The Trial, Rainfall (plan outline). One idea: the charge and the "
         "evidence chart, +13.5 mm per year. Period means are from trends.json; the full "
         "annual chart is in the app once Member 1's frozen series lands. "
         "Rainfall is a NASA POWER model / reanalysis product, not rain-gauge data.")

# ---------- Slide 4: The twist ----------
s = prs.slides.add_slide(BLANK)
header(s, "THE TRIAL — CROSS-EXAMINATION", "The twist: 2000–2019 alone, it is not significant")
tb = box(s, 0.7, 2.3, 11.9, 2.2,
         f"Rainfall checked on {rain['subperiod_2000_2019']['label']}: not significant "
         f"(p ≈ {rain['subperiod_2000_2019']['p_uncorrected']} uncorrected; "
         f"{rain['subperiod_2000_2019']['p_hamed_rao']} / {rain['subperiod_2000_2019']['p_yue_pilon']} corrected).",
         size=24)
para(tb, "The full-period result is driven by the 2020s. A simple trend line would have "
         "presented the headline as settled fact — the cross-examination catches it.",
     size=22)
para(tb, f"Candidate change-point: {data['change_point']['display_text']}", size=20,
     colour=MUTED)
notes(s, "Slide 4 — The twist (plan outline). One idea: on 2000–2019 alone, the rainfall "
         "trend is not significant.")

# ---------- Slide 5: The Trial (Temperature) ----------
s = prs.slides.add_slide(BLANK)
header(s, "THE TRIAL — TEMPERATURE", "Same pattern, same honest verdict")
box(s, 0.7, 2.1, 7.6, 0.9, temp["trend_display"], size=44, colour=NAVY2, bold=True)
tb = box(s, 0.7, 3.0, 11.9, 0.6,
         f"Confidence: {temp['confidence_percent']}%  ·  Full period significant after "
         f"correction (Hamed-Rao p ≈ {temp['p_hamed_rao']}); 2000–2019 alone not significant "
         f"(p ≈ {temp['subperiod_2000_2019']['p_hamed_rao']})", size=20)
box(s, 0.7, 3.95, 11.9, 0.6,
    "Mean annual temperature, early period vs recent period (NASA POWER, T2M):",
    size=17, colour=MUTED)
means_bars(s, temp, y=4.55)
box(s, 0.7, 6.9, 12, 0.4,
    "Verdict: Not Proven — and the fall must not be used to relax heat planning.",
    size=16, colour=RED, bold=True)
notes(s, "Slide 5 — The Trial, Temperature (plan outline). One idea: −0.054 °C per year, "
         "same pattern, same honest verdict. The temperature fall still needs a MODIS "
         "land-surface-temperature cross-check.")

# ---------- Slide 6: Verdict & Planner Action ----------
s = prs.slides.add_slide(BLANK)
header(s, "VERDICT & PLANNER ACTION", "Three verdicts — and what each means for a decision")
for i, r in enumerate(data["verdict_rules"]):
    x = 0.7 + i * 4.1
    rect(s, x, 2.3, 3.85, 3.5, WHITE)
    rect(s, x, 2.3, 3.85, 0.08, GOLD if i == 1 else NAVY2)
    box(s, x + 0.25, 2.55, 3.35, 1.2, r["verdict"], size=20, colour=NAVY, bold=True)
    box(s, x + 0.25, 3.9, 3.35, 1.8, r["planner_meaning"], size=16, colour=INK)
tb = box(s, 0.7, 6.1, 11.9, 0.9,
         f"Both tested defendants: {rain['verdict']}, as a steady 2000–2025 trend.", size=20, bold=True)
para(tb, "Plan for the wetter recent period and keep checking — do not relax heat planning.",
     size=18)
notes(s, "Slide 6 — Verdict & Planner Action (plan outline). One idea: Proven, Not Proven, "
         "Too Weak to Trust — and what each means for a decision.")

# ---------- Slide 7: Verify + next steps ----------
s = prs.slides.add_slide(BLANK)
header(s, "EVIDENCE VAULT · METHOD LAB · ABOUT", "Where judges verify — and what comes next")
tb = box(s, 0.7, 2.2, 11.9, 2.0,
         "Evidence Vault: both charts, the annual values and the sensitivity checks, "
         "all read from one file — trends.json.", size=22)
para(tb, "Method Lab: Mann-Kendall with Sen's slope, Hamed-Rao and Yue-Pilon corrections; "
         "the displayed confidence is (1 − p) × 100, not a Bayesian posterior.", size=22)
para(tb, "About: data source (NASA POWER, T2M and PRECTOTCORR, 31.42° N, 73.08° E, "
         "2000–2025), the AI-use declaration, and every caveat in one place.", size=22)
box(s, 0.7, 5.3, 11.9, 0.6, "Next steps", size=22, colour=NAVY, bold=True)
tb = box(s, 0.7, 5.95, 11.9, 1.2,
         "MODIS land-surface-temperature cross-check for the temperature result.", size=20)
para(tb, "GRACE as a future tested defendant only — not a claimed result.", size=20)
notes(s, "Slide 7 — Evidence Vault, Method Lab and About (plan outline). One idea: where "
         "judges verify the numbers, the method and the caveats; next steps as stated.")

prs.save(f"{ROOT}/slides/trend-court-slides.pptx")
print("saved slides/trend-court-slides.pptx with", len(prs.slides.slides if hasattr(prs.slides,'slides') else prs.slides._sldIdLst), "slides")
