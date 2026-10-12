import type {
  LengthUnit,
  TemperatureUnit,
  VolumeUnit,
  WeightUnit,
} from "./types";

const OZ_TO_ML = 29.5735;
const KG_TO_LB = 2.20462;

export const ozToMl = (oz: number) => oz * OZ_TO_ML;
export const mlToOz = (ml: number) => ml / OZ_TO_ML;
export const kgToLb = (kg: number) => kg * KG_TO_LB;
export const lbToKg = (lb: number) => lb / KG_TO_LB;
export const cmToIn = (cm: number) => cm / 2.54;
export const inToCm = (inch: number) => inch * 2.54;
export const cToF = (c: number) => c * 1.8 + 32;
export const fToC = (f: number) => (f - 32) / 1.8;

function trim(value: number, decimals = 1) {
  const rounded = Number(value.toFixed(decimals));
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(decimals);
}

export function volumeFromOz(oz: number, unit: VolumeUnit) {
  return unit === "ml" ? ozToMl(oz) : oz;
}

export function ozFromVolume(value: number, unit: VolumeUnit) {
  return unit === "ml" ? mlToOz(value) : value;
}

export function formatVolume(oz: number | undefined | null, unit: VolumeUnit) {
  if (oz === undefined || oz === null || Number.isNaN(oz)) return "—";
  return unit === "ml"
    ? `${trim(ozToMl(oz), 0)} mL`
    : `${trim(oz, 1)} oz`;
}

export function formatVolumeCompact(
  oz: number | undefined | null,
  unit: VolumeUnit,
) {
  if (oz === undefined || oz === null || Number.isNaN(oz)) return "—";
  return unit === "ml" ? `${trim(ozToMl(oz), 0)}ml` : `${trim(oz, 1)}oz`;
}

export function weightFromKg(kg: number, unit: WeightUnit) {
  return unit === "lb" ? kgToLb(kg) : kg;
}

export function kgFromWeight(value: number, unit: WeightUnit) {
  return unit === "lb" ? lbToKg(value) : value;
}

export function formatWeight(
  kg: number | undefined | null,
  unit: WeightUnit = "kg",
) {
  if (kg === undefined || kg === null || Number.isNaN(kg)) return "—";
  return unit === "lb" ? `${trim(kgToLb(kg), 1)} lb` : `${trim(kg, 2)} kg`;
}

export function lengthFromCm(cm: number, unit: LengthUnit) {
  return unit === "in" ? cmToIn(cm) : cm;
}

export function cmFromLength(value: number, unit: LengthUnit) {
  return unit === "in" ? inToCm(value) : value;
}

export function formatLength(
  cm: number | undefined | null,
  unit: LengthUnit = "cm",
) {
  if (cm === undefined || cm === null || Number.isNaN(cm)) return "—";
  return unit === "in" ? `${trim(cmToIn(cm), 1)} in` : `${trim(cm, 1)} cm`;
}

export function temperatureFromC(c: number, unit: TemperatureUnit) {
  return unit === "F" ? cToF(c) : c;
}

export function cFromTemperature(value: number, unit: TemperatureUnit) {
  return unit === "F" ? fToC(value) : value;
}

export function formatTemperature(
  c: number | undefined | null,
  unit: TemperatureUnit = "C",
) {
  if (c === undefined || c === null || Number.isNaN(c)) return "—";
  return unit === "F"
    ? `${trim(cToF(c), 1)}°F`
    : `${trim(c, 1)}°C`;
}
