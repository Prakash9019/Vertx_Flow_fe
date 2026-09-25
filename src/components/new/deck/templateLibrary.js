import { getRegistryEntry } from "./SlideRegistry";
import { createDeck, createSlide } from "./deckTypes";
import { getTheme, DEFAULT_THEME_ID } from "./theme/themeTokens";

// A curated set of ready-made multi-slide decks - Chronicle-style "start
// from a template" gallery (see EDITOR-V2-STATUS.md's template-library gap).
// Each slide's content is authored directly against its layout's own shape
// (no semantic mapping needed, unlike Remix/AI storyline - this content was
// never in any other layout's shape to begin with).
export const TEMPLATE_LIBRARY = [
  {
    id: "startup-pitch",
    name: "Startup Pitch",
    category: "Pitch Deck",
    description: "A founder's pitch: problem, solution, traction, team, ask.",
    slides: [
      { layout: "title", content: { title: "Your Company Name", subtitle: "A one-line pitch that hooks investors" } },
      { layout: "problem", content: { heading: "The Problem", body: "<p>Describe the pain point your customers face today.</p>" } },
      {
        layout: "media-description",
        content: {
          heading: "The Solution",
          body: "<p>Explain how your product solves that problem.</p>",
          media: { url: "", type: "image" },
          mediaPosition: "left",
        },
      },
      {
        layout: "metrics-grid",
        content: {
          heading: "Traction",
          metrics: [
            { value: "0", label: "Monthly active users" },
            { value: "$0", label: "MRR" },
            { value: "0%", label: "Month-over-month growth" },
          ],
        },
      },
      {
        layout: "team-grid",
        content: { heading: "Team", members: [{ photoUrl: "", name: "Founder Name", role: "CEO & Co-founder" }] },
      },
      { layout: "cta", content: { heading: "Join Us", body: "<p>Describe the round you're raising and why.</p>", buttonLabel: "Get in touch" } },
    ],
  },
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Marketing",
    description: "Announce a new product: what it is, key features, how to get it.",
    slides: [
      { layout: "title", content: { title: "Introducing [Product Name]", subtitle: "Launching [date]" } },
      {
        layout: "media-3points",
        content: {
          heading: "Key Features",
          media: { url: "", type: "image" },
          points: [
            { title: "Feature One", body: "What makes it useful." },
            { title: "Feature Two", body: "What makes it different." },
            { title: "Feature Three", body: "What makes it easy to adopt." },
          ],
        },
      },
      {
        layout: "media-description",
        content: {
          heading: "How It Works",
          body: "<p>Walk through the core workflow in a sentence or two.</p>",
          media: { url: "", type: "image" },
          mediaPosition: "right",
        },
      },
      { layout: "cta", content: { heading: "Try It Today", body: "<p>Tell people where to get started.</p>", buttonLabel: "Get started" } },
    ],
  },
  {
    id: "company-overview",
    name: "Company Overview",
    category: "Business",
    description: "A general-purpose company overview for partners or new hires.",
    slides: [
      { layout: "title", content: { title: "Company Overview", subtitle: "What we do and why it matters" } },
      { layout: "problem", content: { heading: "Our Mission", body: "<p>Describe the mission in one or two sentences.</p>" } },
      {
        layout: "metrics-grid",
        content: {
          heading: "By the Numbers",
          metrics: [
            { value: "0", label: "Customers" },
            { value: "0", label: "Countries" },
            { value: "0", label: "Team members" },
          ],
        },
      },
      {
        layout: "team-grid",
        content: { heading: "Leadership", members: [{ photoUrl: "", name: "Name", role: "Title" }] },
      },
      { layout: "cta", content: { heading: "Let's Talk", body: "<p>How people should reach out.</p>", buttonLabel: "Contact us" } },
    ],
  },
];

// Mirrors buildDeckFromStoryline's tail (storylineToDeck.js) - createSlide
// per slide, createDeck around them - but skips the normalize/denormalize
// step entirely: a template's content is already shaped for its own layout.
// The defaultContent() merge is defensive (lets a template omit a field and
// still produce a structurally-complete slide), the same guard
// SET_SLIDE_LAYOUT's reducer branch applies.
export function buildDeckFromTemplate(template) {
  const slides = template.slides.map((slideSpec, index) => {
    const entry = getRegistryEntry(slideSpec.layout);
    const content = { ...entry.defaultContent(), ...slideSpec.content };
    return createSlide({ layout: slideSpec.layout, content, order: index });
  });

  return createDeck({
    title: template.name,
    theme: getTheme(DEFAULT_THEME_ID),
    slides,
  });
}
