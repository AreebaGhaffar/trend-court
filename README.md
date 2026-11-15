Trend Court — Faisalabad on Trial

Team Mind Flayer · NASA Space Apps Challenge 2026 · Challenge: "Be An Earth System Trend Detective!"

A multi-page courtroom app that puts Faisalabad's climate trends (NASA POWER, 2000–2025) on trial and returns a plain verdict — Proven, Not Proven, or Too Weak to Trust — so a city water and drainage planner knows whether a trend is strong enough to act on.

Highlights
Interactive Earth hero: a 3D globe with NASA night lights that flies down to Faisalabad's Ghanta Ghar (Clock Tower). Drag, zoom, rotate and tilt like a 360° map, start a helicopter orbit, and switch between Day Earth and Night lights. The eight gold lines mark the eight bazaars of the old city.
Courtroom flow: Case Board → Trial → Evidence → Verdict, with a Method Lab that shows how the change-point test works.
One source of truth: every number comes from public/trends.json.
Accessible motion: animations respect prefers-reduced-motion; if WebGL is unavailable the hero falls back to a simple globe and clock tower.
Team
Role	Work
Member 1	Data and backend — produces public/trends.json
Member 2	Frontend and story — all UI in src/

The only contract between the two parts is public/trends.json.

Run it

Requirements: Node.js 24.22.x and Git 2.43+.

bash
npm install
npm run dev        # local dev server
npm run build      # production build
npm run preview    # serve the production build

The home hero loads map imagery online, so it needs an internet connection.

Tech stack (pinned versions)

React 19.3.1 · Vite 8.3.8 · @vitejs/plugin-react 6.3.0 · react-router 8.5.1 · Recharts 3.10.1 · MapLibre GL 6.16.0

Data rule: trends.json is the only source of numbers

Every number on every page is fetched at runtime from public/trends.json. No number is hard-coded in a component. The charts never invent values: they plot only what the file contains, and the annual line chart appears when the file includes annual_series.

Routes
Route	Page
/ (and /home)	Home — Earth hero and Case Board
/trial?defendant=rainfall	The Trial (default defendant: Rainfall)
/evidence	Evidence Vault
/verdict?defendant=rainfall	Verdict and Planner Action
/lab	Method / Change-Point Lab
/about	About — data and caveats

Demo click-path (30 seconds): Home → Enter the court → Put on Trial for Rainfall → Trial → See the verdict → Verdict.

Data and image credits
Climate data: NASA POWER (Prediction of Worldwide Energy Resources)
Earth imagery: NASA GIBS — Blue Marble and VIIRS Black Marble
Satellite imagery: Esri, Maxar, Earthstar Geographics
Map engine: MapLibre GL JS
Deploying

Static build (dist/). vercel.json and public/_redirects make deep links to all routes work on Vercel or Netlify. The app works logged out.

Branches
main — scaffold base
member2/frontend-final — final frontend submission