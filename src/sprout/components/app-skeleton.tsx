const BLOCK = "animate-pulse-soft rounded-2xl bg-hairline";

// Mirrors the Tracker layout (header, glance card, quick log, timers,
// handoff, recent entries) so the first paint never jumps.
export function AppSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md animate-fade-in">
      <p className="sr-only">Loading your tracker…</p>

      <header className="border-b border-hairline px-4 py-3">
        <div className="flex items-center gap-3">
          <span className={`${BLOCK} h-12 w-12 rounded-2xl`} />
          <span className="flex-1 space-y-2">
            <span className={`${BLOCK} block h-4 w-32`} />
            <span className={`${BLOCK} block h-3 w-40`} />
          </span>
          <span className={`${BLOCK} h-11 w-11 rounded-2xl`} />
          <span className={`${BLOCK} h-11 w-11 rounded-2xl`} />
        </div>
      </header>

      <div className="space-y-5 px-4 pt-4">
        <section className={`${BLOCK} h-[210px] rounded-3xl`} />
        <section className="space-y-2.5">
          <span className={`${BLOCK} ml-1 block h-4 w-24 rounded-lg`} />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index} className={`${BLOCK} h-[84px] rounded-3xl`} />
            ))}
          </div>
        </section>
        <section className="space-y-2">
          <span className={`${BLOCK} ml-1 block h-4 w-24 rounded-lg`} />
          <span className={`${BLOCK} block h-14 rounded-3xl`} />
          <span className={`${BLOCK} block h-14 rounded-3xl`} />
        </section>
        <section className={`${BLOCK} h-16 rounded-3xl`} />
        <section className="space-y-2">
          <span className={`${BLOCK} ml-1 block h-4 w-28 rounded-lg`} />
          <span className={`${BLOCK} block h-20 rounded-3xl`} />
          <span className={`${BLOCK} block h-20 rounded-3xl`} />
        </section>
      </div>
    </div>
  );
}
