"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Crown } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useHousehold } from "@/lib/use-household";
import { addChild } from "@/lib/db/children";
import { listCaregivers, updateCaregiverRole } from "@/lib/db/caregivers";
import { listTags, addTag, removeTag, type CustomTag } from "@/lib/db/tags";
import { track } from "@/lib/analytics";
import { isProUser } from "@/lib/config";
import { inviteCaregiver } from "@/lib/billing";
import { openBillingPortal } from "@/lib/billing";
import Canonical from "@/components/Canonical";
import ProUpgradeModal from "@/components/ProUpgradeModal";
import AppHeader from "@/components/app/AppHeader";
import type { CaregiverInvite } from "@/types/models";

const PRO_CHILD_LIMIT = 2;

export default function HouseholdSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    loading: householdLoading,
    householdId,
    children,
    planTier,
    refresh: refreshHousehold,
  } = useHousehold();

  const [proModalOpen, setProModalOpen] = useState(false);
  const [caregivers, setCaregivers] = useState<CaregiverInvite[]>([]);
  const [tags, setTags] = useState<CustomTag[]>([]);
  const [loading, setLoading] = useState(true);

  // New child form
  const [newChildName, setNewChildName] = useState("");
  const [newChildBirthDate, setNewChildBirthDate] = useState("");
  const [addChildError, setAddChildError] = useState<string | null>(null);
  const [addingChild, setAddingChild] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [inviteError, setInviteError] = useState("");

  // Tag form
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newTagColor, setNewTagColor] = useState("#F3ECE0");
  const [tagError, setTagError] = useState<string | null>(null);

  // Billing
  const [billingError, setBillingError] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  const isPro = isProUser(planTier);

  // Role-based permissions ("Read/Log mode"): only admins manage
  // children, members and tags. Owners are admins by construction.
  const me = user ? caregivers.find((c) => c.userId === user.id) : undefined;
  const amAdmin = !!me && (me.isOwner || me.role === "admin");

  const load = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    try {
      const [caregiverRows, tagRows] = await Promise.all([
        listCaregivers(householdId),
        listTags(householdId),
      ]);
      setCaregivers(caregiverRows);
      setTags(tagRows);
    } catch {
      // RLS may block partial reads — keep existing state
    }
    setLoading(false);
  }, [householdId]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/sign-in");
  }, [authLoading, user, router]);

  useEffect(() => { if (householdId) load(); }, [householdId, load]);

  useEffect(() => {
    if (!householdLoading && householdId) track("household_settings_view");
  }, [householdLoading, householdId]);

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    setAddChildError(null);
    if (!isPro) {
      track("third_child_paywall_shown");
      setProModalOpen(true);
      return;
    }
    if (!householdId || !newChildName || !newChildBirthDate) return;
    setAddingChild(true);
    try {
      await addChild(householdId, {
        name: newChildName,
        birthDate: newChildBirthDate,
        colorTag: newChildName.length % 2 === 0 ? "#D98C5F" : "#5FA39A",
      });
      setNewChildName("");
      setNewChildBirthDate("");
      await refreshHousehold();
    } catch {
      setAddChildError("Couldn't add that child — try again.");
    }
    setAddingChild(false);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!isPro) {
      track("invite_paywall_shown");
      setProModalOpen(true);
      return;
    }
    if (!householdId || !inviteEmail) return;
    setInviteStatus("sending");
    setInviteError("");
    try {
      await inviteCaregiver(householdId, inviteEmail);
      setInviteStatus("done");
      setInviteEmail("");
      await load();
    } catch (err) {
      setInviteStatus("error");
      setInviteError(err instanceof Error ? err.message : "Couldn't send that invite.");
    }
  }

  async function handleRoleChange(userId: string, role: "admin" | "caregiver") {
    if (!householdId) return;
    try {
      await updateCaregiverRole(householdId, userId, role);
      await load();
    } catch {
      track("role_change_failed");
    }
  }

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    setTagError(null);
    if (!isPro) {
      track("custom_tags_paywall_shown");
      setProModalOpen(true);
      return;
    }
    if (!householdId || !newTagLabel.trim()) return;
    try {
      await addTag(householdId, newTagLabel.trim(), newTagColor);
      setNewTagLabel("");
      await load();
    } catch {
      setTagError("Couldn't add that tag (duplicate labels aren't allowed).");
    }
  }

  async function handleRemoveTag(id: string) {
    try {
      await removeTag(id);
      await load();
    } catch {
      setTagError("Couldn't remove that tag.");
    }
  }

  async function handleBillingPortal() {
    setBillingError(null);
    setBillingLoading(true);
    track("billing_portal_clicked");
    try {
      await openBillingPortal();
    } catch (err) {
      setBillingError(
        err instanceof Error && err.message
          ? err.message
          : "Billing isn't set up yet on this environment."
      );
    }
    setBillingLoading(false);
  }

  async function handleUpgradeClick() {
    track("upgrade_clicked");
    setProModalOpen(true);
  }

  if (authLoading || householdLoading) {
    return (
      <>
        <Canonical url="https://www.siblingstack.com/settings/household" />
        <main className="min-h-screen px-6 py-8"><div className="h-7 w-36 bg-surface2 rounded animate-pulse" /></main>
      </>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6">
      <Canonical url="https://www.siblingstack.com/settings/household" />
      <AppHeader />
      <div className="max-w-3xl mx-auto mt-6 flex flex-col gap-8">
        <h1 className="font-display text-xl text-ink">Household &amp; Settings</h1>

        {/* ── Child profiles ─────────────────────────────────────────── */}
        <section className="bg-surface rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base text-ink">Child profiles</h2>
            {!isPro && (
              <button onClick={handleUpgradeClick} className="flex items-center gap-1.5 text-childA text-xs font-medium">
                <Crown size={13} />
                {children.length < PRO_CHILD_LIMIT ? "Add more with Pro" : "Pro: unlimited kids"}
              </button>
            )}
          </div>

          <ul className="flex flex-col gap-2 mb-4">
            {children.map((child, i) => (
              <li key={child.id} className="flex items-center justify-between bg-bg border border-surface2 rounded-md px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs shrink-0"
                    style={{ backgroundColor: child.colorTag, color: "#1C1815" }}
                  >
                    {child.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm text-ink">{child.name}</p>
                    <p className="text-xs text-ink-muted">
                      {i === 0 ? "Older" : i === 1 ? "Younger" : `Child ${i + 1}`} · {child.birthDate}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            {children.length === 0 && (
              <li className="text-sm text-ink-muted">No children yet.</li>
            )}
          </ul>

          {amAdmin ? (
            <form onSubmit={handleAddChild} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="text-xs text-ink-muted block mb-1">Name</label>
                <input
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="New child's name"
                  className="w-full bg-bg border border-surface2 rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-childA"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted block mb-1">Birth date</label>
                <input
                  type="date"
                  value={newChildBirthDate}
                  onChange={(e) => setNewChildBirthDate(e.target.value)}
                  className="bg-bg border border-surface2 rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-childA"
                />
              </div>
              <button
                type="submit"
                disabled={addingChild}
                className="flex items-center justify-center gap-1.5 bg-childA text-bg text-sm font-medium rounded-md px-4 py-2 disabled:opacity-50"
              >
                <Plus size={14} />
                {addingChild ? "Adding…" : "Add child"}
              </button>
            </form>
          ) : (
            <p className="text-ink-muted text-xs">
              Only admins can add child profiles. Ask an admin if someone needs adding.
            </p>
          )}
          {children.length >= PRO_CHILD_LIMIT && !isPro && (
            <p className="text-ink-muted text-xs mt-2">
              The free plan covers two kids. Upgrade to add more profiles.
            </p>
          )}
          {addChildError && <p className="text-conflict text-xs mt-2">{addChildError}</p>}
        </section>

        {/* ── Caregivers ────────────────────────────────────────────── */}
        <section className="bg-surface rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base text-ink">Caregivers</h2>
            {!isPro && (
              <button onClick={handleUpgradeClick} className="flex items-center gap-1.5 text-childA text-xs font-medium">
                <Crown size={13} />
                Sync with Pro
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-muted text-xs font-mono uppercase tracking-wider border-b border-surface2">
                  <th className="py-2 pr-3">Member</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {caregivers.map((c) => (
                  <tr key={c.userId} className="border-b border-surface2 last:border-0">
                    <td className="py-2 pr-3">
                      <p className="text-ink">{c.displayName ?? "Caregiver"}</p>
                      <p className="text-ink-muted text-xs">{c.email}</p>
                    </td>
                    <td className="py-2 pr-3">
                      <span className={`text-xs font-mono rounded-full px-2 py-0.5 ${c.isOwner ? "bg-childB/10 text-childB" : "bg-surface2 text-ink-muted"}`}>
                        {c.isOwner ? "Owner" : "Active"}
                      </span>
                    </td>
                    <td className="py-2">
                      {c.isOwner ? (
                        <span className="text-xs text-ink-muted">Admin</span>
                      ) : amAdmin ? (
                        <select
                          value={c.role}
                          onChange={(e) => handleRoleChange(c.userId, e.target.value as "admin" | "caregiver")}
                          className="bg-bg border border-surface2 rounded-md px-2 py-1 text-xs text-ink outline-none focus:border-childA"
                        >
                          <option value="admin">Admin</option>
                          <option value="caregiver">Caregiver</option>
                        </select>
                      ) : (
                        <span className="text-xs text-ink-muted capitalize">{c.role}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {caregivers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="py-3 text-ink-muted">No members yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {amAdmin ? (
            <form onSubmit={handleInvite} className="flex gap-2 mt-4">
              <input
                type="email"
                required
                placeholder="partner@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-bg border border-surface2 rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-childA"
              />
              <button
                type="submit"
                disabled={inviteStatus === "sending"}
                className="bg-childA text-bg text-sm font-medium rounded-md px-3 disabled:opacity-50"
              >
                {inviteStatus === "sending" ? "Sending…" : "Invite member"}
              </button>
            </form>
          ) : (
            <p className="text-ink-muted text-xs mt-4">
              Only admins can invite caregivers.
            </p>
          )}
          {inviteStatus === "done" && <p className="text-childB text-xs mt-2">Added to your household.</p>}
          {inviteStatus === "error" && <p className="text-conflict text-xs mt-2">{inviteError}</p>}
          {!isPro && (
            <p className="text-ink-muted text-xs mt-2">
              Real-time caregiver sync is a Pro feature.
            </p>
          )}
        </section>

        {/* ── Custom tags ────────────────────────────────────────────── */}
        <section className="bg-surface rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base text-ink">Custom tracking tags</h2>
            {!isPro && (
              <button onClick={handleUpgradeClick} className="flex items-center gap-1.5 text-childA text-xs font-medium">
                <Crown size={13} />
                Pro feature
              </button>
            )}
          </div>

          <ul className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <li key={tag.id} className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono" style={{ backgroundColor: tag.color, color: "#1C1815" }}>
                {tag.label}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="opacity-70 hover:opacity-100"
                  aria-label={`Remove ${tag.label}`}
                >
                  <Trash2 size={11} />
                </button>
              </li>
            ))}
            {tags.length === 0 && !loading && <li className="text-sm text-ink-muted">No custom tags yet.</li>}
          </ul>

          {amAdmin ? (
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                placeholder="e.g. Medication, Milestone…"
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                className="flex-1 bg-bg border border-surface2 rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-childA"
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-10 h-10 bg-bg border border-surface2 rounded-md cursor-pointer"
                aria-label="Tag color"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-childB text-bg text-sm font-medium rounded-md px-3"
              >
                <Plus size={14} />
                Add
              </button>
            </form>
          ) : (
            <p className="text-ink-muted text-xs">Only admins can manage tags.</p>
          )}
          {tagError && <p className="text-conflict text-xs mt-2">{tagError}</p>}
        </section>

        {/* ── Billing ───────────────────────────────────────────────── */}
        <section className="bg-surface rounded-md p-5">
          <h2 className="font-display text-base text-ink mb-3">Subscription</h2>
          {isPro ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-ink">
                You're on <span className="text-childB font-medium">Sibling Stack Pro</span> —
                real-time sync, unlimited history, and custom tags unlocked.
              </p>
              <button
                onClick={handleBillingPortal}
                disabled={billingLoading}
                className="self-start text-sm border border-childB text-childB rounded-md py-2 px-4 hover:bg-childB/10 transition-colors disabled:opacity-50"
              >
                {billingLoading ? "Opening…" : "Manage billing"}
              </button>
              {billingError && (
                <p className="text-conflict text-xs">{billingError}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-ink-muted">
                You're on the free plan — 7-day history, 2 kids, and offline logging.
              </p>
              <button
                onClick={handleUpgradeClick}
                className="self-start flex items-center gap-2 bg-childA text-bg text-sm font-medium rounded-md py-2 px-4"
              >
                <Crown size={15} />
                Upgrade to Pro
              </button>
              <p className="text-ink-muted text-xs">
                $3.99/mo or $29.99/yr · 7-day free trial · cancel anytime.
              </p>
            </div>
          )}
        </section>
      </div>

      <ProUpgradeModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </main>
  );
}