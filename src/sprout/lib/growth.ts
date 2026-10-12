import type { Baby, BabySex, Log } from "./types";

/* WHO Child Growth Standards (0–24 months) reference points.
   Values from the published P50 / P2 / P98 growth charts; SD derived
   from the ±2SD spread. Guidance only — not medical advice. */

interface GrowthRef {
  months: number[];
  median: number[];
  sd: number[];
}

const WFA: Record<"female" | "male", GrowthRef> = {
  male: {
    months: [0, 3, 6, 9, 12, 18, 24],
    median: [3.35, 6.43, 7.92, 8.95, 9.65, 10.9, 12.2],
    sd: [0.47, 0.75, 0.83, 0.9, 0.97, 1.07, 1.05],
  },
  female: {
    months: [0, 3, 6, 9, 12, 18, 24],
    median: [3.2, 5.85, 7.3, 8.2, 8.94, 10.2, 11.5],
    sd: [0.44, 0.71, 0.78, 0.85, 0.95, 1.09, 1.12],
  },
};

const LFA: Record<"female" | "male", GrowthRef> = {
  male: {
    months: [0, 3, 6, 9, 12, 18, 24],
    median: [49.9, 61.4, 67.6, 72.0, 75.7, 82.3, 87.1],
    sd: [1.73, 1.9, 1.95, 2.0, 2.19, 2.65, 2.9],
  },
  female: {
    months: [0, 3, 6, 9, 12, 18, 24],
    median: [49.1, 59.8, 65.7, 70.1, 74.0, 80.7, 85.7],
    sd: [1.73, 1.82, 2.04, 2.14, 2.31, 2.68, 3.09],
  },
};

function lerp(ref: GrowthRef, month: number, index: 0 | 1) {
  const months = ref.months;
  const clamped = Math.min(Math.max(month, months[0]), months[months.length - 1]);
  const vals = index === 0 ? ref.median : ref.sd;
  let lower = 0;
  while (lower < months.length - 1 && months[lower + 1] < clamped) lower += 1;
  const upper = Math.min(lower + 1, months.length - 1);
  if (months[upper] === months[lower]) return vals[lower];
  const t = (clamped - months[lower]) / (months[upper] - months[lower]);
  return vals[lower] + t * (vals[upper] - vals[lower]);
}

function normCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

export interface GrowthResult {
  z: number;
  percentile: number;
  band: "low" | "lower-mid" | "mid" | "upper-mid" | "high";
  bandLabel: string;
}

export function growthReference(
  sex: BabySex | undefined,
  measure: "weight" | "length",
  month: number,
) {
  const ref = (measure === "weight" ? WFA : LFA)[sex ?? "female"];
  return { median: lerp(ref, month, 0), sd: lerp(ref, month, 1), ref };
}

export function percentileOf(
  value: number,
  sex: BabySex | undefined,
  measure: "weight" | "length",
  month: number,
): GrowthResult {
  const { median, sd } = growthReference(sex, measure, month);
  const z = sd > 0 ? (value - median) / sd : 0;
  const percentile = Math.round(normCdf(z) * 100);
  let band: GrowthResult["band"];
  if (z < -2) band = "low";
  else if (z < 0) band = "lower-mid";
  else if (z < 1) band = "mid";
  else if (z < 2) band = "upper-mid";
  else band = "high";
  const bandLabel =
    band === "low"
      ? "Below 2nd"
      : band === "lower-mid"
        ? "2nd – 50th"
        : band === "mid"
          ? "50th – 84th"
          : band === "upper-mid"
            ? "84th – 98th"
            : "Above 98th";
  return { z, percentile, band, bandLabel };
}

export function ageAtLog(log: Log, baby: Baby | null) {
  if (!baby) return 0;
  const ms = new Date(log.startTime).getTime() - new Date(baby.birthDate).getTime();
  return Math.max(0, ms / (1000 * 60 * 60 * 24 * 30.4375));
}

export function growthPoints(
  logs: Log[],
  baby: Baby | null,
  measure: "weight" | "length",
) {
  return logs
    .filter((l) => l.category === "growth")
    .map((log) => {
      const value =
        measure === "weight"
          ? (log.details.weightKg as number | undefined)
          : (log.details.heightCm as number | undefined);
      if (typeof value !== "number" || value <= 0) return null;
      const month = ageAtLog(log, baby);
      return { log, month, value, result: percentileOf(value, baby?.sex, measure, month) };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => a.month - b.month);
}