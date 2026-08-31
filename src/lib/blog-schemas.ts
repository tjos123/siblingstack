type Schema = Record<string, unknown> | Record<string, unknown>[];

const schemas: Record<string, Schema> = {
  "double-stroller-close-in-age": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Double Stroller for Kids Close in Age (Who Aren't Twins)",
    description:
      "Most double stroller guides assume twins. If you've got a newborn and a toddler, the stroller has a harder job. Here's what actually matters for your age gap.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/double-stroller-close-in-age",
    },
    keywords:
      "double stroller close in age, best stroller newborn and toddler, double stroller not twins",
    articleSection: "Gear",
  },
  "double-stroller-roundup": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Double Strollers That Work for Two Different-Sized Kids (2026)",
    description:
      "Current top picks for tandem and side-by-side strollers when your two kids are at different developmental stages — not the twin-stroller list.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/double-stroller-roundup",
    },
    keywords:
      "best double stroller 2026, tandem stroller newborn toddler, side by side stroller different ages",
    articleSection: "Gear",
  },
  "newborn-toddler-nap-schedule": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Newborn and Toddler on the Same Nap Schedule: A Realistic Approach",
    description:
      "Perfect sync is unlikely, especially early on. Here's a realistic approach to building enough overlap that you actually get breaks — without fighting either kid's rhythm.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/newborn-toddler-nap-schedule",
    },
    keywords:
      "newborn toddler nap schedule, nap schedule two kids different ages, overlapping naps newborn toddler",
    articleSection: "Schedule",
  },
  "feeding-schedule-two-different-ages": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Managing a Feeding Schedule for Two Babies at Different Ages",
    description:
      "Feeding a newborn and a toddler who are on completely different feeding needs without losing your mind — or your break.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/feeding-schedule-two-different-ages",
    },
    keywords:
      "feeding schedule two babies different ages, newborn toddler feeding routine, two kids feeding schedule",
    articleSection: "Schedule",
  },
  "sibling-jealousy-close-age-gap": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Sibling Jealousy When the Age Gap Is Small",
    description:
      "With a small gap, jealousy often shows up as regression, not aggression. What to expect, and what actually helps.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/sibling-jealousy-close-age-gap",
    },
    keywords:
      "sibling jealousy close age gap, toddler jealousy new baby, regression after new sibling",
    articleSection: "Wellbeing",
  },
  "high-chair-roundup": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "High Chairs That Fit Both Kids — Including a Dual-Seat Model",
    description:
      "The Graco Blossom literally seats two kids at once. Here's the full landscape of high chairs for families with two kids at different stages.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/high-chair-roundup",
    },
    keywords:
      "best high chair two kids, Graco Blossom dual seat, high chair for toddler and baby",
    articleSection: "Gear",
  },
  "car-seat-two-different-sizes": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "A Car Seat That Fits Two Very Differently Sized Kids",
    description:
      "Why a single convertible seat rarely works for both kids — and how to choose two seats that make daily life easier instead of harder.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/car-seat-two-different-sizes",
    },
    keywords:
      "car seat two different sizes, best car seat newborn and toddler, two car seats close in age",
    articleSection: "Gear",
  },
  "convertible-car-seats-2026": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Convertible Car Seats Worth Buying Twice (2026)",
    description:
      "Top-performing convertible car seats for families with two kids close in age — the Maxi-Cosi Pria, Chicco Fit360, Britax Poplar, and Graco SlimFit3 LX compared.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/convertible-car-seats-2026",
    },
    keywords:
      "best convertible car seat 2026, Maxi-Cosi Pria vs Chicco Fit360, car seats for two kids close in age",
    articleSection: "Gear",
  },
  "baby-carriers-2026": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Baby Carriers That Actually Span Newborn to Toddler (2026)",
    description:
      "Carriers that don't need a separate infant insert — the Ergobaby Embrace, Omni 360, Baby Tula Free-to-Grow, Infantino Flip, and Contours Journey compared for two-kid families.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/baby-carriers-2026",
    },
    keywords:
      "best baby carrier 2026, baby carrier newborn to toddler, Ergobaby vs Baby Tula comparison",
    articleSection: "Gear",
  },
  "baby-gear-dont-buy-twice": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Baby Gear You Don't Need to Buy Twice (Even With Two Kids Close in Age)",
    description:
      "Not every baby item needs a duplicate just because you have two kids close in age. Here's what you genuinely need two of, what you can stagger, and where people overspend.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/baby-gear-dont-buy-twice",
    },
    keywords:
      "baby gear two kids close in age, what baby gear to buy twice, saving money second baby",
    articleSection: "Gear",
  },
  "hand-me-down-sizing-cheat-sheet": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Fits Both Kids: A Sizing and Hand-Me-Down Cheat Sheet",
    description:
      "When two kids are close in age, hand-me-downs sometimes work and sometimes cost you more in frustration than they save in money. Here's a practical breakdown by category.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/hand-me-down-sizing-cheat-sheet",
    },
    keywords:
      "hand me down sizing cheat sheet, baby clothes close in age, what to hand down to second baby",
    articleSection: "Gear",
  },
  "two-kids-in-diapers-realistic-budget": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Two Kids in Diapers at Once: A Realistic Budget",
    description:
      "Newborn plus toddler means 12–18 diaper changes a day. Here's the actual budget math, where the real savings are, and what doesn't actually save money.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/two-kids-in-diapers-realistic-budget",
    },
    keywords:
      "two kids in diapers budget, diaper cost two children, saving money on diapers two kids",
    articleSection: "Budget",
  },
  "crib-and-bassinet-setup-two-babies-one-room": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Crib and Bassinet Setup for Two Babies in One Room",
    description:
      "Room-sharing toddlers and newborns can genuinely interfere with each other's sleep. Here's a layout and transition plan that works — starting with safe sleep non-negotiables.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/crib-and-bassinet-setup-two-babies-one-room",
    },
    keywords:
      "crib and bassinet same room, two babies one room setup, newborn toddler shared room sleep",
    articleSection: "Schedule",
  },
  "one-on-one-time-each-kid-close-in-age": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Getting One-on-One Time With Each Kid When They're Close in Age",
    description:
      "With a small age gap, one-on-one time doesn't happen naturally — it has to be built deliberately. What actually works in practice, and what to let go of.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/one-on-one-time-each-kid-close-in-age",
    },
    keywords:
      "one on one time two kids close in age, individual attention siblings, solo time with each child",
    articleSection: "Wellbeing",
  },
  "milestones-10-month-age-gap": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Milestones Actually Look Like With a 10-Month Age Gap",
    description:
      "A 10-month gap makes milestones feel like they're constantly resizing — huge at first, then briefly small, then big again. Here's what that timeline actually looks like.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/milestones-10-month-age-gap",
    },
    keywords:
      "milestones 10 month age gap, baby toddler developmental milestones, comparing sibling milestones",
    articleSection: "Wellbeing",
  },
  "hand-me-down-clothes-timeline-close-in-age": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "The Hand-Me-Down Clothes Timeline When Siblings Are Close in Age",
    description:
      "With a small age gap, the standard box-it-and-forget-it approach to hand-me-down clothes doesn't work. Here's a system that does.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/hand-me-down-clothes-timeline-close-in-age",
    },
    keywords:
      "hand me down clothes close in age, toddler baby hand me down system, organizing baby clothes two kids",
    articleSection: "Gear",
  },
  "daycare-cost-two-kids-under-two": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Daycare Cost for Two Kids Under Two: A Realistic Picture",
    description:
      "Two kids in daycare simultaneously is one of the few areas where the math genuinely is closer to double. Here's where the real savings are — and where they aren't.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/daycare-cost-two-kids-under-two",
    },
    keywords:
      "daycare cost two kids under two, sibling daycare discount, child care tax credit two children",
    articleSection: "Budget",
  },
  "nursing-while-pregnant-second-baby": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "When Your Second Baby Is Coming Before You've Weaned the First",
    description:
      "Pregnant while still nursing? Continuing, weaning, or letting it resolve are all reasonable paths — here's what medically and practically matters, and what's genuinely your call.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/nursing-while-pregnant-second-baby",
    },
    keywords:
      "nursing while pregnant, breastfeeding and second pregnancy, weaning before new baby, tandem nursing, breastfeed toddler while pregnant",
    articleSection: "Wellbeing",
  },
  "postpartum-recovery-pregnant-again": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Postpartum Recovery When You're Pregnant Again Right Away",
    description:
      "Being pregnant again before you've recovered from the last pregnancy is a specific, isolating experience. What's different physically and emotionally — and where to get answers specific to you.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/postpartum-recovery-pregnant-again",
    },
    keywords:
      "postpartum recovery pregnant again, short interval pregnancy, back to back pregnancy recovery, interpregnancy interval, postpartum second pregnancy",
    articleSection: "Wellbeing",
  },
  "solo-bedtime-2-under-2-alone": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Manage Bedtime for 2 Under 2 Alone When Your Partner Works Late",
    description:
      "Solo bedtime with two kids under two doesn't have to be chaos. A realistic, step-by-step system for handling toddler + baby bedtime alone, night after night.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/solo-bedtime-2-under-2-alone",
    },
    keywords:
      "bedtime 2 under 2 alone, solo parenting bedtime routine, toddler and baby bedtime alone, single parent bedtime two kids",
    articleSection: "Wellbeing",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long does it take for a 2-under-2 bedtime routine to feel automatic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most families see the routine start to run itself after 2 to 3 weeks of doing the same order every night, even with interruptions.",
          },
        },
        {
          "@type": "Question",
          name: "Should the toddler or the baby go to bed first?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Whichever child has the less flexible sleep window usually goes down first, often the baby. Adjust based on your own kids' patterns rather than a fixed rule.",
          },
        },
        {
          "@type": "Question",
          name: "What if my toddler regresses at bedtime after the baby arrives?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This is extremely common and usually temporary. Extra one-on-one time earlier in the evening, even 10 minutes, often reduces bedtime resistance more than changes made at bedtime itself.",
          },
        },
      ],
    },
  },
  "toddler-one-nap-transition-newborn": [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How to Transition a Toddler to 1 Nap When You Have a Newborn",
      description:
        "Dropping to one nap is hard enough on its own. Doing it while a newborn is home adds a layer of chaos. A realistic, gradual plan to get through it.",
      author: {
        "@type": "Person",
        name: "James Reilly",
        description: "Father of Irish twins",
      },
      publisher: {
        "@type": "Organization",
        name: "Sibling Stack",
        url: "https://www.siblingstack.com",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://www.siblingstack.com/blog/toddler-one-nap-transition-newborn",
      },
      datePublished: "2026-08-15",
      dateModified: "2026-08-15",
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can a newborn's unpredictable schedule permanently delay the one-nap transition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No — it can slow the process by a couple of weeks, but toddlers will still transition on roughly their own biological timeline regardless of what else is happening in the house.",
          },
        },
        {
          "@type": "Question",
          name: "Is it normal for the one nap to be too short at first (under an hour)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, this is common in the first 1–2 weeks. It usually lengthens to 1.5–3 hours as the toddler's body adjusts to consolidating sleep into one window.",
          },
        },
        {
          "@type": "Question",
          name: "Should I keep the morning nap on weekends or with grandparents to make things easier?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It's best to keep the schedule consistent across all days during the transition weeks — inconsistent napping (one nap on weekdays, two on weekends) tends to extend how long the transition takes.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.siblingstack.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://www.siblingstack.com/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "How to Transition a Toddler to 1 Nap When You Have a Newborn",
          item: "https://www.siblingstack.com/blog/toddler-one-nap-transition-newborn",
        },
      ],
    },
  ],
  "stop-toddler-waking-sleeping-baby": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Stop a Toddler From Waking a Sleeping Baby",
    description:
      "Toddler stomping into the nursery mid-nap? Here's why it happens and a practical set of household rules, room setups, and scripts that actually reduce it.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/stop-toddler-waking-sleeping-baby",
    },
    keywords:
      "toddler waking sleeping baby, toddler wakes up baby from nap, stop toddler from waking newborn, siblings sharing a room baby waking toddler",
    articleSection: "Wellbeing",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is it normal for a toddler to keep doing this even after weeks of the same routine?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Many toddlers test this repeatedly, especially during phases of increased attention-seeking. Consistency in the response matters more than how many times it takes.",
          },
        },
        {
          "@type": "Question",
          name: "Should I lock the nursery door?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A gate at the doorway is usually a better middle ground than a locked door, since it prevents entry without removing the toddler's ability to see in.",
          },
        },
        {
          "@type": "Question",
          name: "Does a shared bedroom make this worse?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It can increase the risk of accidental waking, but many families successfully share a room by staggering naps and using white noise.",
          },
        },
      ],
    },
  },
  "tandem-vs-side-by-side-stroller-2-under-2": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "2 Under 2 Stroller Setup: Tandem vs Side-by-Side for Naps on the Go",
    description:
      "Choosing between a tandem and side-by-side double stroller for two under two? Here's how each affects on-the-go naps, storage, doorways, and daily logistics.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/tandem-vs-side-by-side-stroller-2-under-2",
    },
    keywords:
      "tandem vs side by side stroller 2 under 2, best double stroller for naps on the go, tandem stroller for toddler and infant, side by side stroller newborn toddler",
    articleSection: "Gear",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is a tandem stroller harder to push than a side-by-side?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Not usually. Most tandems are narrower and considered easier to steer one-handed, though they can feel longer and slightly harder to turn in very tight spaces.",
          },
        },
        {
          "@type": "Question",
          name: "Can a newborn nap well in a side-by-side stroller?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, especially with a bassinet attachment or a fully reclining seat, but sitting directly next to an active toddler seat is the main risk factor for disrupted naps.",
          },
        },
        {
          "@type": "Question",
          name: "Which is better for uneven sidewalks or trail walking?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Side-by-side strollers tend to have more even, predictable weight distribution for uneven terrain, though it varies by wheel size and suspension.",
          },
        },
      ],
    },
  },
  "feeding-newborn-entertaining-toddler-activities": {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Feeding a Newborn While Entertaining a Toddler: 10 Low-Prep Activities",
    description:
      "Stuck on the couch feeding a newborn with a toddler needing entertainment? These 10 low-prep activities keep toddlers busy for 15-30 minutes, hands-free.",
    author: { "@type": "Person", name: "James T. Reilly" },
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/blog/feeding-newborn-entertaining-toddler-activities",
    },
    keywords:
      "activities to entertain toddler while feeding newborn, keep toddler busy while nursing, low prep toddler activities newborn, one handed parenting activities toddler",
    articleSection: "Wellbeing",
    about: {
      "@type": "ItemList",
      name: "Low-prep activities to entertain a toddler while feeding a newborn",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "The Feeding Basket" },
        { "@type": "ListItem", position: 2, name: "Sticker Sheets on a Clipboard" },
        { "@type": "ListItem", position: 3, name: "Water Painting on the Patio or Bath Tile" },
        { "@type": "ListItem", position: 4, name: "Muffin Tin Sorting Game" },
        { "@type": "ListItem", position: 5, name: "Painter's Tape Roads" },
        { "@type": "ListItem", position: 6, name: "A Short Intentional Screen Show" },
        { "@type": "ListItem", position: 7, name: "Busy Bag: Envelope Stuffing" },
        { "@type": "ListItem", position: 8, name: "Feed the Animals Sorting Bin" },
        { "@type": "ListItem", position: 9, name: "Bubble Wrap Stomping" },
        { "@type": "ListItem", position: 10, name: "Read-to-the-Baby Job" },
      ],
    },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What if my toddler still interrupts constantly no matter what activity I offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Try setting up the activity a minute or two before starting the feed, so the toddler is already engaged when your hands become unavailable.",
          },
        },
        {
          "@type": "Question",
          name: "Is it bad to use the same activity every single feeding?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It's not harmful, but most toddlers lose interest in a repeated activity within a few days, so rotating two to three options tends to hold attention longer.",
          },
        },
        {
          "@type": "Question",
          name: "How do I handle a toddler who's too young for most of these activities?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For a toddler under 12 months, playpens, high chairs with snacks, or a few minutes of supervised floor time near you tend to work better than independent activity-based options.",
          },
        },
      ],
    },
  },
};

export function getBlogSchema(slug: string): Schema | null {
  return schemas[slug] ?? null;
}
