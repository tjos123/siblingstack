"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

type Stage = "infant" | "toddler";

const INFANT_FREQS = [
  { id: "1", label: "1 / day", unitsPerMonth: 30 },
  { id: "2", label: "2 / day", unitsPerMonth: 60 },
  { id: "3", label: "3 / day", unitsPerMonth: 90 },
];

const TODDLER_FREQS = [
  { id: "4", label: "4 / week", unitsPerMonth: 17 },
  { id: "6", label: "6 / week", unitsPerMonth: 26 },
  { id: "9", label: "9 / week", unitsPerMonth: 39 },
  { id: "12", label: "12 / week", unitsPerMonth: 52 },
  { id: "15", label: "15 / week", unitsPerMonth: 65 },
];

type Brand = {
  name: string;
  stage: Stage;
  cadence: number;
  unitPrice: (u: number) => [number, number];
  shipping: (u: number, priceRange: [number, number]) => [number, number];
  note: string;
};

const BRANDS: Brand[] = [
  {
    name: "Little Spoon (Babyblends)",
    stage: "infant",
    cadence: 2,
    unitPrice: (u) => {
      if (u <= 30) return [3.8, 4.05];
      if (u <= 60) return [3.3, 3.6];
      return [2.8, 3.05];
    },
    shipping: () => [5, 10],
    note: "Refrigerated, ships every 2 weeks.",
  },
  {
    name: "Little Spoon (Plates)",
    stage: "toddler",
    cadence: 2,
    unitPrice: (u) => {
      if (u <= 17) return [6.5, 7.5];
      if (u <= 26) return [6.0, 7.0];
      if (u <= 39) return [5.5, 6.5];
      return [5.0, 6.0];
    },
    shipping: () => [5, 10],
    note: "Separate account/shipping from Babyblends if ordering both.",
  },
  {
    name: "Once Upon a Farm (pouches)",
    stage: "infant",
    cadence: 2,
    unitPrice: () => [2.55, 3.35],
    shipping: (u, priceRange) => {
      const perDeliveryValue = (u / 2) * ((priceRange[0] + priceRange[1]) / 2);
      return perDeliveryValue >= 45 ? [5.99, 5.99] : [12, 12];
    },
    note: "Refrigerated pouches, separate subscription from Meal Starters.",
  },
  {
    name: "Once Upon a Farm (Meal Starters)",
    stage: "toddler",
    cadence: 2,
    unitPrice: (u) => (u >= 24 ? [4.69, 4.69] : [4.99, 4.99]),
    shipping: () => [5.99, 12],
    note: "Frozen; separate subscription from pouches.",
  },
  {
    name: "Tiny Organics",
    stage: "toddler",
    cadence: 2,
    unitPrice: (u) => (u >= 24 ? [4.69, 4.69] : [4.69, 5.49]),
    shipping: () => [5.99, 5.99],
    note: "12-cup minimum order every cycle.",
  },
  {
    name: "Nurture Life (Finger Foods)",
    stage: "toddler",
    cadence: 4.33,
    unitPrice: (u) => (u >= 65 ? [5.99, 5.99] : [5.99, 6.99]),
    shipping: (u, priceRange) => {
      const perDeliveryValue = (u / 4.33) * ((priceRange[0] + priceRange[1]) / 2);
      return perDeliveryValue >= 59 ? [0, 0] : [6, 8.99];
    },
    note: "$39 order minimum; free shipping over $59; ships weekly.",
  },
  {
    name: "Nurture Life (Kids Meals)",
    stage: "toddler",
    cadence: 4.33,
    unitPrice: (u) => (u >= 65 ? [6.55, 6.55] : [6.55, 7.69]),
    shipping: (u, priceRange) => {
      const perDeliveryValue = (u / 4.33) * ((priceRange[0] + priceRange[1]) / 2);
      return perDeliveryValue >= 59 ? [0, 0] : [6, 8.99];
    },
    note: "$39 order minimum; free shipping over $59; ships weekly.",
  },
  {
    name: "Cerebelly (pouches)",
    stage: "infant",
    cadence: 2,
    unitPrice: () => [2.5, 3.0],
    shipping: () => [0, 6],
    note: "Shelf-stable; also sold at retail. Shipping approximate.",
  },
];

type Child = { stage: Stage; freq: string };

const defaultFreqFor = (stage: Stage) => (stage === "infant" ? "2" : "9");
const freqOptions = (stage: Stage) =>
  stage === "infant" ? INFANT_FREQS : TODDLER_FREQS;

function computeBrandCost(brand: Brand, unitsPerMonth: number) {
  const unitRange = brand.unitPrice(unitsPerMonth);
  const deliveriesPerMonth = brand.cadence;
  const shipPerDelivery = brand.shipping(unitsPerMonth, unitRange);
  const shipRangeMonthly: [number, number] = [
    shipPerDelivery[0] * deliveriesPerMonth,
    shipPerDelivery[1] * deliveriesPerMonth,
  ];
  return {
    low: unitRange[0] * unitsPerMonth + shipRangeMonthly[0],
    high: unitRange[1] * unitsPerMonth + shipRangeMonthly[1],
  };
}

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

export default function SiblingMealCostCalculator() {
  const [children, setChildren] = useState<Child[]>([
    { stage: "infant", freq: "2" },
  ]);

  const updateChild = (idx: number, patch: Partial<Child>) => {
    setChildren((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    );
  };

  const addChild = () => {
    if (children.length < 2) {
      setChildren((prev) => [...prev, { stage: "toddler", freq: "9" }]);
    }
  };

  const removeChild = (idx: number) => {
    setChildren((prev) => prev.filter((_, i) => i !== idx));
  };

  const ledgers = children.map((child) => {
    const match = freqOptions(child.stage).find((o) => o.id === child.freq);
    const unitsPerMonth = match ? match.unitsPerMonth : freqOptions(child.stage)[0].unitsPerMonth;
    const costs = BRANDS.filter((b) => b.stage === child.stage)
      .map((brand) => ({ brand, ...computeBrandCost(brand, unitsPerMonth) }))
      .sort((a, b) => a.low - b.low);
    return { child, costs };
  });

  const combinedLow = ledgers.reduce((sum, l) => sum + (l.costs[0]?.low ?? 0), 0);
  const combinedHigh = ledgers.reduce((sum, l) => sum + (l.costs[0]?.high ?? 0), 0);

  return (
    <main className="min-h-screen px-6 py-12">
      <SiteHeader />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-5">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Home
            </Link>
            <span className="text-surface2">›</span>
            <Link href="/tools" className="text-ink-muted hover:text-ink transition-colors">
              Tools
            </Link>
          </nav>

          <h1 className="font-display text-3xl text-ink mb-2">
            Sibling meal cost calculator
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Add each child&apos;s feeding stage below and see a real, ranged
            monthly estimate across five subscription brands — built from the
            published tier pricing behind this site&apos;s full baby &amp;
            toddler meal subscription guide.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] items-start mb-12">
          <div className="border border-surface2 rounded-xl p-6">
            {children.map((child, idx) => (
              <div
                key={idx}
                className={idx > 0 ? "border-t border-surface2 pt-6 mt-6" : ""}
              >
                <h2 className="font-display text-lg text-ink mb-4">
                  Child {idx + 1}
                </h2>

                <label className="block text-sm font-medium text-ink mb-2">
                  Feeding stage
                </label>
                <div className="flex border border-surface2 rounded-lg overflow-hidden mb-4">
                  {(["infant", "toddler"] as Stage[]).map((stageVal) => (
                    <button
                      key={stageVal}
                      type="button"
                      aria-pressed={child.stage === stageVal}
                      onClick={() => {
                        if (child.stage !== stageVal) {
                          updateChild(idx, {
                            stage: stageVal,
                            freq: defaultFreqFor(stageVal),
                          });
                        }
                      }}
                      className={`flex-1 px-2 py-2.5 text-sm transition-colors ${
                        child.stage === stageVal
                          ? "bg-childA text-bg font-medium"
                          : "text-ink hover:bg-surface"
                      }`}
                    >
                      {stageVal === "infant" ? "Infant (purée)" : "Toddler (meals)"}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-ink mb-2">
                  {child.stage === "infant" ? "Blends per day" : "Meals per week"}
                </label>
                <select
                  value={child.freq}
                  onChange={(e) => updateChild(idx, { freq: e.target.value })}
                  className="w-full bg-surface border border-surface2 rounded-lg px-4 py-3 text-ink text-sm focus:outline-none focus:border-childA"
                >
                  {freqOptions(child.stage).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(idx)}
                    className="mt-4 text-xs text-ink-muted underline underline-offset-2 hover:text-ink"
                  >
                    Remove this child
                  </button>
                )}
              </div>
            ))}

            {children.length < 2 && (
              <button
                type="button"
                onClick={addChild}
                className="mt-5 text-sm text-childA underline underline-offset-2 hover:opacity-80"
              >
                + Add a second child
              </button>
            )}

            <p className="mt-6 pt-5 border-t border-surface2 text-xs text-ink-muted leading-relaxed">
              Estimates use each brand&apos;s published per-unit price at the
              tier closest to what you select, plus a typical shipping figure.
              Actual pricing changes — always confirm current numbers at
              checkout.
            </p>
          </div>

          <div className="border border-surface2 rounded-xl p-6">
            <div className="flex flex-wrap justify-between items-baseline gap-2 mb-6">
              <h2 className="font-display text-xl text-ink">
                Estimated monthly cost
              </h2>
              <span className="text-xs text-ink-muted">
                Ranges reflect real advertised tier pricing
              </span>
            </div>

            <div className="bg-surface border border-surface2 rounded-xl p-5 text-center mb-8">
              <p className="text-xs font-mono uppercase tracking-widest text-childA mb-2">
                Combined household estimate, cheapest brand per child
              </p>
              <p className="font-display text-3xl text-ink">
                {fmt(combinedLow)}–{fmt(combinedHigh)}
                <span className="text-sm font-body text-ink-muted ml-2">/ month</span>
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {ledgers.map(({ child, costs }, idx) => (
                <div key={idx}>
                  <h3 className="font-display text-base text-ink mb-3">
                    Child {idx + 1} —{" "}
                    {child.stage === "infant" ? "infant purées" : "toddler meals"}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-surface2">
                          <th className="text-left text-xs font-semibold text-ink-muted pb-2 pr-3">
                            Brand
                          </th>
                          <th className="text-right text-xs font-semibold text-ink-muted pb-2">
                            Est. monthly cost
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {costs.map((row, i) => (
                          <tr
                            key={row.brand.name}
                            className={`border-b border-surface2 ${
                              i === 0 ? "bg-surface" : ""
                            }`}
                          >
                            <td className="py-3 pr-3 text-sm text-ink align-top">
                              {row.brand.name}
                              {i === 0 && (
                                <span className="ml-2 inline-block text-xs text-childB border border-childB px-1.5 py-0.5">
                                  lowest estimate
                                </span>
                              )}
                              <span className="block text-xs text-ink-muted mt-1">
                                {row.brand.note}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-ink text-right whitespace-nowrap align-top">
                              {fmt(row.low)}–{fmt(row.high)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-surface2 pt-8 text-sm text-ink-muted max-w-3xl flex flex-col gap-4">
          <p>
            <strong className="text-ink">How this is built.</strong> Every price
            range below comes from each company&apos;s own published, tiered
            per-unit pricing — not an average smoothed into false precision.
            Shipping is estimated using each company&apos;s stated flat fee or
            free-shipping threshold; a few figures (marked) are approximate
            where a brand&apos;s exact shipping policy wasn&apos;t independently
            confirmed.
          </p>
          <p>
            <strong className="text-ink">What this doesn&apos;t include:</strong>{" "}
            promotional discount codes (often 15–50% off a first order), snacks
            and add-ons ordered separately, or the two-separate-account shipping
            some brands require when a household runs both an infant and a
            toddler product line at once.
          </p>
          <p>
            This tool is for planning, not a live quote. Confirm current
            pricing directly with each company before committing to a
            subscription.
          </p>
        </footer>
      </div>
    </main>
  );
}
