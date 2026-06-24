"use client";

import { useState } from "react";
import {
  formatClockTime,
  toDatetimeLocalValue,
  fromDatetimeLocalValue,
} from "@/lib/time";
import { updateEvent, deleteEvent } from "@/lib/db/events";
import { track } from "@/lib/analytics";
import type { Child, EventType, ScheduleEvent } from "@/types/models";

interface Props {
  householdId: string;
  events: ScheduleEvent[];
  childA: Child;
  childB: Child;
  onChanged: () => void;
}

const TYPE_OPTIONS: EventType[] = ["sleep", "feed", "diaper", "milestone", "note"];

function childFor(childId: string, childA: Child, childB: Child): Child | undefined {
  if (childId === childA.id) return childA;
  if (childId === childB.id) return childB;
  return undefined;
}

export default function EventLog({ householdId, events, childA, childB, onChanged }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = [...events].sort((a, b) => a.startTime - b.startTime);

  async function handleDelete(event: ScheduleEvent) {
    if (!window.confirm("Delete this event? This can't be undone.")) return;
    setBusyId(event.id);
    try {
      await deleteEvent(householdId, event.id);
      track("event_deleted", { type: event.type });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  if (sorted.length === 0) {
    return (
      <div className="bg-surface rounded-md p-4">
        <h3 className="font-display text-base text-ink mb-1">Day's log</h3>
        <p className="text-ink-muted text-sm">Nothing logged for this day yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-md p-4">
      <h3 className="font-display text-base text-ink mb-3">Day's log</h3>
      <ul className="flex flex-col gap-2">
        {sorted.map((event) => {
          const child = childFor(event.childId, childA, childB);
          const isEditing = editingId === event.id;
          const isBusy = busyId === event.id;

          if (isEditing) {
            return (
              <EditRow
                key={event.id}
                householdId={householdId}
                event={event}
                onCancel={() => setEditingId(null)}
                onSaved={() => {
                  setEditingId(null);
                  onChanged();
                }}
              />
            );
          }

          return (
            <li
              key={event.id}
              className="flex items-center gap-3 text-sm py-1 border-b border-surface2 last:border-0"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  child === childA ? "bg-childA" : "bg-childB"
                }`}
              />
              <span className="font-mono text-ink-muted w-32 shrink-0">
                {formatClockTime(event.startTime)}
                {event.endTime ? `–${formatClockTime(event.endTime)}` : " (ongoing)"}
              </span>
              <span className="text-ink flex-1">
                {child?.name ?? "Unknown"} — {event.type}
                {event.notes ? `: ${event.notes}` : ""}
              </span>
              <button
                onClick={() => setEditingId(event.id)}
                disabled={isBusy}
                className="text-childB text-xs underline disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event)}
                disabled={isBusy}
                className="text-conflict text-xs underline disabled:opacity-50"
              >
                {isBusy ? "…" : "Delete"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EditRow({
  householdId,
  event,
  onCancel,
  onSaved,
}: {
  householdId: string;
  event: ScheduleEvent;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState<EventType>(event.type);
  const [startValue, setStartValue] = useState(toDatetimeLocalValue(event.startTime));
  const [endValue, setEndValue] = useState(
    event.endTime ? toDatetimeLocalValue(event.endTime) : ""
  );
  const [notes, setNotes] = useState(event.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateEvent(householdId, event.id, {
        type,
        startTime: fromDatetimeLocalValue(startValue),
        endTime: endValue ? fromDatetimeLocalValue(endValue) : null,
        notes,
      });
      track("event_edited", { type });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="bg-bg rounded-md p-3 flex flex-col gap-2 text-sm">
      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as EventType)}
          className="bg-surface border border-surface2 rounded-md px-2 py-1 text-ink text-xs"
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={startValue}
          onChange={(e) => setStartValue(e.target.value)}
          className="bg-surface border border-surface2 rounded-md px-2 py-1 text-ink text-xs flex-1"
        />
        <input
          type="datetime-local"
          value={endValue}
          onChange={(e) => setEndValue(e.target.value)}
          placeholder="ongoing"
          className="bg-surface border border-surface2 rounded-md px-2 py-1 text-ink text-xs flex-1"
        />
      </div>
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="bg-surface border border-surface2 rounded-md px-2 py-1 text-ink text-xs"
      />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="text-ink-muted text-xs underline">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-childA text-bg text-xs font-medium rounded-md px-3 py-1 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </li>
  );
}
