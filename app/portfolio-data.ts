export const categories = [
  "All work",
  "Portraits",
  "Brands",
  "Weddings",
  "Places",
  "Motion",
];
export type Project = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  images: string[];
  alt: string;
  idea: string;
  approach: string;
  output: string;
  packageId: string;
  reelId?: string;
};
export const projects: Project[] = [
  {
    id: "sunroom",
    title: "THE SUNROOM",
    category: "Portraits",
    subtitle: "A study in natural presence.",
    images: ["portrait", "portrait2"],
    alt: "Sunlit fashion portrait of a woman beside the sea",
    idea: "What happens when the light becomes part of the portrait? This concept explores warmth, quiet confidence, and the space around a person.",
    approach:
      "A visual direction built around natural light, open compositions, and a balance of close portraits and environmental frames. The reference images depict independent stock subjects.",
    output:
      "Proposed portrait story: a small, consistent image collection for personal, editorial, or creative use.",
    packageId: "portrait",
  },
  {
    id: "objects",
    title: "OBJECTS & SHADOWS",
    category: "Brands",
    subtitle: "Small details. A distinct point of view.",
    images: ["product", "product2"],
    alt: "Perfume bottle styled with red flowers and fruit against a textured wall",
    idea: "A product has a shape, a texture, and a mood. This still-life concept uses those details to suggest a world around the object.",
    approach:
      "A reference study in intentional color, negative space, and directional light. Independent products and brands shown in stock photos are not studio clients or endorsements.",
    output:
      "Proposed brand image set: a hero composition, detail frames, and alternate crops agreed around a campaign brief.",
    packageId: "brand",
  },
  {
    id: "vows",
    title: "BETWEEN THE VOWS",
    category: "Weddings",
    subtitle: "For the moments that happen in between.",
    images: ["wedding"],
    alt: "Bride and groom standing together outdoors in soft daylight",
    idea: "The gesture before the pose. The conversation between the planned moments. A wedding story direction that leaves room for people to be themselves.",
    approach:
      "A documentary-inspired mood with a mix of environmental portraits and quieter details. This stock reference illustrates the direction, not an actual wedding commission.",
    output:
      "Proposed event story: a curated image narrative with coverage, guest count, locations, and permissions agreed in advance.",
    packageId: "event",
  },
  {
    id: "concrete",
    title: "CONCRETE POETRY",
    category: "Places",
    subtitle: "Finding rhythm in the built world.",
    images: ["architecture", "architecture2"],
    alt: "Concrete building facade with strong geometric lines and reflections",
    idea: "Light turns a facade into a sequence of shapes. This architecture concept looks for repetition, scale, and the unexpected rhythm of a place.",
    approach:
      "A graphic approach to viewpoints, geometry, and the relationship between a building and the light around it. Reference photographs may show different structures.",
    output:
      "Proposed architectural image story for a space, publication, or brand; access and usage rights are scoped first.",
    packageId: "brand",
  },
  {
    id: "tide",
    title: "THE SHAPE OF WATER",
    category: "Places",
    subtitle: "A quieter conversation with the coast.",
    images: ["hero", "coast"],
    alt: "Ocean surf breaking over a dark rocky coastline from above",
    idea: "A coastline changes without ever quite becoming something else. This concept follows texture, rhythm, and the meeting of water and land.",
    approach:
      "A landscape direction that moves between broad shapes and small patterns. These independent stock images form an inspiration study rather than a single commissioned shoot.",
    output:
      "Proposed travel or landscape story: a cohesive photographic direction with location, access, travel, and licensing considered.",
    packageId: "custom",
    reelId: "tide-film",
  },
  {
    id: "after-hours",
    title: "AFTER HOURS",
    category: "Motion",
    subtitle: "The city, in another rhythm.",
    images: ["city-poster"],
    alt: "City lights and moving traffic seen from an elevated viewpoint at night",
    idea: "A short motion study in pace and light. Streets become lines, and passing traffic becomes a pattern.",
    approach:
      "A two-second source clip is presented as a short stock motion study. The player can replay it; this is not a complete commissioned film or a studio production claim.",
    output:
      "Proposed motion direction: a location-led sequence developed into a scoped film brief, edit plan, and deliverable list.",
    packageId: "motion",
    reelId: "city-film",
  },
  {
    id: "long-way",
    title: "THE LONG WAY HOME",
    category: "Places",
    subtitle: "Distance, light, and a different perspective.",
    images: ["mountain", "coast"],
    alt: "Layered mountain ridges in a dramatic black and white landscape",
    idea: "Sometimes the story is the space between destinations. This landscape concept pays attention to scale and the changing layers of the view.",
    approach:
      "A visual study of depth, atmosphere, and a deliberate pace. Stock references represent independent places and photographers.",
    output:
      "Proposed personal or travel editorial, with route, access, weather alternatives, and usage agreed in the brief.",
    packageId: "custom",
  },
  {
    id: "quiet-confidence",
    title: "QUIET CONFIDENCE",
    category: "Portraits",
    subtitle: "A presence that does not need to shout.",
    images: ["portrait2", "portrait"],
    alt: "Editorial fashion portrait exploring light and geometric shadows",
    idea: "An editorial direction built around simplicity, shape, and a clear sense of presence.",
    approach:
      "A considered balance of setting, pose, and available light. Independent reference images are inspiration for the style, not photos made by COMMON LIGHT.",
    output:
      "Proposed editorial portraits with styling, location, selection, and retouching defined around the subject.",
    packageId: "portrait",
  },
];
export const reels = [
  {
    id: "tide-film",
    title: "TIDELINES",
    subtitle: "Water, in its own time.",
    src: "/videos/tide.mp4",
    poster: "tide-poster",
    length: "00:43",
    credit: "Edward Ng / #edwardng.raw",
    source:
      "https://www.pexels.com/video/drone-shot-of-waves-in-the-sea-12657904/",
    description:
      "Aerial stock footage of waves creating patterns across the sea. An independent motion reference by Edward Ng, presented with credit; not a COMMON LIGHT production.",
  },
  {
    id: "city-film",
    title: "AFTER HOURS",
    subtitle: "A brief pulse of the city.",
    src: "/videos/city.mp4",
    poster: "city-poster",
    length: "00:02",
    credit: "Amar Preciado",
    source: "https://www.pexels.com/video/traffic-in-city-at-night-10822505/",
    description:
      "A two-second stock timelapse of city traffic and lights. A short motion reference by Amar Preciado, not a complete commissioned film or a COMMON LIGHT production.",
  },
];
export const packages = [
  {
    id: "portrait",
    name: "THE PORTRAIT SESSION",
    type: "Portraits",
    price: 6500,
    duration: "Up to 2 hours",
    intro:
      "For personal stories, creative profiles, and a fresh point of view.",
    includes: [
      "Pre-shoot conversation",
      "One location",
      "15 edited images",
      "Private digital delivery",
    ],
    addons: ["extra-hour", "retouch"],
  },
  {
    id: "brand",
    name: "THE BRAND STORY",
    type: "Brands & places",
    price: 18000,
    duration: "Up to 4 hours",
    intro: "For products, spaces, and brands with something to say.",
    includes: [
      "Creative brief & shot plan",
      "One-location shoot",
      "30 edited images",
      "Delivery formats agreed in brief",
    ],
    addons: ["extra-hour", "retouch", "social-cut"],
  },
  {
    id: "event",
    name: "THE OCCASION",
    type: "Weddings & events",
    price: 28000,
    duration: "Up to 6 hours",
    intro: "For the planned moments and everything that happens between.",
    includes: [
      "Coverage planning conversation",
      "One photographer",
      "150 edited images",
      "Private digital gallery",
    ],
    addons: ["extra-hour", "second-camera"],
  },
  {
    id: "motion",
    name: "THE MOTION STUDY",
    type: "Film & motion",
    price: 22000,
    duration: "Up to 4 hours capture",
    intro: "For a story that needs a little movement.",
    includes: [
      "Creative brief & storyboard",
      "One-location filming",
      "One 30–60 second film",
      "One revision round",
    ],
    addons: ["extra-hour", "social-cut", "second-camera"],
  },
];
export const addons = [
  { id: "extra-hour", name: "Additional capture hour", price: 2500 },
  { id: "retouch", name: "Five additional image edits", price: 1500 },
  { id: "social-cut", name: "One short social edit", price: 3500 },
  { id: "second-camera", name: "Second camera operator", price: 6000 },
];
export const budgetOptions = [
  "Under ₱10,000",
  "₱10,000–₱25,000",
  "₱25,000–₱50,000",
  "₱50,000+",
  "Let’s discuss",
];
export const statuses = ["New", "In conversation", "Proposal sent", "Closed"];
export const money = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
export function estimate(packageId: string, selected: string[]) {
  const p = packages.find((p) => p.id === packageId);
  if (!p) return null;
  if (
    new Set(selected).size !== selected.length ||
    selected.some((id) => !p.addons.includes(id))
  )
    return null;
  return (
    p.price +
    selected.reduce((n, id) => n + addons.find((a) => a.id === id)!.price, 0)
  );
}
export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function maxDate(now = new Date()) {
  const d = new Date(todayISO(now) + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 365);
  return d.toISOString().slice(0, 10);
}
export function validDate(value: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return (
    !Number.isNaN(d.getTime()) &&
    d.toISOString().slice(0, 10) === value &&
    value >= todayISO(now) &&
    value <= maxDate(now)
  );
}
export const testimonials = [
  {
    name: "Sample client A",
    type: "Portrait brief",
    quote:
      "The direction felt clear from the very first conversation. There was room for ideas, and room to be ourselves.",
  },
  {
    name: "Sample client B",
    type: "Brand brief",
    quote:
      "A thoughtful process that made the visual direction feel connected to the story we wanted to tell.",
  },
  {
    name: "Sample client C",
    type: "Event brief",
    quote:
      "We loved the attention to the little moments. The kind of details you want to come back to.",
  },
];
