import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultDraft, validateDraft } from "@/sprout/lib/forms";
import type { AppSettings } from "@/sprout/lib/types";

// defaultDraft does not read settings; a stub keeps the call honest.
const settings = {} as AppSettings;

describe("defaultDraft — sleep type follows time of day", () => {
  afterEach(() => vi.useRealTimers());

  it("defaults to night between 7pm and 6am", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T22:00:00"));
    expect(defaultDraft("sleep", settings).subtype).toBe("night");
  });

  it("defaults to nap in the middle of the day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00"));
    expect(defaultDraft("sleep", settings).subtype).toBe("nap");
  });
});

describe("validateDraft — Save stays blocked until the entry is valid", () => {
  it("blocks growth with no measurements", () => {
    expect(validateDraft(defaultDraft("growth", settings)).weightKg).toBeTruthy();
  });

  it("allows growth once a measurement is entered", () => {
    const draft = defaultDraft("growth", settings);
    draft.details.weightKg = 5;
    expect(Object.keys(validateDraft(draft))).toHaveLength(0);
  });

  it("blocks a temperature entry with no reading", () => {
    const draft = defaultDraft("health", settings);
    draft.healthSubtype = "temperature";
    draft.subtype = "temperature";
    draft.details.temperatureC = 0;
    expect(validateDraft(draft).temperatureC).toBeTruthy();
  });

  it("blocks a vaccine with no name", () => {
    const draft = defaultDraft("health", settings);
    draft.healthSubtype = "vaccine";
    draft.subtype = "vaccine";
    draft.details.vaccineName = "";
    expect(validateDraft(draft).vaccineName).toBeTruthy();
  });

  it("blocks a medication with no name", () => {
    const draft = defaultDraft("health", settings);
    draft.healthSubtype = "medication";
    draft.subtype = "medication";
    draft.details.medicationName = "";
    expect(validateDraft(draft).medicationName).toBeTruthy();
  });

  it("accepts the default sleep draft", () => {
    expect(Object.keys(validateDraft(defaultDraft("sleep", settings)))).toHaveLength(0);
  });
});
