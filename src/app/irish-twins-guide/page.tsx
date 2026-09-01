import Link from "next/link";

export const metadata = {
  title: "Irish Twins: The Complete Guide to Raising Kids Close in Age",
  description:
    "What Irish twins actually means, where the term came from, the real challenges and the real upside — plus every SiblingStack guide, schedule, and tool organized by topic, in one place.",
  alternates: { canonical: "https://www.siblingstack.com/irish-twins-guide" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Irish Twins: The Complete Guide to Raising Kids Close in Age",
    description:
      "What Irish twins actually means, where the term came from, the real challenges and the real upside — plus every SiblingStack guide, schedule, and tool organized by topic, in one place.",
    author: {
      "@type": "Person",
      name: "James Reilly",
      description: "Father of Irish twins",
    },
    publisher: {
      "@type": "Organization",
      name: "SiblingStack",
      url: "https://www.siblingstack.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.siblingstack.com/irish-twins-guide",
    },
    datePublished: "2026-08-31",
    dateModified: "2026-08-31",
    inLanguage: "en-US",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are Irish twins actually twins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No — they're two separate pregnancies, just close enough together that both kids spend part of childhood at overlapping ages and stages.",
        },
      },
      {
        "@type": "Question",
        name: "How far apart do kids have to be to count as Irish twins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under twelve months apart, by the common definition. Anything from a few weeks to just under a year qualifies.",
        },
      },
      {
        "@type": "Question",
        name: "Is the term offensive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Its origin was a mocking reference to Irish Catholic immigrant families. Most people using it today mean nothing by it and don't know the history, but it's worth being aware of where it came from.",
        },
      },
      {
        "@type": "Question",
        name: "Do Irish twins have a closer bond than siblings with a bigger gap?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not guaranteed, but it's common — shared developmental stages and near-identical childhood experiences tend to produce more playmate-style closeness earlier than a wider age gap typically allows.",
        },
      },
      {
        "@type": "Question",
        name: "Is having Irish twins harder than having actual twins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "They're hard in genuinely different shapes, not different amounts. Twins mean two newborns at the same stage; Irish twins mean a newborn and a toddler whose differing needs rarely line up. Both are hard, just in different ways.",
        },
      },
      {
        "@type": "Question",
        name: "How do you survive the first 3 months with Irish twins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Protect one 3-4 hour sleep block instead of chasing a full night, lower every standard that isn't safety, batch what you can in advance, accept help you'd normally decline, and check in with your partner on purpose. The acute chaos eases by month three or four.",
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
        name: "Guides",
        item: "https://www.siblingstack.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Irish Twins Guide",
        item: "https://www.siblingstack.com/irish-twins-guide",
      },
    ],
  },
];

const toc = [
  { href: "#what-it-means", label: "What it means" },
  { href: "#history", label: "History" },
  { href: "#challenges", label: "Challenges & upsides" },
  { href: "#timeline", label: "How the ages overlap" },
  { href: "#library", label: "The full library" },
  { href: "#tools", label: "Tools" },
  { href: "#faq", label: "FAQ" },
];

const library = [
  {
    heading: "🛒 Gear & Strollers",
    items: [
      { href: "/blog/double-stroller-close-in-age", label: "Double Stroller Guide for Kids Close in Age" },
      { href: "/blog/double-stroller-roundup", label: "Double Stroller Roundup" },
      { href: "/blog/tandem-vs-side-by-side-stroller-2-under-2", label: "Tandem vs. Side-by-Side Stroller for 2 Under 2" },
      { href: "/blog/high-chair-roundup", label: "High Chair Roundup" },
      { href: "/blog/car-seat-two-different-sizes", label: "Car Seats for Two Different Sizes" },
      { href: "/blog/convertible-car-seats-2026", label: "Convertible Car Seats 2026" },
      { href: "/blog/baby-carriers-2026", label: "Best Baby Carriers 2026" },
      { href: "/blog/baby-gear-dont-buy-twice", label: "Baby Gear You Don't Need to Buy Twice" },
      { href: "/blog/hand-me-down-sizing-cheat-sheet", label: "Hand-Me-Down Sizing Cheat Sheet" },
      { href: "/blog/crib-and-bassinet-setup-two-babies-one-room", label: "Crib and Bassinet Setup for Two Babies, One Room" },
    ],
  },
  {
    heading: "💰 Budget & Cost",
    items: [
      { href: "/blog/two-kids-in-diapers-realistic-budget", label: "A Realistic Budget for Two Kids in Diapers" },
      { href: "/blog/hand-me-down-clothes-timeline-close-in-age", label: "Hand-Me-Down Clothes Timeline for Kids Close in Age" },
      { href: "/blog/daycare-cost-two-kids-under-two", label: "Daycare Cost for Two Kids Under Two" },
    ],
  },
  {
    heading: "🛏️ Sleep & Schedules",
    items: [
      { href: "/blog/newborn-toddler-nap-schedule", label: "Newborn + Toddler Nap Schedule" },
      { href: "/blog/solo-bedtime-2-under-2-alone", label: "Solo Bedtime With 2 Under 2, Alone" },
      { href: "/blog/toddler-one-nap-transition-newborn", label: "Toddler One-Nap Transition With a Newborn in the House" },
      { href: "/blog/stop-toddler-waking-sleeping-baby", label: "How to Stop a Toddler From Waking a Sleeping Baby" },
    ],
  },
  {
    heading: "🍼 Feeding & Solids",
    items: [
      { href: "/blog/feeding-schedule-two-different-ages", label: "Feeding Schedule for Two Different Ages" },
      { href: "/blog/feeding-newborn-entertaining-toddler-activities", label: "Feeding the Newborn While Entertaining the Toddler: Activities" },
    ],
  },
  {
    heading: "💞 Wellbeing & Sibling Bond",
    items: [
      { href: "/blog/sibling-jealousy-close-age-gap", label: "Sibling Jealousy With a Close Age Gap" },
      { href: "/blog/one-on-one-time-each-kid-close-in-age", label: "Protecting One-on-One Time With Each Kid Close in Age" },
      { href: "/blog/milestones-10-month-age-gap", label: "Milestones With a 10-Month Age Gap" },
    ],
  },
  {
    heading: "🤰 Health & Pregnancy",
    items: [
      { href: "/blog/nursing-while-pregnant-second-baby", label: "Nursing While Pregnant With Baby Number Two" },
      { href: "/blog/postpartum-recovery-pregnant-again", label: "Postpartum Recovery When You're Pregnant Again Right Away" },
    ],
  },
  {
    heading: "📅 Full Routine Templates",
    items: [
      { href: "/schedules/2-under-2-schedule", label: "2 Under 2 Daily Schedule" },
      { href: "/schedules/18-month-and-newborn", label: "18-Month-Old and Newborn Routine" },
      { href: "/schedules/two-toddlers-sync", label: "Syncing Two Toddlers' Schedules" },
      { href: "/schedules/newborn-and-2-year-old-routine", label: "Newborn and 2-Year-Old Daily Routine" },
      { href: "/schedules/3-month-old-and-toddler-nap-schedule", label: "3-Month-Old and Toddler Nap Schedule" },
      { href: "/schedules/twins-and-toddler-daily-routine", label: "Twins and Toddler Daily Routine" },
    ],
  },
];

const tools = [
  {
    icon: "📅",
    title: "Age Gap / Due Date Calculator",
    desc: "Enter your kids' ages or a due date to see exactly how far apart they'll be — and what stages will overlap.",
    href: "/tools/calculator",
    cta: "Open calculator",
  },
  {
    icon: "🔄",
    title: "Nap Sync Calculator",
    desc: "Find the window when both kids nap at the same time, so you actually get a guaranteed afternoon break.",
    href: "/tools/nap-sync-calculator",
    cta: "Find the overlap",
  },
  {
    icon: "🌙",
    title: "Bedtime Stagger Calculator",
    desc: "Answer two quick questions to know which child to put to sleep first tonight — and when.",
    href: "/tools/bedtime-stagger-calculator",
    cta: "Plan bedtime",
  },
];

const timeline = [
  { label: "Year 1", baby: "Newborn baby", toddler: "Toddler (10–12 mo)" },
  { label: "Year 2", baby: "Toddler", toddler: "Active 2-year-old" },
  { label: "Year 3", baby: "Preschooler", toddler: "Preschool big kid" },
  { label: "Year 4", baby: "Preschool big kid", toddler: "Early school age" },
  { label: "Year 5", baby: "Early school age", toddler: "Elementary" },
];

export default function IrishTwinsGuidePage() {
  return (
    <main className="min-h-screen itg-page">
      {jsonLd.map((s) => (
        <script
          key={s["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Breadcrumb / home */}
        <nav className="text-[13px] text-[#b5aa9a] mb-6">
          <Link href="/" className="hover:text-[#5fa39a] transition-colors">
            Home
          </Link>{" "}
          › <span className="text-[#f3ece0]">Irish Twins Guide</span>
        </nav>

        {/* Header */}
        <header>
          <span className="inline-block text-[12px] font-bold tracking-[0.03em] text-[#5fa39a] bg-[#25201a] px-3 py-1 rounded-full mb-4">
            COMPLETE GUIDE
          </span>
          <h1 className="font-display text-[clamp(1.9rem,5vw,2.75rem)] font-semibold text-[#f3ece0] leading-[1.15] mb-3">
            Irish Twins: The Complete Guide to Raising Kids Close in Age
          </h1>
          <p className="text-[17px] text-[#b5aa9a] leading-relaxed mb-3">
            What the term means, where it came from, what&apos;s actually hard,
            what&apos;s actually good — and every guide, schedule, and tool in one
            place.
          </p>
          <p className="text-[13.5px] text-[#b5aa9a] mb-8">
            BY <strong className="text-[#f3ece0]">JAMES T. REILLY</strong>{" "}
            <span className="mx-2">•</span> AUG 2026
          </p>
        </header>

        {/* Quick takeaways / TL;DR */}
        <div
          className="rounded-[10px] p-5 mb-8"
          style={{
            background: "#1e2620",
            border: "1px solid #2e2820",
            borderLeft: "4px solid #5fa39a",
          }}
        >
          <p className="text-[14px] font-bold text-[#f3ece0] mb-2">
            💡 Quick takeaways
          </p>
          <ul className="pl-5 flex flex-col gap-1.5 text-[15px] text-[#ccc5b8] leading-relaxed" style={{ listStyle: "disc" }}>
            <li><strong>Irish twins</strong> means siblings born within 12 months of each other — not biological twins.</li>
            <li>Both a <strong>sleep and cost hit</strong>: two kids on different schedules, two in diapers, potentially two daycare bills.</li>
            <li>Close-in-age kids often <strong>become genuine playmates</strong> earlier and for longer.</li>
            <li>Talk to your OB about short pregnancy spacing rather than self-diagnosing from a blog.</li>
          </ul>
        </div>

        {/* Table of Contents */}
        <nav
          className="rounded-[10px] border p-5 mb-10"
          style={{ background: "#25201a", borderColor: "#2e2820" }}
          aria-label="Table of contents"
        >
          <p className="text-[12px] font-bold uppercase tracking-[0.03em] text-[#b5aa9a] mb-3">
            On this page
          </p>
          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-8 gap-y-2">
            {toc.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-[#b5aa9a] hover:text-[#5fa39a] transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="prose-sibling">
          <p>
            If you&apos;ve landed here because someone used the term{" "}
            &quot;Irish twins&quot; about your family, or because you&apos;re
            staring down a due date less than a year after your last one,
            you&apos;re in the right place. This is the complete guide — what the
            term means, where it came from, what&apos;s actually hard about it,
            what&apos;s actually good about it, and links to every specific,
            practical guide, schedule, and tool we&apos;ve built for this exact
            stage.
          </p>

          <h2 id="what-it-means">What does &quot;Irish twins&quot; actually mean?</h2>
          <p>
            Irish twins are two siblings born to the same mother within twelve
            months of each other. They&apos;re not twins in any biological sense
            — just two separate pregnancies close enough together that both kids
            spend a stretch of early childhood at overlapping developmental
            stages. If your first was born in March and your second arrived the
            following February, that&apos;s Irish twins, even though they&apos;ll
            never share a birthday.
          </p>
          <p>
            It&apos;s an informal term, not a medical or clinical one. You
            won&apos;t find it in a textbook. You will find it in nearly every
            parenting forum, because it&apos;s the shorthand real families reach
            for when &quot;small age gap&quot; doesn&apos;t quite capture the
            specific intensity of the stage.
          </p>

          <h2 id="history">Where does the term come from?</h2>
          <p>
            The origin isn&apos;t flattering, and it&apos;s worth knowing.
            &quot;Irish twins&quot; dates back to 19th-century America and
            England, where it was used — often cruelly — to mock Irish Catholic
            immigrant families, who tended to have large families with children
            born close together, partly due to limited access to birth control at
            the time. The phrase was a way of implying poverty, poor
            self-control, and lack of education, aimed at a specific immigrant
            community.
          </p>
          <p>
            Over the following century, the term drifted away from that original
            insult and into general, casual use — most people who say it today
            have no idea about the history and mean nothing by it beyond
            &quot;siblings close in age.&quot; Still, it&apos;s worth being aware
            of where it comes from, and worth being a little careful using it
            about someone else&apos;s family, since not everyone is comfortable
            with the term regardless of its current casual usage.
          </p>

          <h2 id="challenges">Is it actually healthy to have kids that close together?</h2>
          <p>
            This is one of the most common searches around this topic, and it
            deserves a straight answer: back-to-back pregnancies do carry more
            physical demands on the parent giving birth, and organizations like
            the World Health Organization generally recommend a gap of at least
            18–24 months between pregnancies for physical recovery reasons. That
            said, plenty of families have healthy pregnancies and healthy kids
            with a shorter gap — it&apos;s a real consideration to raise with
            your doctor, not an automatic red flag. If you&apos;re pregnant again
            soon after a previous birth, that&apos;s a conversation for your OB,
            not something to self-diagnose from a parenting blog.
          </p>

          <div
            className="rounded-[10px] p-4 my-6"
            style={{
              background: "#2a2218",
              border: "1px solid #4a3a22",
              borderLeft: "4px solid #d98c5f",
            }}
          >
            <p className="text-[12.5px] font-bold text-[#d98c5f] mb-1.5 uppercase tracking-[0.03em]">
              Medical disclaimer
            </p>
            <p className="text-[15px] leading-relaxed text-[#ccc5b8]">
              This guide is educational content, not medical advice. Decisions
              about pregnancy spacing, recovery, fertility, or any pregnancy
              complication should be made with your OB-GYN, midwife, or primary
              care provider — especially if you&apos;ve recently had a C-section
              or a complicated delivery. If you are pregnant or trying to
              conceive soon after a recent birth, raise the short interval
              explicitly at your next appointment rather than relying on
              general information.
            </p>
          </div>

          <h3>The real challenges — stated honestly</h3>
          <ul>
            <li>
              <strong>Sleep.</strong> Two kids on two different, less flexible
              sleep needs, often in the same house, sometimes in the same room.
              This is usually the single hardest logistical piece of the early
              stage.
            </li>
            <li>
              <strong>Cost.</strong> Two kids in diapers, two rounds of gear,
              sometimes two daycare tuitions at the more expensive infant rate
              simultaneously. The financial hit is real and front-loaded.
            </li>
            <li>
              <strong>Physical recovery.</strong> Recovering from birth, or from
              pregnancy, while also physically caring for a toddler who
              doesn&apos;t understand why they can&apos;t be picked up.
            </li>
            <li>
              <strong>Split attention.</strong> Two kids needing hands-on care at
              genuinely overlapping times, with only one set of hands most of the
              day.
            </li>
            <li>
              <strong>Marriage strain.</strong> The logistics load on a couple
              managing two kids this close together is significant, and it shows
              up in the relationship if it isn&apos;t actively managed.
            </li>
          </ul>
          <p>
            None of these are exaggerated. They&apos;re also all, individually,
            manageable — which is most of what the rest of this site is about.
          </p>

          <div
            className="rounded-[10px] p-4 my-6"
            style={{
              background: "#2a2218",
              border: "1px solid #4a3a22",
              borderLeft: "4px solid #d98c5f",
            }}
          >
            <p className="text-[12.5px] font-bold text-[#d98c5f] mb-1.5 uppercase tracking-[0.03em]">
              Parenting reality check
            </p>
            <p className="text-[15px] leading-relaxed text-[#ccc5b8]" style={{ fontStyle: "italic" }}>
              &quot;The hardest part of a 13-month gap isn&apos;t the double
              diapering or the double gear — it&apos;s the split attention. When
              both kids are crying for different reasons at the exact same
              minute, prioritize safety first, take a deep breath, and handle
              one room at a time.&quot;
            </p>
          </div>

          <h3>The real upside</h3>
          <p>
            The flip side gets less airtime, but it&apos;s just as real. Kids
            close in age tend to become genuine playmates earlier than a bigger
            age gap typically allows — they&apos;re at compatible stages for
            longer stretches of childhood. Many parents also describe an
            efficiency to the stage: diapers, sleep training, and early gear all
            happen once, in a compressed window, rather than stretched across
            years. And the sibling bond that forms from two kids growing up at
            nearly the same pace, sharing nearly the same childhood experiences
            at nearly the same time, is something parents of more widely spaced
            kids often say they didn&apos;t get in quite the same way.
          </p>

          <div
            className="rounded-[10px] p-4 my-6"
            style={{
              background: "#1e2620",
              border: "1px solid #2f4038",
              borderLeft: "4px solid #5fa39a",
            }}
          >
            <p className="text-[12.5px] font-bold text-[#5fa39a] mb-1.5 uppercase tracking-[0.03em]">
              Light at the end of the tunnel
            </p>
            <p className="text-[15px] leading-relaxed text-[#ccc5b8]" style={{ fontStyle: "italic" }}>
              &quot;Year one is survival mode, but year two is a different story.
              By the time they were 1 and 2, they were built-in best friends
              playing together with the same toys — and on the exact same sleep
              schedule.&quot;
            </p>
          </div>

          <h3>How common is it?</h3>
          <p>
            There&apos;s no official global count, but it remains a common
            pattern, not a rare one — plenty of families end up here by choice,
            by surprise, or by circumstances beyond planning. If it feels like
            everyone around you has a bigger gap, that&apos;s a visibility bias,
            not a reflection of how common your situation actually is.
          </p>

          <h2>Is having Irish twins harder than having actual twins?</h2>
          <p>
            There&apos;s no clean answer here, because the two situations are
            hard in genuinely different shapes, not different amounts.
          </p>
          <p>
            <strong>Biological twins</strong> mean two newborns at the exact same
            stage on day one — identical sleep needs, identical feeding demands,
            no older sibling routine to protect. That&apos;s an intensely
            demanding stretch, often compounded by a higher-risk pregnancy and
            delivery, and it lands on a parent with zero prior newborn experience
            to draw on if it&apos;s a first pregnancy. The intensity is enormous,
            but it&apos;s also, in a sense, uniform: both kids need roughly the
            same thing at roughly the same time, every day, for months.
          </p>
          <p>
            <strong>Irish twins</strong> are hard in a more scattered way.
            You&apos;re rarely doing &quot;two newborns&quot; — you&apos;re
            doing a newborn and a toddler with an established routine, opinions,
            and a developing personality, and those two sets of needs almost
            never line up. The specific hard part keeps changing: postpartum
            recovery while chasing a walker at month one, sleep regression
            colliding with a nap transition at month six, weaning one kid while
            starting solids for the other at month nine. Nothing repeats long
            enough to become fully automatic, and the stretch of &quot;both kids
            demanding&quot; runs longer in total than a twin household&apos;s
            synchronized newborn phase.
          </p>
          <p>
            If you&apos;re asking because you&apos;re trying to brace yourself:
            don&apos;t rank it. Prepare for sustained, shifting demands rather
            than one finite, brutal-but-uniform sprint. Both are genuinely hard.
            They&apos;re just not the same kind of hard.
          </p>

          <h2 id="first-3-months">How to survive the first 3 months with Irish twins</h2>
          <p>
            The first three months are the highest-intensity stretch, mostly
            because nothing is automatic yet — no established routine, no sense
            of what &quot;normal&quot; looks like for this specific combination
            of kids. A few things make the biggest difference in that window:
          </p>
          <ul>
            <li>
              <strong>Protect one sleep block, not the whole night.</strong>{" "}
              You won&apos;t get eight consolidated hours in this window.
              Protecting even one 3–4 hour stretch — trading off with a partner,
              or accepting help specifically for that block — does more for
              functioning than chasing a full night that isn&apos;t realistic
              yet.
            </li>
            <li>
              <strong>Lower every standard that isn&apos;t safety.</strong>{" "}
              Meals, house tidiness, &quot;quality&quot; screen time limits — all
              of it can slide for three months without lasting consequence.
              Decide this in advance so it doesn&apos;t feel like failure in the
              moment.
            </li>
            <li>
              <strong>Batch what you can before you need it.</strong> Freezer
              meals, a stocked go-bag, subscriptions for diapers and wipes on
              autopilot — anything decided once, in advance, is one less decision
              you have to make at 2 AM.
            </li>
            <li>
              <strong>Accept help you&apos;d normally decline.</strong> A grocery
              run, a load of laundry, an hour of toddler supervision — the first
              three months is not the window to prove you can do it all solo.
            </li>
            <li>
              <strong>Check in with your partner on purpose, not by accident.</strong>{" "}
              A quick, regular &quot;how are we actually doing&quot; conversation
              catches resentment building before it becomes a bigger problem.
            </li>
          </ul>
          <p>
            This window does end. Most families report the acute chaos genuinely
            easing by month three or four, as the newborn&apos;s patterns become
            more predictable and the household finds its own rhythm. For the
            day-to-day mechanics of that stretch specifically, the Health &amp;
            Pregnancy and Postpartum &amp; Recovery guides below go deeper on
            individual pieces of this.
          </p>

          <h2 id="timeline">What the next five years actually look like</h2>
          <p>
            One of the most useful ways to picture a 10–12 month gap is to see
            how the two kids&apos; stages overlap across early childhood. Both
            are on close-but-not-equal tracks the whole way:
          </p>
        </div>

        {/* Visual age-gap timeline */}
        <div className="flex flex-col gap-3 my-8">
          {timeline.map((row, i) => (
            <div
              key={row.label}
              className="rounded-[10px] border p-4"
              style={{
                background: "#25201a",
                borderColor: "#2e2820",
                ...(i === 0 ? { borderLeft: "4px solid #d98c5f" } : {}),
              }}
            >
              <p className="text-xs font-mono text-[#b5aa9a] uppercase tracking-widest mb-2">
                {row.label}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="w-24 shrink-0 text-sm font-semibold text-[#5fa39a]">
                  Kid #1
                </span>
                <span className="text-sm text-[#f3ece0]">{row.baby}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                <span className="w-24 shrink-0 text-sm font-semibold text-[#5fa39a]">
                  Kid #2
                </span>
                <span className="text-sm text-[#f3ece0]">{row.toddler}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="prose-sibling">
          <p>
            Notice how both kids stay within roughly the same two developmental
            stages for years — toddler-to-toddler, then preschooler-out-of-step,
            then back toward parallel again. That&apos;s the core of why
            close-in-age siblings tend to play together so well for so long, and
            why the logistics (two nap routines, two bedtimes, two potty
            training efforts at similar times) cluster into a compressed window
            rather than stretching across a decade.
          </p>

          <h2 id="library">
            Every guide, schedule, and tool — organized by what you&apos;re
            dealing with right now
          </h2>
          <p>
            Below is the full library, grouped the way you&apos;re actually
            experiencing this stage — not by publish date. Jump to whichever
            section matches what&apos;s happening in your house this week.
          </p>
        </div>

        {/* Visual library cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {library.map((group) => (
            <div key={group.heading} className="flex flex-col gap-4">
              <div className="rounded-[10px] border p-5 flex flex-col h-full" style={{ background: "#25201a", borderColor: "#2e2820" }}>
                <p className="font-display text-base font-semibold text-[#f3ece0] mb-3">
                  {group.heading}
                </p>
                <ul className="flex flex-col gap-2 text-sm">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="text-[#ccc5b8] hover:text-[#5fa39a] transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {group.heading === "🛏️ Sleep & Schedules" && (
                <div
                  className="rounded-[10px] border p-5 h-full"
                  style={{
                    background: "#1e2620",
                    borderColor: "#2f4038",
                    borderLeft: "4px solid #5fa39a",
                  }}
                >
                  <p className="text-xs font-mono uppercase tracking-widest mb-2 text-[#5fa39a]">
                    Sleep reality check
                  </p>
                  <p className="text-sm leading-relaxed text-[#ccc5b8]" style={{ fontStyle: "italic" }}>
                    &quot;Staggering their bedtimes by just 30 minutes saved our
                    sanity. Getting the baby down first gave us that essential
                    one-on-one routine with our toddler.&quot;
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive tool previews */}
        <div className="my-10">
          <p className="font-display text-lg font-semibold text-[#f3ece0] mb-4" id="tools">
            Free tools to try right now
          </p>
          <div className="grid grid-cols-1 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.href}
                className="rounded-[10px] p-6 border flex flex-col sm:flex-row sm:items-center gap-5"
                style={{ background: "#25201a", borderColor: "#2e2820" }}
              >
                <span className="text-2xl shrink-0" aria-hidden="true">
                  {tool.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base font-semibold text-[#f3ece0] mb-1">
                    {tool.title}
                  </p>
                  <p className="text-sm text-[#b5aa9a] leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <Link
                  href={tool.href}
                  className="shrink-0 inline-block font-semibold text-[#1c1815] bg-[#5fa39a] hover:bg-[#7fb5ac] transition-colors rounded-md py-2.5 px-5 text-sm text-center"
                >
                  {tool.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="prose-sibling">
          <h2 id="faq">Frequently asked</h2>
          <p>
            <strong>Are Irish twins actually twins?</strong>
            <br />
            No — they&apos;re two separate pregnancies, just close enough
            together that both kids spend part of childhood at overlapping ages
            and stages.
          </p>
          <p>
            <strong>How far apart do kids have to be to count as Irish twins?</strong>
            <br />
            Under twelve months apart, by the common definition. Anything from a
            few weeks to just under a year qualifies.
          </p>
          <p>
            <strong>Is the term offensive?</strong>
            <br />
            Its origin was a mocking reference to Irish Catholic immigrant
            families. Most people using it today mean nothing by it and
            don&apos;t know the history, but it&apos;s worth being aware of where
            it came from.
          </p>
          <p>
            <strong>Do Irish twins have a closer bond than siblings with a
            bigger gap?</strong>
            <br />
            Not guaranteed, but it&apos;s common — shared developmental stages and
            near-identical childhood experiences tend to produce more
            playmate-style closeness earlier than a wider age gap typically
            allows.
          </p>

          <div
            className="rounded-[10px] p-4 my-4"
            style={{
              background: "#2a2218",
              border: "1px solid #4a3a22",
              borderLeft: "4px solid #d98c5f",
            }}
          >
            <p className="text-[12.5px] font-bold text-[#d98c5f] mb-1.5 uppercase tracking-[0.03em]">
              Bond reality check
            </p>
            <p className="text-[15px] leading-relaxed text-[#ccc5b8]" style={{ fontStyle: "italic" }}>
              &quot;Closeness in age doesn&apos;t guarantee closeness in bond —
              it just opens the door. The bond is built on intentional time:
              separate outings, one-on-one moments, and protecting each
              child&apos;s individual attention.&quot;
            </p>
          </div>

          <p>
            <strong>Is having Irish twins harder than having actual twins?</strong>
            <br />
            They&apos;re hard in genuinely different shapes, not different
            amounts. Twins mean two newborns at the same stage; Irish twins mean
            a newborn and a toddler whose differing needs rarely line up. Both
            are hard — just in different ways.
          </p>
          <p>
            <strong>How do you survive the first 3 months with Irish twins?</strong>
            <br />
            Protect one 3–4 hour sleep block instead of chasing a full night,
            lower every standard that isn&apos;t safety, batch what you can in
            advance, accept help you&apos;d normally decline, and check in with
            your partner on purpose. The acute chaos eases by month three or
            four.
          </p>
        </div>

        <div className="mt-10 pt-6" style={{ borderTop: "1px solid #2e2820" }}>
          <Link href="/" className="text-[#b5aa9a] hover:text-[#5fa39a] text-xs font-mono transition-colors">
            Back to Sibling Stack
          </Link>
        </div>
      </div>
    </main>
  );
}
