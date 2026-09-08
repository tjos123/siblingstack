import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Gear for Two Kids Close in Age — Sibling Stack",
  description:
    "Stroller, car seat, and gear decisions for parents with two kids close together — organized by decision, not by checklist, with honest guidance on what to buy twice and what to skip.",
  alternates: { canonical: "https://www.siblingstack.com/gear" },
  openGraph: {
    title: "Gear for Two Kids Close in Age — Sibling Stack",
    description:
      "Stroller, car seat, and gear decisions for parents with two kids close together — organized by decision, not by checklist, with honest guidance on what to buy twice and what to skip.",
    url: "https://www.siblingstack.com/gear",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

interface HubItem {
  href: string;
  title: string;
  blurb?: string;
}

interface HubSection {
  emoji: string;
  label: string;
  intro?: string;
  note?: string;
  items: HubItem[];
}

const hubSections: HubSection[] = [
  {
    emoji: "🚼",
    label: "Strollers",
    intro:
      "The biggest, most expensive decision most families make for two kids — and the one with the most genuinely conflicting advice online.",
    items: [
      {
        href: "/gear/double-stroller-close-in-age",
        title: "Double Strollers for Kids Close in Age",
        blurb:
          "the full buying guide: what actually matters (asymmetrical recline is the rule most guides bury), by stage.",
      },
      {
        href: "/gear/tandem-vs-side-by-side-stroller-2-under-2",
        title: "Tandem vs. Side-by-Side: Which for 2 Under 2",
        blurb: "the specific comparison almost nobody else covers in real depth.",
      },
      {
        href: "/gear/double-stroller-roundup",
        title: "Double Stroller Roundup",
        blurb: "specific model picks, for once you know which type you need.",
      },
    ],
  },
  {
    emoji: "🚗",
    label: "Car Seats",
    items: [
      {
        href: "/gear/car-seat-two-different-sizes",
        title: "Car Seats for Two Different Sizes",
        blurb:
          "the buying-criteria guide for fitting two different car seat stages in one back seat.",
      },
      {
        href: "/gear/convertible-car-seats-2026",
        title: "Best Convertible Car Seats",
        blurb: "current model roundup, safety-recall-aware.",
      },
    ],
  },
  {
    emoji: "🍽️",
    label: "Feeding",
    items: [
      {
        href: "/gear/high-chair-roundup",
        title: "High Chair Roundup",
        blurb: "picks for feeding two kids at different stages at once.",
      },
    ],
  },
  {
    emoji: "🧺",
    label: "Carrying",
    items: [
      {
        href: "/gear/baby-carriers-2026",
        title: "Baby Carriers Roundup",
        blurb: "current picks.",
      },
    ],
    note:
      "(No dedicated \"how to choose\" guide yet for carriers — the one category still missing its buying-criteria companion piece.)",
  },
  {
    emoji: "🛏️",
    label: "Nursery & Sleep Setup",
    items: [
      {
        href: "/gear/crib-and-bassinet-setup-two-babies-one-room",
        title: "Crib and Bassinet Setup for Two Babies, One Room",
      },
    ],
  },
  {
    emoji: "♻️",
    label: "What Not to Buy Twice",
    intro:
      "The genuinely differentiated cluster — the one competitor research didn't find anywhere else with real depth.",
    items: [
      {
        href: "/gear/baby-gear-dont-buy-twice",
        title: "Baby Gear: What Not to Buy Twice",
        blurb: "the overview.",
      },
      {
        href: "/gear/hand-me-down-sizing-cheat-sheet",
        title: "Hand-Me-Down Sizing Cheat Sheet",
        blurb: "category-by-category breakdown.",
      },
      {
        href: "/gear/hand-me-down-clothes-timeline-close-in-age",
        title: "Hand-Me-Down Clothes Timeline",
        blurb: "storage system and timing for close-in-age siblings specifically.",
      },
    ],
  },
];

const faqs = [
  {
    question: "Do I really need two of everything?",
    answer:
      "No — see the \"What Not to Buy Twice\" cluster above. Some items (car seats, cribs if same-age-overlap) genuinely need duplicates; a lot of others (clothes, some feeding gear) can be staggered or handed down instead.",
  },
  {
    question:
      "My kids aren't twins — does the twins-specific content still apply to me?",
    answer:
      "Some of it (the tandem-vs-side-by-side comparison, for instance) applies to any two kids needing to travel together regardless of whether they're twins — check each article's stated age range rather than assuming twins-only content doesn't apply.",
  },
];

function HubItemRow({ item }: { item: HubItem }) {
  return (
    <Link href={item.href} className="block group">
      <article className="py-5 border-b border-surface2 last:border-0 transition-all">
        <h3 className="font-display text-lg text-ink leading-snug group-hover:text-childA transition-colors underline underline-offset-4 decoration-surface2 group-hover:decoration-childA">
          {item.title}
        </h3>
        {item.blurb && (
          <p className="text-ink-muted text-sm leading-relaxed mt-1">
            {item.blurb}
          </p>
        )}
      </article>
    </Link>
  );
}

export default function GearPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <SiteHeader />
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Sibling Stack
            </Link>
            <span className="text-surface2">›</span>
            <span className="text-ink-muted">Gear</span>
          </nav>

          <h1 className="font-display text-3xl text-ink mt-5 mb-4">
            Gear for Two Kids Close in Age
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Most gear guides are checklists — buy this, buy that, here&apos;s a
            registry. This isn&apos;t that. Every guide here is built around an
            actual decision: which stroller type fits your situation, whether you
            need two of something or can get away with one, when a hand-me-down
            is fine and when it&apos;s not. Pick the category below that matches
            what you&apos;re deciding right now.
          </p>
        </div>

        {hubSections.map((section) => (
          <section key={section.label} className="mb-10">
            <h2 className="font-display text-xl text-ink mb-2">
              <span aria-hidden="true" className="mr-2">
                {section.emoji}
              </span>
              {section.label}
            </h2>
            {section.intro && (
              <p className="text-ink-muted text-sm leading-relaxed mb-3">
                {section.intro}
              </p>
            )}
            <div>
              {section.items.map((item) => (
                <HubItemRow key={item.href} item={item} />
              ))}
            </div>
            {section.note && (
              <p className="text-xs text-ink-muted leading-relaxed mt-3 italic">
                {section.note}
              </p>
            )}
          </section>
        ))}

        <section className="mt-16 pt-10 border-t border-surface2">
          <h2 className="font-display text-xl text-ink mb-4">FAQ</h2>
          <div className="flex flex-col gap-5">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <p className="font-medium text-ink text-sm mb-1">{faq.question}</p>
                <p className="text-ink-muted text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}