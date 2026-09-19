// Owns the persisted deck shape and its migration chain. The backend stores
// `theme`/`slides` as opaque (Mixed) data precisely so this file - not a
// backend migration - is what evolves the deck shape over time.
import { normalizeTheme, DEFAULT_THEME_ID } from "./theme/themeTokens";

export const CURRENT_SCHEMA_VERSION = 2;

// Each entry migrates a raw deck FROM its key version TO key+1. Add v3 here
// (and bump CURRENT_SCHEMA_VERSION) rather than editing v1/v2 in place.
const MIGRATIONS = {
  1: (raw) => ({
    id: raw._id ?? raw.id,
    title: raw.title ?? 'Untitled Deck',
    theme: raw.theme ?? DEFAULT_THEME_ID,
    slides: raw.slides ?? [],
  }),
  // v1 decks had `theme` as a bare string (e.g. "dark"); this normalizes any
  // shape `theme` might already be in (bare string, partial object, or an
  // already-current object) into the full structured token shape.
  2: (deck) => ({
    ...deck,
    theme: normalizeTheme(deck.theme),
  }),
};

// Runs whenever a deck is loaded from the backend, before it reaches
// DeckProvider, so DeckProvider/deckReducer only ever see the current shape.
export function migrateDeck(rawDeck) {
  if (!rawDeck) return rawDeck;

  let version = rawDeck.schemaVersion ?? 1;
  let deck = rawDeck;

  while (version < CURRENT_SCHEMA_VERSION) {
    const migrate = MIGRATIONS[version];
    if (!migrate) {
      throw new Error(`deckSchema: no migration registered from version ${version}`);
    }
    deck = migrate(deck);
    version += 1;
  }

  const finalMigrate = MIGRATIONS[CURRENT_SCHEMA_VERSION];
  const migrated = finalMigrate ? finalMigrate(deck) : deck;

  return { ...migrated, schemaVersion: CURRENT_SCHEMA_VERSION };
}

// Inverse of migrateDeck: the in-app deck shape -> what the backend accepts.
export function serializeDeck(deck) {
  return {
    schemaVersion: deck.schemaVersion ?? CURRENT_SCHEMA_VERSION,
    title: deck.title,
    theme: deck.theme,
    slides: deck.slides,
  };
}
