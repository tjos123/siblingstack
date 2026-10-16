import { ArrowRight, Lock, WifiOff, Sparkles } from "lucide-react";

const BULLETS = [
  {
    icon: Lock,
    title: "Private by default",
    body: "Every feed, nap and diaper stays on your device. No account, no ads, no tracking.",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    body: "Log at 3am with no signal. Entries save locally and sync when you're back online.",
  },
  {
    icon: Sparkles,
    title: "Free, forever",
    body: "Feeds, sleep, diapers, growth and milestones — all included, installable in seconds.",
  },
] as const;

export function SproutLanding() {
  return (
    <section className="sprout-landing min-h-dvh bg-background">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-12">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage/20 text-lg"
          >
            🌱
          </span>
          <span className="font-serif text-base font-bold text-foreground">
            Sprout Baby
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center rounded-full bg-sage/15 px-3 py-1 text-[11px] font-bold tracking-wide text-sage-read">
            FREE · PRIVATE · OFFLINE
          </span>
          <h1 className="font-serif text-[clamp(1.9rem,7vw,2.5rem)] font-bold leading-[1.15] text-foreground">
            The calm baby tracker for feeds, sleep and everything in between.
          </h1>
          <p className="text-[15px] font-medium leading-relaxed text-muted">
            Log feeds, sleep, diapers, growth and milestones in one tap — and
            keep every entry on your own device.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {BULLETS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-sage-read"
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">
                  {title}
                </span>
                <span className="block text-[13px] font-medium leading-snug text-muted">
                  {body}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div
          aria-hidden="true"
          className="rounded-[2rem] border border-hairline bg-sprout-surface p-4 shadow-soft"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sage/25 bg-sage/15 text-xl">
              🌱
            </span>
            <span className="flex flex-col">
              <span className="font-serif text-sm font-bold text-foreground">
                Baby
              </span>
              <span className="text-[11px] font-medium text-muted">
                3 months · 1 wk 2 d
              </span>
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {["Feeds", "Sleep", "Diapers", "Pumped"].map((label, index) => (
              <span
                key={label}
                className="flex flex-col items-center rounded-2xl border border-hairline px-1 py-2"
              >
                <span className="tabular text-sm font-bold text-foreground">
                  {[5, "9h", 6, "120"][index]}
                </span>
                <span className="text-[10px] font-semibold text-muted">
                  {label}
                </span>
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {["🍼", "🥛", "💧", "😴", "🎈", "🏆", "📈", "🩺"].map((icon, i) => (
              <span
                key={i}
                className="flex min-h-[52px] items-center justify-center rounded-2xl bg-sprout-surface-muted text-xl"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href="#sprout-app"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
          >
            Open the tracker
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <p className="text-center text-[11px] font-medium text-muted">
            No sign-up. Install to your home screen from your browser menu.
          </p>
        </div>
      </div>
    </section>
  );
}
