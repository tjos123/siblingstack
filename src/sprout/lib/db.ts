import Dexie, { type Table } from "dexie";
import type { AppSettings, Baby, Log } from "./types";

export class SproutDB extends Dexie {
  logs!: Table<Log, string>;
  babies!: Table<Baby, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super("sprout-baby");
    this.version(1).stores({
      logs: "id, category, startTime, babyId, updatedAt, deleted",
      babies: "id, createdAt",
      settings: "id",
    });
  }
}

let instance: SproutDB | null = null;

export function getDB(): SproutDB {
  if (typeof window === "undefined") {
    throw new Error("SproutDB is only available in the browser");
  }
  if (!instance) {
    instance = new SproutDB();
  }
  return instance;
}

export function dbAvailable() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

export const DB_NAME = "sprout-baby";
export const SETTINGS_ID = "app";
export const ACTIVE_BABY_KEY = "sprout_active_baby";
