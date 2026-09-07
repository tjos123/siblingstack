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

export interface ScheduleStage {
  id: string;
  title: string;
  intro?: string[];
  timelineLabel?: string;
  timeline: ScheduleEntry[];
  notes?: string[];
  sections?: ScheduleSection[];
}

export interface ScheduleLink {
  label: string;
  href: string;
}

export interface ScheduleMeta {
  slug: string;
  title: string;
  description: string;
  ageGroup: string;
  timeline?: ScheduleEntry[];
  introTitle?: string;
  intro?: string[];
  notes?: string[];
  sections?: ScheduleSection[];
  faq?: ScheduleFaq[];
  stages?: ScheduleStage[];
  related?: ScheduleLink[];
  tools?: ScheduleLink[];
  next?: {
    title: string;
    lead?: string;
    items: { label: string; href: string }[];
  };
}

export const schedules: ScheduleMeta[] = [
  {
    slug: "2-under-2-schedule",
    title: "2 Under 2 Schedule: Newborn + Toddler Daily Routine",
    description:
      "2 under 2 isn't one schedule — it's at least two, split by nap count. The harder two-nap version (~15–20 months) and the more predictable one-nap version (~20 months–2.5 years), on one page.",
    ageGroup: "Newborn + Toddler (Two Naps or One)",
    intro: [
      `"2 under 2" isn't one schedule — it's at least two, and which one you need depends on a single question: is your toddler still napping twice a day, or down to one? That's the fork in the road that changes almost everything else about your day, so instead of picking an arbitrary age and hoping it's close enough, this page splits by nap count. Jump straight to the version that matches your toddler: [toddler still on 2 naps](#toddler-two-naps) (usually ~15–20 months — the harder overlap problem) or [toddler down to 1 nap](#toddler-one-nap) (usually ~20 months–2.5 years — more predictable overlap).`,
    ],
    stages: [
      {
        id: "toddler-two-naps",
        title: "Newborn + Toddler on Two Naps (~15–20 months)",
        intro: [
          "This is the trickier version of the pairing. Your toddler hasn't consolidated to one nap yet, so you're managing two separate toddler nap windows and a newborn's still-unpredictable sleep, all in the same day. The overlap windows below are wins, not a baseline to expect every day — a newborn's nap timing before about 8–10 weeks isn't reliably schedulable, so treat this shape as a target, not a guarantee.",
        ],
        timelineLabel: "Sample routine — toddler on 2 naps",
        timeline: [
          { time: "6:30–7:00", activity: "Both wake up", type: "both" },
          { time: "7:00", activity: "Breakfast together", type: "both" },
          { time: "8:30", activity: "Newborn's first nap (short, 45–75 min)", type: "baby" },
          { time: "9:00", activity: "Toddler's first nap begins — overlap window #1", type: "toddler" },
          { time: "9:45", activity: "Newborn up, feed", type: "baby" },
          { time: "10:30", activity: "Toddler up, snack + activity", type: "both" },
          { time: "12:00", activity: "Lunch together", type: "both" },
          { time: "13:00", activity: "Toddler's second nap begins", type: "toddler" },
          { time: "13:15", activity: "Newborn's longer nap — overlap window #2", type: "baby" },
          { time: "14:45", activity: "Toddler usually up first — quiet independent play", type: "toddler" },
          { time: "15:15", activity: "Newborn up", type: "baby" },
          { time: "15:30", activity: "Snack, together", type: "both" },
          { time: "17:30", activity: "Dinner", type: "both" },
          { time: "18:15", activity: "Toddler bedtime routine starts", type: "toddler" },
          { time: "19:00", activity: "Newborn's bedtime-adjacent wind-down (no fixed bedtime yet)", type: "baby" },
        ],
        sections: [
          {
            id: "two-naps-why-harder",
            badge: "🎯 Recalibrate",
            title: "Why this pairing feels harder than others",
            paragraphs: [
              "A toddler still on two naps has two separate transition windows a day where they need quiet, low-stimulation settling — and a newborn's nap timing at this age is driven by wake windows, not the clock, so it rarely lines up with either one on purpose. Two small overlap windows in the table above is the realistic goal, not a fully synced day.",
            ],
          },
          {
            id: "two-naps-overlap-missed",
            badge: "🛠 Plan",
            title: "What to do when the overlap doesn't happen",
            lead: "Some days the newborn's morning nap and the toddler's first nap simply won't land together. When that happens:",
            bullets: [
              "**Feed the newborn during the toddler's morning nap** rather than trying to force a shared nap window — a calm feed while the toddler sleeps is still restorative, even without a second sleeping child.",
              "**Babywear through toddler transitions** (getting them down, story time) so the newborn can contact-nap through the process instead of needing a separate settle.",
              "**Don't chase a missed overlap by shifting the whole day** — let it reset at the next nap rather than dragging both kids' schedules later trying to recapture it.",
            ],
          },
          {
            id: "two-naps-resistance",
            badge: "👀 Watch For",
            title: "The nap-resistance wrinkle around 17–19 months",
            paragraphs: [
              "Many toddlers start pushing back on that second nap right around this age, which can make the pairing even less predictable for a few weeks. If your toddler starts consistently fighting or skipping the second nap, that's usually the early sign of the one-nap transition starting — not something to fix, just something to watch for. When it happens, jump down to the [one-nap version below](#toddler-one-nap).",
            ],
          },
        ],
      },
      {
        id: "toddler-one-nap",
        title: "Newborn + Toddler on One Nap (~20 months–2.5 years)",
        intro: [
          "Once your toddler's consolidated to one nap, this pairing gets a real, fairly predictable daily overlap window — something the two-nap version doesn't reliably have. The challenges here shift: less about finding overlap, more about managing an active, opinionated toddler around a newborn's less predictable schedule.",
        ],
        timelineLabel: "Sample routine — toddler on 1 nap",
        timeline: [
          { time: "7:00", activity: "Both wake up", type: "both" },
          { time: "7:30", activity: "Breakfast together", type: "both" },
          { time: "8:15", activity: "Newborn's first nap", type: "baby" },
          { time: "9:00", activity: "Morning activity / outing (newborn naps on the go)", type: "both" },
          { time: "12:00", activity: "Lunch together", type: "both" },
          { time: "12:45", activity: "Toddler's one nap begins", type: "toddler" },
          { time: "13:00", activity: "Newborn's longer nap — the reliable overlap window", type: "baby" },
          { time: "14:30", activity: "Toddler usually up first — independent play/snack", type: "toddler" },
          { time: "15:00", activity: "Newborn up, both together", type: "both" },
          { time: "17:30", activity: "Dinner", type: "both" },
          { time: "18:30", activity: "Toddler bedtime routine", type: "toddler" },
          { time: "19:00", activity: "Newborn's bedtime-adjacent wind-down", type: "baby" },
        ],
        sections: [
          {
            id: "one-nap-independence",
            badge: "🎯 Recalibrate",
            title: "The real challenge here isn't naps — it's independence",
            paragraphs: [
              "A toddler this age is mobile, verbal, and increasingly opinionated. The newborn's nap windows still matter, but more of the day now goes to keeping the toddler safely and happily occupied during them — independent play skills matter more here than nap-timing precision.",
            ],
          },
          {
            id: "one-nap-build-play",
            badge: "🛠 Plan",
            title: "Building independent play before you need it",
            paragraphs: [
              "If you're reading this while still pregnant or in the newborn's first few weeks, the highest-leverage thing you can do isn't schedule-related: spend time before the newborn arrives building your toddler's tolerance for independent play in short stretches. A toddler who can occupy themselves for 15–20 minutes solo makes the newborn's first nap dramatically easier to protect.",
            ],
          },
          {
            id: "one-nap-post-nap",
            badge: "👀 Watch For",
            title: "Handling the toddler's post-nap window before the newborn's",
            paragraphs: [
              "Toddlers on one nap often wake up before the newborn during the shared window. Have a low-effort, low-supervision activity ready for that gap — a sensory bin, water play, a favorite show — rather than ending the newborn's nap early or hovering.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "How long does the hardest stretch usually last?",
        answer:
          "Most families report the biggest jump in ease once the newborn's naps consolidate into 2–3 predictable ones — commonly 3–4 months — and again once the toddler drops to one nap, if they haven't already.",
      },
      {
        question: "Is it normal to have zero real overlap some days?",
        answer:
          "Yes, especially before 8–10 weeks. A newborn's nap timing isn't reliably schedulable yet at that stage — that's expected, not a sign you're doing something wrong.",
      },
      {
        question: "Should I push my toddler toward one nap sooner to make this easier?",
        answer:
          "Not on the newborn's account — pushing the transition early because a second child arrived tends to backfire into an overtired toddler. Let it happen on the toddler's own timeline; the schedule gets easier either way once it does.",
      },
      {
        question: "What if the newborn wakes up right as I'm settling the toddler for a nap?",
        answer:
          "One of the most common friction points at this pairing. If you can, hand the newborn off for a few minutes during the toddler's settle. If you're solo, babywearing the newborn through the toddler's wind-down routine usually works better than fully settling the newborn first.",
      },
    ],
    related: [
      { label: "Two toddlers synced (once both are on one nap)", href: "/schedules/two-toddlers-sync" },
    ],
    tools: [
      { label: "Nap Sync Calculator", href: "/tools/nap-sync-calculator" },
      { label: "Wake Window / Age-gap Calculator", href: "/tools/wake-window-calculator" },
    ],
    next: {
      title: "What comes next",
      lead: "Once your newborn hits around 3 months, wake windows change — see the nap-by-nap breakdown for that stage. Once the baby consolidates to two naps around 9 months, the overlap problem shifts again.",
      items: [
        { label: "3-month-old and toddler nap schedule (what changes at ~3 months)", href: "/schedules/3-month-old-and-toddler-nap-schedule" },
        { label: "Dueling naps: baby on 2 naps, toddler on 1", href: "/schedules/dueling-naps" },
      ],
    },
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
    related: [
      { label: "Quiet time: when the older one drops the nap", href: "/schedules/quiet-time-sync" },
      { label: "2 Under 2: newborn + toddler", href: "/schedules/2-under-2-schedule" },
    ],
    tools: [
      { label: "Nap Sync Calculator", href: "/tools/nap-sync-calculator" },
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
    related: [
      { label: "3-month-old + toddler nap schedule (the stage before this)", href: "/schedules/3-month-old-and-toddler-nap-schedule" },
      { label: "Quiet time: one drops the nap, one still naps", href: "/schedules/quiet-time-sync" },
    ],
    tools: [
      { label: "Nap Sync Calculator", href: "/tools/nap-sync-calculator" },
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
    related: [
      { label: "Dueling naps: baby on 2, toddler on 1", href: "/schedules/dueling-naps" },
      { label: "Two toddlers synced", href: "/schedules/two-toddlers-sync" },
    ],
    tools: [
      { label: "Nap Sync Calculator", href: "/tools/nap-sync-calculator" },
      { label: "Bedtime Stagger Calculator", href: "/tools/bedtime-stagger-calculator" },
    ],
  },
];

export function getSchedule(slug: string): ScheduleMeta | undefined {
  return schedules.find((s) => s.slug === slug);
}

export function getRelatedSchedules(slug: string, count = 2): ScheduleMeta[] {
  return schedules.filter((s) => s.slug !== slug).slice(0, count);
}
