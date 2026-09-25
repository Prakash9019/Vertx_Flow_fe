### Task 5: Wire the theme registry into `EditorPage.jsx` and deck creation

**Files:**
- Modify: `src/components/new/EditorPage.jsx`
- Modify: `src/components/new/DeckListPage.jsx`

**Interfaces:**
- Consumes: `THEME_REGISTRY`, `getTheme`, `DEFAULT_THEME_ID`, `themeToRootStyle` from `./deck/theme/themeTokens` (Task 1); dispatches `{ type: "SET_DECK_THEME", theme }` (Task 2).
- Produces: no new exports; `EditorPageBody` no longer has `uiTheme`/`currentTheme` local state — `deck.theme` (already a full structured object by the time it reaches `EditorPageBody`, via `buildSeedDeck` or `migrateDeck`) is the only theme source.

**Do not touch:** the `themes`, `themes2`, `backgrounds` consts or any of the ~3,700 lines of legacy dead layout components (`TheChallangePage`, `TitleOnlyPage`, `LayoutPicker`'s internal `themes[theme]`/`backgrounds[background]` lookups, etc.) — they are pre-existing dead code, explicitly deferred for deletion (status doc §4), and `LayoutPicker`'s `theme`/`background` props are already inert today (the caller passes a resolved theme *object* into a lookup keyed by *string id*, so `themes[theme]` is already always `undefined` before this change — confirm this by reading current `EditorPage.jsx` lines 3732-3772 and 4194-4200 before editing). This task only removes the now-dead `theme={currentTheme}` prop being passed into `LayoutPicker`, it does not touch `LayoutPicker` itself.

- [ ] **Step 1: Add the theme registry import**

Add to the top imports of `src/components/new/EditorPage.jsx`, alongside the other `./deck/...` imports:

```js
import { THEME_REGISTRY, getTheme, DEFAULT_THEME_ID, themeToRootStyle } from "./deck/theme/themeTokens";
```

- [ ] **Step 2: Update `buildSeedDeck` to use a structured theme**

Change:

```js
export function buildSeedDeck(title = "Untitled Deck") {
  return createDeck({
    title,
    theme: "dark",
```

to:

```js
export function buildSeedDeck(title = "Untitled Deck") {
  return createDeck({
    title,
    theme: getTheme(DEFAULT_THEME_ID),
```

- [ ] **Step 3: Remove `uiTheme` local state and the old `currentTheme` derivation**

In `EditorPageBody`, delete:

```js
  // NOTE: building a richer background/theme *picker UI* is out of scope (see the
  // plan's "Explicitly out of scope"). The existing background swatches, however,
  // write through to the deck model: per-slide background lives on
  // `currentSlide.background` and is applied by `SlideCanvas`.
  // `uiTheme` is still local - no reducer action exists for deck theme yet.
  const [uiTheme, setUiTheme] = useState(deck.theme || 'dark');
```

and delete the line:

```js
  const currentTheme = themes[uiTheme] || themes.dark;
```

Add in its place (same location, right before the `useEffect` that follows it):

```js
  // `deck.theme` is always a full structured theme by the time it reaches
  // this component - either from `buildSeedDeck` (new/local deck) or
  // `migrateDeck` (loaded from the backend) - so no normalization happens
  // here; this component only ever reads/dispatches it.
  const deckTheme = deck.theme;
```

- [ ] **Step 4: Replace `handleThemeChange` to dispatch `SET_DECK_THEME`**

Change:

```js
  const handleThemeChange = (newTheme) => {
    setUiTheme(newTheme);
    setShowThemeModal(false);
  };
```

to:

```js
  const handleThemeChange = (themeId) => {
    dispatch({ type: "SET_DECK_THEME", theme: getTheme(themeId) });
    setShowThemeModal(false);
  };
```

- [ ] **Step 5: Apply the theme as CSS vars on the outermost wrapper**

Find the top-level return's outermost wrapper (the element with `className="font-sans antialiased h-screen w-screen flex overflow-hidden"`, which is a sibling of `<SlideSidebar>` and the `.App` div — applying the vars here, not on `.App`, means `SlideSidebar`'s thumbnails can also read `var(--theme-*)` later without another wiring pass). Add a `style` prop:

```jsx
    <div className="font-sans antialiased h-screen w-screen flex overflow-hidden" style={themeToRootStyle(deckTheme)}>
```

Then remove the now-dead dynamic classes from the `.App` div right below it:

```jsx
      <div className={`App relative flex-1 h-screen overflow-hidden ${currentTheme.bg} ${currentTheme.text}`}>
```

becomes:

```jsx
      <div className="App relative flex-1 h-screen overflow-hidden">
```

(`SlideSidebar` keeps its own explicit dark chrome background classes unchanged — those are more specific than the inherited wrapper background, so its appearance does not change.)

- [ ] **Step 6: Stop passing the now-meaningless `theme` prop to `LayoutPicker`**

Change:

```jsx
      {showLayoutPicker && (
        <LayoutPicker
          theme={currentTheme}
          onSelect={handleAddSlide}
          onClose={() => { setShowLayoutPicker(false); setInsertAfterSlideId(null); }}
        />
      )}
```

to:

```jsx
      {showLayoutPicker && (
        <LayoutPicker
          onSelect={handleAddSlide}
          onClose={() => { setShowLayoutPicker(false); setInsertAfterSlideId(null); }}
        />
      )}
```

- [ ] **Step 7: Rewrite the Theme Selection Modal to render the registry**

Replace the entire `{/* Theme Selection Modal */}` block (the `showThemeModal &&` block with the 6 hardcoded `Dark`/`Light`/`Warm`/`DeepPurple`/`DarkBlue`/`EarthStone` buttons) with:

```jsx
      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-[#0b2d2b] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-6 text-white/90">Choose a Theme</h2>
            <div className="flex gap-4 flex-wrap justify-center max-w-2xl">
              {THEME_REGISTRY.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl w-28 h-28 border-2 transition-colors ${
                    deckTheme.id === themeOption.id ? "border-teal-400" : "border-transparent hover:border-teal-400/50"
                  }`}
                  style={{ backgroundColor: themeOption.colors.background }}
                >
                  {deckTheme.id === themeOption.id && (
                    <Check size={16} className="absolute top-2 right-2" style={{ color: themeOption.colors.primary }} />
                  )}
                  <div className="w-10 h-10 rounded-full mb-2" style={{ backgroundColor: themeOption.colors.primary }} />
                  <span className="text-sm font-medium" style={{ color: themeOption.colors.text }}>
                    {themeOption.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-6 px-5 py-2 bg-white/10 text-white/90 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
```

(`Check` is already imported at the top of the file — `import { ImageIcon, Check } from 'lucide-react';`.)

- [ ] **Step 8: Update `DeckListPage.jsx`'s create-deck default theme**

Read `src/components/new/DeckListPage.jsx` around its `deckApi.createDeck(...)` call. Add the import:

```js
import { getTheme, DEFAULT_THEME_ID } from "./deck/theme/themeTokens";
```

Change:

```js
const res = await deckApi.createDeck({ title: "Untitled Deck", theme: "dark", slides: [] });
```

to:

```js
const res = await deckApi.createDeck({ title: "Untitled Deck", theme: getTheme(DEFAULT_THEME_ID), slides: [] });
```

- [ ] **Step 9: Run the full test suite and the build**

Run: `npm test`
Expected: PASS, no regressions.

Run: `npm run build`
Expected: succeeds with no new errors.

Run: `npx eslint src/components/new/EditorPage.jsx src/components/new/DeckListPage.jsx`
Expected: no new lint errors introduced by this task (pre-existing lint errors in the untouched legacy dead-code section, if any, are unrelated and unchanged).

- [ ] **Step 10: Commit**

```bash
git add src/components/new/EditorPage.jsx src/components/new/DeckListPage.jsx
git commit -m "feat: wire theme registry into EditorPage - live SET_DECK_THEME picker, CSS vars"
```

---

