import { describe, expect, it } from "vitest";
import {
  isDirtyBaby,
  isDirtyLog,
  mergeRemoteBaby,
  mergeRemoteLog,
  serverToLog,
} from "../merge";
import type { Baby, Log } from "../types";

function makeLog(overrides: Partial<Log> = {}): Log {
  return {
    id: "log_1",
    babyId: "baby_1",
    userId: "u1",
    category: "feed",
    subtype: "bottlefeed",
    feedSubtype: "bottlefeed",
    diaperSubtype: null,
    healthSubtype: null,
    startTime: "2026-01-01T10:00:00.000Z",
    endTime: null,
    details: { bottleAmountOz: 4, notes: "local" },
    createdAt: "2026-01-01T10:00:00.000Z",
    updatedAt: "2026-01-01T10:05:00.000Z",
    deleted: false,
    syncedAt: "2026-01-01T10:05:00.000Z",
    clocks: {
      start_time: "c1",
      category: "z9",
      "details.bottleAmountOz": "c1",
      "details.notes": "z9",
    },
    householdId: "h1",
    ...overrides,
  };
}

function makeBaby(overrides: Partial<Baby> = {}): Baby {
  return {
    id: "baby_1",
    name: "Local",
    birthDate: "2026-01-01",
    avatarEmoji: "🌱",
    color: "sage",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:05:00.000Z",
    syncedAt: "2026-01-01T00:05:00.000Z",
    clocks: { name: "z9", color: "c1" },
    householdId: "h1",
    ...overrides,
  };
}

describe("mergeRemoteLog", () => {
  it("keeps the field with the greater clock, per field", () => {
    const local = makeLog();
    const remote = makeLog({
      startTime: "2026-01-01T11:00:00.000Z",
      category: "sleep",
      details: { bottleAmountOz: 5, notes: "remote" },
      clocks: {
        start_time: "c2",
        category: "a0",
        "details.bottleAmountOz": "c2",
        "details.notes": "a0",
      },
      updatedAt: "2026-01-01T10:10:00.000Z",
      syncedAt: "2026-01-01T10:10:00.000Z",
    });

    const merged = mergeRemoteLog(local, remote);

    expect(merged.startTime).toBe("2026-01-01T11:00:00.000Z"); // remote newer
    expect(merged.category).toBe("feed"); // local newer
    expect(merged.details.bottleAmountOz).toBe(5); // remote newer
    expect(merged.details.notes).toBe("local"); // local newer
    expect(merged.householdId).toBe("h1");
  });

  it("adopts remote sync metadata when the local row is not dirty", () => {
    const merged = mergeRemoteLog(
      makeLog(),
      makeLog({
        updatedAt: "2026-01-01T10:10:00.000Z",
        syncedAt: "2026-01-01T10:10:00.000Z",
        clocks: { start_time: "c2" },
      }),
    );
    expect(merged.syncedAt).toBe("2026-01-01T10:10:00.000Z");
    expect(merged.updatedAt).toBe("2026-01-01T10:10:00.000Z");
  });

  it("stays dirty when the local row has unsynced edits", () => {
    const local = makeLog({
      updatedAt: "2026-01-01T10:20:00.000Z",
      syncedAt: "2026-01-01T10:05:00.000Z",
    });
    const merged = mergeRemoteLog(
      local,
      makeLog({ updatedAt: "2026-01-01T10:10:00.000Z", syncedAt: "2026-01-01T10:10:00.000Z" }),
    );
    expect(isDirtyLog(merged)).toBe(true);
  });
});

describe("mergeRemoteBaby", () => {
  it("merges per field with clocks", () => {
    const merged = mergeRemoteBaby(
      makeBaby(),
      makeBaby({
        name: "Remote",
        color: "sky",
        clocks: { name: "a0", color: "c2" },
      }),
    );
    expect(merged.name).toBe("Local"); // local newer
    expect(merged.color).toBe("sky"); // remote newer
  });
});

describe("dirty detection", () => {
  it("marks never-synced rows and newer-than-synced rows dirty", () => {
    expect(isDirtyLog(makeLog({ syncedAt: null }))).toBe(true);
    expect(
      isDirtyLog(makeLog({ updatedAt: "2026-01-01T10:09:00.000Z", syncedAt: "2026-01-01T10:05:00.000Z" })),
    ).toBe(true);
    expect(isDirtyLog(makeLog())).toBe(false);
    expect(isDirtyBaby(makeBaby({ syncedAt: null }))).toBe(true);
    expect(isDirtyBaby(makeBaby())).toBe(false);
  });
});

describe("serverToLog", () => {
  it("maps snake_case columns back to the local model", () => {
    const log = serverToLog({
      id: "log_9",
      baby_id: "baby_9",
      user_id: "u9",
      category: "sleep",
      subtype: "nap",
      feed_subtype: null,
      diaper_subtype: null,
      health_subtype: null,
      start_time: "2026-01-01T09:00:00.000Z",
      end_time: null,
      details: { notes: "x" },
      created_at: "2026-01-01T09:00:00.000Z",
      updated_at: "2026-01-01T09:01:00.000Z",
      deleted: false,
      clocks: { start_time: "c1" },
      household_id: "h9",
    });
    expect(log.babyId).toBe("baby_9");
    expect(log.category).toBe("sleep");
    expect(log.subtype).toBe("nap");
    expect(log.syncedAt).toBe("2026-01-01T09:01:00.000Z");
    expect(log.householdId).toBe("h9");
  });
});
