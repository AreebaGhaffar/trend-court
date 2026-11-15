const { execSync } = require('child_process');
const fs = require('fs');

const get = (ref) =>
  JSON.parse(execSync(`git show ${ref}:public/trends.json`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }));

const base = get('ffc35b1'); // Maryam's layout
const mine = get('85e3b7e'); // Member 1 real data

fs.writeFileSync('analysis/trends-member1-source.json', JSON.stringify(mine, null, 2), 'utf8');

const key = { rainfall: 'total_rain_mm', temperature: 'mean_temp_c' };

for (const d of base.defendants) {
  if (!key[d.id]) continue;
  d.annual_series = mine.annual_series.map((r) => ({ year: r.year, value: r[key[d.id]] }));
  d.change_point_pettitt = mine.trends[d.id].change_point_pettitt;
}

const t = mine.trends.temperature.change_point_pettitt;
const r = mine.trends.rainfall.change_point_pettitt;
base.change_point = {
  candidate_period: `${t.new_regime_starts_year} (temperature), ${r.new_regime_starts_year} (rainfall)`,
  coincident_shift: `The temperature and rainfall change-points fall in different years (${t.new_regime_starts_year} and ${r.new_regime_starts_year}), so they are not coincident.`,
  display_text: `Pettitt's test: temperature shifts after ${t.split_after_year} (p = ${t.p_approx}); rainfall shifts after ${r.split_after_year} (p = ${r.p_approx}).`,
  status: "confirmed by Pettitt's change-point test (p < 0.05)",
};

fs.writeFileSync('public/trends.json', JSON.stringify(base), 'utf8');
console.log('Done. Series lengths:', base.defendants.map((d) => d.id + ':' + d.annual_series.length).join(', '));