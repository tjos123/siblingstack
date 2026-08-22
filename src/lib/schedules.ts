export interface ScheduleEntry {
  time: string;
  activity: string;
  type: "baby" | "toddler" | "both";
  note?: string;
}

export interface ScheduleMeta {
  slug: string;
  title: string;
  description: string;
  ageGroup: string;
  timeline: ScheduleEntry[];
}

export const schedules: ScheduleMeta[] = [
  {
    slug: "2-under-2-schedule",
    title: "2 Under 2 Daily Schedule",
    description:
      "A synchronized daily routine for a newborn (0–3 months) and a toddler (18–24 months) designed to maximize overlapping nap times.",
    ageGroup: "Newborn + 18–24 Months",
    timeline: [
      { time: "07:00", activity: "Morning wake-up & feeding", type: "both", note: "Nurse/bottle feed baby while toddler plays independently nearby." },
      { time: "08:15", activity: "Baby nap #1", type: "baby", note: "Wake window ~75 min. Put baby down; focused 1-on-1 breakfast/playtime with toddler." },
      { time: "09:30", activity: "Toddler activity block", type: "toddler", note: "Outing, crafts, or free play — structured time while baby sleeps." },
      { time: "10:30", activity: "Baby wake & feed", type: "baby", note: "Quick feed, then both kids together for a short joint activity." },
      { time: "11:30", activity: "Lunch", type: "both", note: "Toddler in high chair, baby fed separately or nursed." },
      { time: "12:15", activity: "Baby nap #2", type: "baby", note: "Wake window ~90 min." },
      { time: "13:00", activity: "Toddler nap", type: "toddler", note: "Overlap window begins — both kids napping." },
      { time: "14:30", activity: "Golden hour ends", type: "both", note: "Toddler wakes first; baby may still sleep. Quiet toddler play while baby finishes." },
      { time: "15:30", activity: "Afternoon outing / stroller walk", type: "both" },
      { time: "17:00", activity: "Dinner", type: "both" },
      { time: "18:00", activity: "Toddler bedtime routine", type: "toddler" },
      { time: "18:30", activity: "Baby feed & bed", type: "baby", note: "Baby's last feed before parents' evening." },
    ],
  },
  {
    slug: "18-month-and-newborn",
    title: "18-Month-Old & Newborn Schedule",
    description:
      "A practical routine when your toddler still takes two naps and your newborn is under 2 months — the overlap is small but real.",
    ageGroup: "Newborn + 18 Months",
    timeline: [
      { time: "06:30", activity: "Both kids wake", type: "both", note: "Early start — toddler up first, baby often wakes soon after." },
      { time: "07:00", activity: "Breakfast & morning feed", type: "both" },
      { time: "08:30", activity: "Toddler nap #1", type: "toddler", note: "Baby may still be awake; do a quiet feed or contact nap." },
      { time: "09:00", activity: "Baby nap", type: "baby", note: "If timing aligns, overlapping nap window." },
      { time: "10:30", activity: "Both kids up — snack & play", type: "both" },
      { time: "12:00", activity: "Lunch", type: "both" },
      { time: "13:00", activity: "Toddler nap #2", type: "toddler", note: "Short second nap for toddler." },
      { time: "13:30", activity: "Baby nap", type: "baby", note: "Second overlap window." },
      { time: "15:00", activity: "Afternoon — park or errands", type: "both" },
      { time: "17:00", activity: "Dinner", type: "both" },
      { time: "18:00", activity: "Toddler bed routine", type: "toddler" },
      { time: "18:30", activity: "Baby feed & bed", type: "baby" },
    ],
  },
  {
    slug: "two-toddlers-sync",
    title: "Two Toddlers Synced",
    description:
      "When both kids are past the newborn stage (e.g. 14 months and 26 months), nap syncing becomes more achievable and the schedule gets easier.",
    ageGroup: "14 Months + 26 Months",
    timeline: [
      { time: "07:00", activity: "Both wake up", type: "both" },
      { time: "07:30", activity: "Breakfast together", type: "both" },
      { time: "08:30", activity: "Morning play / outing", type: "both" },
      { time: "10:00", activity: "Nap — both kids", type: "both", note: "The main nap overlap. Older toddler may sleep 1.5–2 hrs, younger 1.5–2.5 hrs." },
      { time: "12:00", activity: "Lunch together", type: "both" },
      { time: "13:00", activity: "Afternoon activity block", type: "both", note: "The younger toddler may need a second short nap around 14:00–14:30." },
      { time: "15:00", activity: "Snack & free play", type: "both" },
      { time: "17:00", activity: "Dinner together", type: "both" },
      { time: "18:00", activity: "Both kids' bedtime routine", type: "both", note: "Bedtime ~30 min apart, or simultaneously if one can settle while the other gets read to." },
    ],
  },
];

export function getSchedule(slug: string): ScheduleMeta | undefined {
  return schedules.find((s) => s.slug === slug);
}

export function getRelatedSchedules(slug: string, count = 2): ScheduleMeta[] {
  return schedules.filter((s) => s.slug !== slug).slice(0, count);
}
