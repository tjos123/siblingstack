import type {
  Category,
  DiaperSubtype,
  FeedSubtype,
  HealthSubtype,
  MilestonePreset,
  RoutinePreset,
  SleepSubtype,
} from "./types";

export type Tone =
  | "sage"
  | "terracotta"
  | "ochre"
  | "sky"
  | "plum"
  | "moss"
  | "rose";

export interface ToneClasses {
  chip: string;
  iconWrap: string;
  solid: string;
  ring: string;
  text: string;
  soft: string;
}

export const TONES: Record<Tone, ToneClasses> = {
  sage: {
    chip: "bg-sage/15 text-sage-read",
    iconWrap: "bg-sage/15 text-sage-read",
    solid: "bg-sage text-forest",
    ring: "ring-sage/40",
    text: "text-sage-read",
    soft: "bg-sage/10",
  },
  terracotta: {
    chip: "bg-terracotta/15 text-terracotta-read",
    iconWrap: "bg-terracotta/15 text-terracotta-read",
    solid: "bg-terracotta text-white",
    ring: "ring-terracotta/40",
    text: "text-terracotta-read",
    soft: "bg-terracotta/10",
  },
  ochre: {
    chip: "bg-ochre/25 text-ochre-read",
    iconWrap: "bg-ochre/25 text-ochre-read",
    solid: "bg-ochre text-forest",
    ring: "ring-ochre/50",
    text: "text-ochre-read",
    soft: "bg-ochre/15",
  },
  sky: {
    chip: "bg-sky/15 text-sky-read",
    iconWrap: "bg-sky/15 text-sky-read",
    solid: "bg-sky text-white",
    ring: "ring-sky/40",
    text: "text-sky-read",
    soft: "bg-sky/10",
  },
  plum: {
    chip: "bg-plum/15 text-plum-read",
    iconWrap: "bg-plum/15 text-plum-read",
    solid: "bg-plum text-white",
    ring: "ring-plum/40",
    text: "text-plum-read",
    soft: "bg-plum/10",
  },
  moss: {
    chip: "bg-moss/15 text-moss-read",
    iconWrap: "bg-moss/15 text-moss-read",
    solid: "bg-moss text-white",
    ring: "ring-moss/40",
    text: "text-moss-read",
    soft: "bg-moss/10",
  },
  rose: {
    chip: "bg-rose/15 text-rose-read",
    iconWrap: "bg-rose/15 text-rose-read",
    solid: "bg-rose text-white",
    ring: "ring-rose/40",
    text: "text-rose-read",
    soft: "bg-rose/10",
  },
};

export interface CategoryMeta {
  id: Category;
  label: string;
  action: string;
  tone: Tone;
  blurb: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  feed: {
    id: "feed",
    label: "Feed",
    action: "Log feed",
    tone: "sage",
    blurb: "Breast, bottle, solids or combo",
  },
  pump: {
    id: "pump",
    label: "Pump",
    action: "Log pump",
    tone: "ochre",
    blurb: "Left & right output volume",
  },
  diaper: {
    id: "diaper",
    label: "Diaper",
    action: "Log diaper",
    tone: "sky",
    blurb: "Wet, dirty, both or dry",
  },
  sleep: {
    id: "sleep",
    label: "Sleep",
    action: "Log sleep",
    tone: "plum",
    blurb: "Naps and night sleep",
  },
  routine: {
    id: "routine",
    label: "Routine",
    action: "Log routine",
    tone: "ochre",
    blurb: "Tummy time, bath, play",
  },
  milestone: {
    id: "milestone",
    label: "Milestone",
    action: "Log milestone",
    tone: "plum",
    blurb: "First smiles & big wins",
  },
  growth: {
    id: "growth",
    label: "Growth",
    action: "Log growth",
    tone: "moss",
    blurb: "Weight, length, head size",
  },
  health: {
    id: "health",
    label: "Health",
    action: "Log health",
    tone: "rose",
    blurb: "Meds, vaccines, temperature",
  },
};

export const FEED_SUBTYPE_LABELS: Record<FeedSubtype, string> = {
  breastfeeding: "Breast",
  bottlefeed: "Bottle",
  solid: "Solids",
  combo: "Combo",
};

export const DIAPER_SUBTYPE_LABELS: Record<DiaperSubtype, string> = {
  wet: "Wet",
  dirty: "Dirty",
  both: "Both",
  dry: "Dry",
};

export const SLEEP_SUBTYPE_LABELS: Record<SleepSubtype, string> = {
  nap: "Nap",
  night: "Night",
};

export const HEALTH_SUBTYPE_LABELS: Record<HealthSubtype, string> = {
  medical: "Medical",
  vaccine: "Vaccine",
  temperature: "Temp",
  medication: "Medicine",
};

export const ROUTINE_PRESET_LABELS: Record<RoutinePreset, string> = {
  tummy_time: "Tummy Time",
  bath: "Bath",
  outdoor_play: "Outdoor Play",
  massage: "Massage",
  reading: "Reading",
};

export const MILESTONE_PRESET_LABELS: Record<MilestonePreset, string> = {
  first_smile: "First Smile",
  first_laugh: "First Laugh",
  first_rollover: "First Rollover",
  first_word: "First Word",
  first_tooth: "First Tooth",
  first_steps: "First Steps",
  sitting_up: "Sitting Up",
  crawling: "Crawling",
};

export const TIMELINE_FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "feed", label: "Feed" },
  { id: "pump", label: "Pump" },
  { id: "diaper", label: "Diaper" },
  { id: "sleep", label: "Sleep" },
  { id: "routine", label: "Routine" },
  { id: "milestone", label: "Milestone" },
  { id: "growth", label: "Growth" },
  { id: "health", label: "Health" },
];

export const HISTORY_FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "feed", label: "Feed" },
  { id: "diaper", label: "Diaper" },
  { id: "sleep", label: "Sleep" },
  { id: "growth", label: "Growth" },
  { id: "health", label: "Health" },
];

export function subtypeLabel(
  category: Category,
  subtype: string | null | undefined,
): string {
  if (!subtype) return CATEGORY_META[category].label;
  switch (category) {
    case "feed":
      return FEED_SUBTYPE_LABELS[subtype as FeedSubtype] ?? subtype;
    case "diaper":
      return DIAPER_SUBTYPE_LABELS[subtype as DiaperSubtype] ?? subtype;
    case "sleep":
      return SLEEP_SUBTYPE_LABELS[subtype as SleepSubtype] ?? subtype;
    case "health":
      return HEALTH_SUBTYPE_LABELS[subtype as HealthSubtype] ?? subtype;
    case "routine":
      return ROUTINE_PRESET_LABELS[subtype as RoutinePreset] ?? subtype;
    case "milestone":
      return MILESTONE_PRESET_LABELS[subtype as MilestonePreset] ?? subtype;
    default:
      return subtype;
  }
}
