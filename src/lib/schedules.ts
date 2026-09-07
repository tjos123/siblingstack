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
  notes?: string[];
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
  {
    slug: "dueling-naps",
    title: "Dueling Naps: Baby on 2, Toddler on 1",
    description:
      "When one kid naps twice a day and the other naps once, full overlap isn't realistic yet — but a partial-overlap schedule still buys you real downtime.",
    ageGroup: "Baby 9–10 mo (2 naps) + Toddler 2.5–3 yr (1 nap)",
    timeline: [
      { time: "6:30–7:00", activity: "Both wake up", type: "both" },
      { time: "7:00", activity: "Breakfast together", type: "both" },
      { time: "8:30", activity: "Baby's first (short) nap — 45–60 min", type: "baby" },
      { time: "8:30–9:30", activity: "One-on-one toddler time / errands", type: "toddler" },
      { time: "9:30", activity: "Baby up, feed", type: "baby" },
      { time: "10:00", activity: "Morning activity together", type: "both" },
      { time: "12:00", activity: "Lunch together", type: "both" },
      { time: "12:45", activity: "Toddler down for their one nap", type: "toddler" },
      { time: "13:00", activity: "Baby's second nap — this is the overlap window", type: "baby" },
      { time: "14:30–15:00", activity: "Toddler usually up first — quiet independent play while baby finishes", type: "toddler" },
      { time: "15:00", activity: "Baby up", type: "baby" },
      { time: "15:30", activity: "Snack, together", type: "both" },
      { time: "17:30", activity: "Dinner", type: "both" },
      { time: "18:30", activity: "Toddler bedtime routine starts", type: "toddler" },
      { time: "19:00", activity: "Baby's bedtime routine (may run earlier depending on last nap length)", type: "baby" },
    ],
    notes: [
      "The real overlap here is one window, not the whole day — roughly 13:00–14:30. That's the design goal at this stage, not a full-day sync.",
    ],
    sections: [
      {
        id: "right-goal",
        badge: "🎯 Mindset",
        title: "Why full sync isn't the right goal yet",
        paragraphs: [
          "When one child naps twice and the other naps once, the honest target is **one solid overlapping window**, not matching every nap. Trying to force a baby down to one nap before they're developmentally ready to fill the resulting longer wake window backfires — you get an overtired baby and a rougher evening for the whole house, not more free time. The fix that comes up again and again from families in this exact stage: shift the baby's morning nap slightly later each week so it starts brushing up against the toddler's one-nap window, rather than trying to cut a nap outright.",
        ],
      },
      {
        id: "first-nap-while-awake",
        badge: "🛠 Plan",
        title: "What to do with the baby's first nap while the toddler's awake",
        paragraphs: [
          "This is the block nobody plans for — baby's morning nap, toddler wide awake with nothing structured happening. Options that actually work: run errands during it (baby naps in the car seat/stroller), or treat it as protected one-on-one toddler time rather than \"downtime\" — you won't get toddler-free time in this window anyway, so use it deliberately instead of trying to also get things done.",
        ],
      },
      {
        id: "ready-to-consolidate",
        badge: "🚦 Watch For",
        title: "Signs the baby's ready to consolidate to one nap (so you can retire this schedule)",
        bullets: [
          "**Morning nap consistently gets shorter or gets refused**, while the afternoon nap stays strong.",
          "**Baby starts fighting the transition *into* the morning nap** even when clearly tired.",
          "**The overlap window keeps drifting later on its own**, closer to the toddler's nap time.",
        ],
        paragraphs: [
          "Don't force the drop before these show up — pushing early usually means several rough weeks of overtiredness rather than a clean transition.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I wake the baby from their morning nap to protect the afternoon one?",
        answer:
          "Generally no if the morning nap is still short (under an hour) — it's not usually stealing much from the afternoon nap at this age. If the morning nap starts running long and eating into the afternoon window, that's usually the first sign it's ready to go.",
      },
      {
        question: "What if the toddler's one nap is inconsistent day to day?",
        answer:
          "That's normal in the 2.5–3 year range — plan the overlap window loosely (a 30-minute range) rather than a fixed clock time, and treat any day it lines up as a win rather than the baseline you expect every day.",
      },
      {
        question: "Is there any point trying to sync bedtime if naps don't overlap?",
        answer:
          "Yes — bedtime is usually easier to align than naps at this stage, since it's driven more by the clock and less by nap-dependent wake windows. Don't skip trying to sync bedtime just because naps aren't cooperating.",
      },
    ],
  },
  {
    slug: "newborn-toddler-sync",
    title: "Newborn + Toddler Synced",
    description:
      "In the first weeks with a newborn and a toddler, don't aim for a shared schedule — aim for the toddler's routine staying steady while the newborn slots around it.",
    ageGroup: "Newborn 6–10 weeks + Toddler 20–24 Months",
    timeline: [
      { time: "6:30–7:00", activity: "Toddler wakes; newborn usually still down or feeding", type: "toddler" },
      { time: "7:00", activity: "Breakfast — toddler at the table, newborn worn or in bouncer nearby", type: "both" },
      { time: "8:00", activity: "Newborn's first nap of the day (short — 45–75 min)", type: "baby" },
      { time: "8:00–9:15", activity: "One-on-one toddler time while newborn naps", type: "toddler" },
      { time: "9:15", activity: "Newborn wakes + feed", type: "baby" },
      { time: "9:30–11:00", activity: "Out of the house (stroller walk, library, yard) — newborn naps on the go", type: "both" },
      { time: "12:00", activity: "Lunch together", type: "both" },
      { time: "12:45", activity: "Toddler's nap", type: "toddler" },
      { time: "13:00", activity: "Newborn's longer nap (this is your window — it usually lands close to the toddler's)", type: "baby" },
      { time: "15:30", activity: "Both up, snack", type: "both" },
      { time: "17:30", activity: "Bath — newborn first, toddler while newborn is worn/held by a second caregiver if possible", type: "both" },
      { time: "18:30", activity: "Toddler bedtime routine", type: "toddler" },
      { time: "19:00", activity: "Newborn's bedtime-adjacent wind-down (no fixed bedtime yet at this age)", type: "baby" },
    ],
    notes: [
      "Note the framing difference from the toddler–toddler pages: at this age gap you're not syncing two schedules — you're protecting the toddler's routine and letting the newborn's schedule flex around it. That's a deliberate, correct choice, not a fallback.",
    ],
    sections: [
      {
        id: "dont-schedule-newborn-yet",
        badge: "🎯 Mindset",
        title: "Why you shouldn't try to \"schedule\" the newborn yet",
        paragraphs: [
          "At 6–10 weeks, a newborn's sleep is driven by wake windows, not clock time — trying to lock them to specific nap slots to match a toddler's routine usually backfires into overtiredness and worse sleep for everyone. The workable version of \"syncing\" at this age isn't matching nap times — it's protecting the toddler's existing routine (same wake time, same nap window, same bedtime) and treating the newborn as portable around it. Most families who get through this stage well say the same thing in different words: the toddler's routine is the fixed point, the newborn moves.",
        ],
      },
      {
        id: "first-weeks-hard",
        badge: "🛠 Plan",
        title: "What makes the first few weeks specifically hard — and what actually helps",
        bullets: [
          "**Mornings are the hardest block of the day.** Prep the night before: toddler's clothes and diaper laid out, breakfast options that don't need real prep, everything within toddler's own reach if they're capable of self-serving.",
          "**A newborn who naps on the go is worth prioritizing early.** Get comfortable feeding and settling the newborn in a carrier or stroller in the first couple of weeks — it's the single biggest unlock for keeping the toddler's routine (library, park, walks) unchanged.",
          "**Bath time is a known pinch point**, especially solo-parenting stretches. Sequencing one after the other, or having the second child held/worn by another caregiver during the first one's bath, is the common workaround.",
          "**Floor-level feeding.** Nursing or bottle-feeding at toddler eye-level (on the floor, not a chair across the room) keeps you reachable and reading-book-adjacent during long feeds, which matters more than it sounds.",
          "**The toddler doesn't need a new schedule. They need their old one protected.** This is the thing that gets missed — parents often try to build something new for \"two kids now\" when the real win is minimizing how much changes for the older one.",
        ],
      },
    ],
    faq: [
      {
        question: "When can I actually start syncing their nap times, not just the toddler's routine?",
        answer:
          "Once the newborn's daytime naps start consolidating into more predictable windows — usually somewhere in the 3–4 month range — you can start nudging toward overlap. Before that, treat any nap alignment as lucky, not planned.",
      },
      {
        question: "What if my toddler's nap window and the newborn's only overlap is barely 20 minutes?",
        answer:
          "Take it. A 20-minute overlap where both kids are asleep is still a real, if short, block — don't discount it because it's shorter than the \"ideal\" version on a schedule page.",
      },
      {
        question: "Is it normal to feel like there's no schedule at all for the first month?",
        answer:
          "Yes. Newborn sleep before 6–8 weeks is genuinely not on a schedule yet, no matter how carefully you plan. The realistic goal in month one isn't a synced routine — it's keeping the toddler's day recognizable.",
      },
    ],
  },
  {
    slug: "quiet-time-sync",
    title: "One Drops the Nap, One Still Naps",
    description:
      "Once the older one starts fighting or skipping naps, the goal shifts from \"same nap\" to quiet time that runs alongside the younger one's real nap.",
    ageGroup: "Preschooler 3–3.5 yr (dropping nap) + Toddler 18–22 mo (1 nap)",
    timeline: [
      { time: "7:00", activity: "Both wake up", type: "both" },
      { time: "7:30", activity: "Breakfast together", type: "both" },
      { time: "9:00", activity: "Morning activity / outing", type: "both" },
      { time: "12:00", activity: "Lunch together", type: "both" },
      { time: "12:45", activity: "Toddler down for their nap", type: "toddler" },
      { time: "13:00", activity: "Preschooler's quiet time begins (own room or designated quiet space)", type: "both" },
      { time: "13:00–14:30", activity: "Quiet time: audiobook, books, calm solo play — no nap expected", type: "both" },
      { time: "14:30", activity: "Toddler usually wakes first", type: "toddler" },
      { time: "14:30–15:00", activity: "Toddler has independent play/snack while preschooler's quiet time finishes", type: "toddler" },
      { time: "15:00", activity: "Quiet time ends, both together", type: "both" },
      { time: "17:30", activity: "Dinner", type: "both" },
      { time: "18:00", activity: "Early-ish bedtime routine — preschoolers on quiet time (no nap) usually need bedtime 30–45 min earlier than when they were still napping", type: "both" },
    ],
    sections: [
      {
        id: "quiet-time-goal",
        badge: "🎯 Mindset",
        title: "Why \"quiet time\" is the actual goal, not \"no nap\"",
        paragraphs: [
          "Most 3-year-olds who stop reliably sleeping at nap time still need the downtime — a 2015 sleep study found that kids who dropped their last nap tended to sleep better and longer at night once quiet time replaced it properly. The transition period is messy though: many preschoolers nap some days and not others for months before fully dropping it. Plan for inconsistency rather than a hard cutover date.",
        ],
      },
      {
        id: "wake-each-other",
        badge: "🛠 Plan",
        title: "The actual problem: they wake each other up",
        lead: "This is the specific gap in existing advice. If the preschooler is in a shared or adjacent room during quiet time, noise bleeding into the toddler's real nap is the single most common complaint. What works:",
        bullets: [
          "**Separate rooms for this window specifically**, even if they share a room at night — quiet time doesn't need to happen where the toddler sleeps.",
          "**A designated \"quiet time spot\"** outside the bedroom — a reading nook, a nest of pillows in a low-traffic room — so the preschooler has a consistent space that isn't the toddler's nap room.",
          "**Audio, not video**, for most of the window — audiobooks or calm music keep a nap-resistant preschooler still occupied without the stimulation (and volume creep) of a screen.",
          "**A visual timer or clock** the preschooler can check themselves, so quiet time has a clear end they can see coming rather than feeling open-ended.",
        ],
      },
      {
        id: "how-long",
        badge: "⏱ Duration",
        title: "How long should quiet time actually run?",
        paragraphs: [
          "Match it to the toddler's nap length, since that's the real constraint — most families land on 60–90 minutes. Start shorter (15–20 minutes) if the preschooler is brand new to skipping naps, and extend gradually; jumping straight to a 90-minute expectation on day one usually fails.",
        ],
      },
    ],
    faq: [
      {
        question: "What if my preschooler still falls asleep some days during quiet time?",
        answer:
          "Good — let them. Occasional naps are normal well into age 4, and quiet time isn't meant to prevent sleep, just not require it.",
      },
      {
        question: "Do I need to move bedtime earlier once the nap drops?",
        answer:
          "Usually yes, by 30–45 minutes, since the day now has one less rest block in it. Watch for late bedtime resistance or early-morning waking as the signal you haven't moved it early enough yet.",
      },
      {
        question: "What if the preschooler refuses to stay in the quiet-time space at all?",
        answer:
          "Some families use a calm show as a bridge during the first couple of weeks of the transition — not ideal long-term, but a workable stopgap while a preschooler adjusts to the idea of alone-time before quiet time without a screen sticks.",
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
