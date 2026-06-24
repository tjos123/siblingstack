// src/types/models.ts
//
// Data model overview
// --------------------
// households/{householdId}
//   households/{householdId}/children/{childId}
//   households/{householdId}/events/{eventId}
// users/{userId}
//
// Why subcollections under household (not top-level "children" / "events"
// collections filtered by householdId): it keeps security rules simple
// (one ownership check covers everything underneath) and keeps queries
// cheap since you almost always need "all events for this household,
// this date range" rather than querying across households.

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  householdIds: string[];
  premiumStatus: "free" | "premium";
  stripeCustomerId?: string;
  createdAt: number; // epoch ms
}

export interface Household {
  id: string;
  name: string;
  ownerId: string; // uid of creator
  caregiverIds: string[]; // includes ownerId; everyone who can read/write
  createdAt: number;
}

export interface Child {
  id: string;
  householdId: string;
  name: string;
  birthDate: string; // ISO date, e.g. "2025-11-02"
  colorTag: string; // hex code used to color-code this child across the UI
  createdAt: number;
}

export type EventType = "feed" | "sleep" | "diaper" | "milestone" | "note";

export interface ScheduleEvent {
  id: string;
  householdId: string;
  childId: string;
  type: EventType;
  startTime: number; // epoch ms
  endTime: number | null; // null = currently ongoing (e.g. baby is asleep now)
  notes?: string;
  createdBy: string; // uid
  createdAt: number;
}

// Not stored — computed client-side (or in a Cloud Function later) by
// comparing two children's events for a given window. See lib/conflicts.ts.
export interface ConflictWindow {
  type: EventType;
  childAId: string;
  childBId: string;
  overlapStart: number;
  overlapEnd: number;
}
