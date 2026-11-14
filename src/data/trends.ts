// Single source of truth for every number in Trend Court.
// All values come from src/data/trends.json (NASA POWER, Faisalabad 2000–2025).
// Nothing in the app may quote a number that is not in that file.
import raw from './trends.json'

export interface AnnualPoint {
  year: number
  mean_temp_c: number
  total_rain_mm: number
}

export type DefendantId = 'temperature' | 'rainfall'

export interface Defendant {
  id: DefendantId
  charge: string
  variable: string
  unit: string
  slope: number
  slopeLabel: string
  pHamedRao: number
  pYuePilon: number
  pUncorrected: number
  /** Displayed confidence = (1 − Hamed-Rao p) × 100.
   *  This is a frequentist confidence approximation, NOT a Bayesian posterior. */
  confidenceLabel: string
  first5Mean: number
  last5Mean: number
  subSlope: number
  subPHamedRao: number
  subPYuePilon: number
  subPUncorrected: number
  dropSlope: number
  dropPHamedRao: number
  verdict: string
  verdictReason: string
  dataKey: 'mean_temp_c' | 'total_rain_mm'
  color: string
}

export const place = raw.place
export const source = raw.source
export const annualSeries: AnnualPoint[] = raw.annual_series as AnnualPoint[]
export const wetYears: Record<string, number> = raw.trends.rainfall
  .wet_years_driving_the_rise_mm as Record<string, number>
export const verdictRule: string = raw.verdicts.rule

export const defendants: Defendant[] = [
  {
    id: 'temperature',
    charge: 'Temperature in Faisalabad is falling.',
    variable: 'T2M — annual mean 2-metre air temperature',
    unit: '°C per year',
    slope: raw.trends.temperature.full_period_2000_2025.sens_slope_per_year,
    slopeLabel: '−0.054 °C per year',
    pHamedRao: raw.trends.temperature.full_period_2000_2025.p_hamed_rao,
    pYuePilon: raw.trends.temperature.full_period_2000_2025.p_yue_pilon,
    pUncorrected: raw.trends.temperature.full_period_2000_2025.p_uncorrected,
    confidenceLabel: '99.4%',
    first5Mean: raw.trends.temperature.full_period_2000_2025.first_5_years_mean_2000_2004,
    last5Mean: raw.trends.temperature.full_period_2000_2025.last_5_years_mean_2021_2025,
    subSlope: raw.trends.temperature.subperiod_2000_2019.sens_slope_per_year,
    subPHamedRao: raw.trends.temperature.subperiod_2000_2019.p_hamed_rao,
    subPYuePilon: raw.trends.temperature.subperiod_2000_2019.p_yue_pilon,
    subPUncorrected: raw.trends.temperature.subperiod_2000_2019.p_uncorrected,
    dropSlope: raw.trends.temperature.drop_2020_outlier.sens_slope_per_year,
    dropPHamedRao: raw.trends.temperature.drop_2020_outlier.p_hamed_rao,
    verdict: 'Not Proven — Don’t trust it yet',
    verdictReason: raw.verdicts.temperature.reason,
    dataKey: 'mean_temp_c',
    color: '#7fb3d5',
  },
  {
    id: 'rainfall',
    charge: 'Rainfall in Faisalabad is rising.',
    variable: 'PRECTOTCORR — annual total corrected precipitation',
    unit: 'mm per year',
    slope: raw.trends.rainfall.full_period_2000_2025.sens_slope_per_year,
    slopeLabel: '+13.5 mm per year',
    pHamedRao: raw.trends.rainfall.full_period_2000_2025.p_hamed_rao,
    pYuePilon: raw.trends.rainfall.full_period_2000_2025.p_yue_pilon,
    pUncorrected: raw.trends.rainfall.full_period_2000_2025.p_uncorrected,
    confidenceLabel: '99.95%',
    first5Mean: raw.trends.rainfall.full_period_2000_2025.first_5_years_mean_2000_2004,
    last5Mean: raw.trends.rainfall.full_period_2000_2025.last_5_years_mean_2021_2025,
    subSlope: raw.trends.rainfall.subperiod_2000_2019.sens_slope_per_year,
    subPHamedRao: raw.trends.rainfall.subperiod_2000_2019.p_hamed_rao,
    subPYuePilon: raw.trends.rainfall.subperiod_2000_2019.p_yue_pilon,
    subPUncorrected: raw.trends.rainfall.subperiod_2000_2019.p_uncorrected,
    dropSlope: raw.trends.rainfall.drop_2020_outlier.sens_slope_per_year,
    dropPHamedRao: raw.trends.rainfall.drop_2020_outlier.p_hamed_rao,
    verdict: 'Not Proven — Don’t trust it yet',
    verdictReason: raw.verdicts.rainfall.reason,
    dataKey: 'total_rain_mm',
    color: '#c9a227',
  },
]

export function getDefendant(id: string): Defendant {
  return defendants.find((d) => d.id === id) ?? defendants[0]
}
