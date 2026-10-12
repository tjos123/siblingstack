import { activeLogs } from "./stats";
import type { Baby, Log } from "./types";

export interface Vaccine {
  id: string;
  name: string;
  minMonths: number;
  maxMonths: number;
}

export type VaccineStatus = "given" | "due" | "upcoming" | "overdue";

export interface VaccineRow extends Vaccine {
  status: VaccineStatus;
  ageMonths: number;
}

export const VACCINE_SCHEDULE: Vaccine[] = [
  { id: "hepb1", name: "Hepatitis B (1st)", minMonths: 0, maxMonths: 2 },
  { id: "hepb2", name: "Hepatitis B (2nd)", minMonths: 1, maxMonths: 2 },
  { id: "rot1", name: "Rotavirus (1st)", minMonths: 2, maxMonths: 4 },
  { id: "dtap1", name: "DTaP (1st)", minMonths: 2, maxMonths: 4 },
  { id: "ipv1", name: "Polio (1st)", minMonths: 2, maxMonths: 4 },
  { id: "hib1", name: "Hib (1st)", minMonths: 2, maxMonths: 4 },
  { id: "pcv1", name: "Pneumococcal (1st)", minMonths: 2, maxMonths: 4 },
  { id: "dtap2", name: "DTaP (2nd)", minMonths: 4, maxMonths: 6 },
  { id: "ipv2", name: "Polio (2nd)", minMonths: 4, maxMonths: 18 },
  { id: "hib2", name: "Hib (2nd)", minMonths: 4, maxMonths: 6 },
  { id: "pcv2", name: "Pneumococcal (2nd)", minMonths: 4, maxMonths: 6 },
  { id: "dtap3", name: "DTaP (3rd)", minMonths: 6, maxMonths: 18 },
  { id: "hib3", name: "Hib (3rd)", minMonths: 6, maxMonths: 12 },
  { id: "pcv3", name: "Pneumococcal (3rd)", minMonths: 6, maxMonths: 12 },
  { id: "flu", name: "Influenza (seasonal)", minMonths: 6, maxMonths: 23 },
  { id: "mmr", name: "MMR", minMonths: 12, maxMonths: 15 },
  { id: "var", name: "Varicella", minMonths: 12, maxMonths: 15 },
  { id: "hepa", name: "Hepatitis A", minMonths: 12, maxMonths: 23 },
];

export function ageInMonths(birthDate: string, now = new Date()) {
  const months =
    (now.getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
  return Math.max(0, months);
}

function givenVaccines(logs: Log[]): Set<string> {
  const set = new Set<string>();
  activeLogs(logs).forEach((log) => {
    if (log.category !== "health" || log.healthSubtype !== "vaccine") return;
    const name = (log.details.vaccineName as string) ?? "";
    if (name) set.add(name.trim().toLowerCase());
  });
  return set;
}

export function vaccineStatus(logs: Log[], baby: Baby | null): VaccineRow[] {
  const given = givenVaccines(logs);
  const ageMonths = baby ? ageInMonths(baby.birthDate) : 0;
  return VACCINE_SCHEDULE.map((vaccine) => {
    const matchedName = Array.from(given).find((name) =>
      name.includes(vaccine.name.toLowerCase()),
    );
    let status: VaccineStatus = "upcoming";
    if (matchedName) status = "given";
    else if (ageMonths >= vaccine.minMonths) {
      status = ageMonths > vaccine.maxMonths ? "overdue" : "due";
    }
    return { ...vaccine, status, ageMonths };
  });
}