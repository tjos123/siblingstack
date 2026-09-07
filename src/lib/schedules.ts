export interface ScheduleEntry {
  time: string;
  activity: string;
  type: "baby" | "toddler" | "both";
  note?: string;
}

export interface ScheduleSection {
  id: string;
  badge: string;
  title: string;
  lead?: string;
  bullets?: string[];
  paragraphs?: string[];
}

export interface ScheduleFaq {
  question: string;
  answer: string;
}

export interface ScheduleMeta {
  slug: string;
  title: string;
  description: string;
  ageGroup: string;
  timeline: ScheduleEntry[];
  introTitle?: string;
  intro?: string[];
  sections?: ScheduleSection[];
  faq?: ScheduleFaq[];
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
    introTitle: "Why 14–26 months is the \"sweet spot\" pairing",
    intro: [
      "Most sibling nap chaos happens because one kid is still on two naps and the other's down to one — you're stuck stitching together a schedule with almost no overlap. By 14 months, most younger toddlers have consolidated to a single nap (or are close to it), and a 26-month-old is solidly one-nap. That's what makes a shared midday nap realistic here in a way it isn't at, say, 8 months + 22 months. If your kids are further apart in age or your younger one is still on two naps, see the [\"if you're not there yet\" section](#not-synced-yet) below — this exact schedule won't fit yet, but the timing principle still applies once you are.",
    ],
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
    sections: [
      {
        id: "what-throws-it-off",
        badge: "🛠 Troubleshooting",
        title: "What actually throws this schedule off",
        lead: "Real families running this pairing hit the same handful of snags. Worth naming them up front so parents don't think they're doing something wrong:",
        bullets: [
          "**The younger one starts fighting the nap around 14–15 months.** This is a normal, temporary regression, not a sign they're ready to drop the nap. It usually resolves in 1–3 weeks if you hold the timing steady rather than pushing the nap later.",
          "**They wake each other up.** If they're room-sharing, this is the single most common reason parents give up on syncing naps. A sound machine in each room (or one shared, positioned between them) solves this more often than a schedule change does.",
          "**Weekday naps don't match weekend naps.** Daycare or a sitter often runs a tighter, earlier nap than what happens at home. Don't expect the schedule above to hold perfectly on days the routine changes hands — expect a 30–45 minute drift and build it in rather than fighting it.",
          "**One kid naps short, one naps long.** It's normal for the older toddler to nap 90 minutes and the younger one to sleep through to 2.5 hours in the same window. Plan the \"first one up\" contingency (quiet independent play, not immediately ending the second kid's nap) rather than assuming symmetric wake-ups.",
        ],
      },
      {
        id: "not-synced-yet",
        badge: "🧭 Not There Yet",
        title: "If you're not synced yet",
        paragraphs: [
          "If your younger one is still on two naps and your older one's on one, don't force this schedule — it'll fail and everyone will be more tired for it. The move that actually works, based on how most families get there: let the younger toddler keep both naps, but nudge their **morning** nap slightly later each week until it starts overlapping with the older one's afternoon nap window. Once that overlap exists for a few consecutive days, the morning nap usually drops on its own within 1–2 weeks. Trying to force a nap drop before the overlap exists just produces an overtired toddler and a fussier evening.",
        ],
      },
    ],
    faq: [
      {
        question: "What if they won't fall asleep in the same room?",
        answer:
          "Separate rooms for sleep, shared space for everything else, is completely normal and doesn't mean you've failed at \"syncing.\" The sync that matters is the *timing*, not the *location*.",
      },
      {
        question: "How long should I hold this schedule before it \"works\"?",
        answer:
          "Give a new timing 5–7 days before judging it. Toddler sleep drives, especially around nap transitions, take about a week to fully shift.",
      },
      {
        question: "What about the 30 minutes between the older one dropping their nap and starting quiet time?",
        answer:
          "That's normal and doesn't need \"fixing.\" A 3-year-old going nap-free will often still want 20–30 minutes of low-key alone time in their room even after naps stop being reliable — some families keep this built into the schedule long after the toddler stops sleeping through it.",
      },
      {
        question: "Does bedtime really need to be 30 minutes apart?",
        answer:
          "No — simultaneous bedtime works fine if one can settle independently while you read to the other. The 30-minute stagger in the sample routine is there for households where one kid needs full one-on-one wind-down; it's not a requirement.",
      },
    ],
  },
];

export function getSchedule(slug: string): ScheduleMeta | undefined {
  return schedules.find((s) => s.slug === slug);
}

export function getRelatedSchedules(slug: string, count = 2): ScheduleMeta[] {
  return schedules.filter((s) => s.slug !== slug).slice(0, count);
}
