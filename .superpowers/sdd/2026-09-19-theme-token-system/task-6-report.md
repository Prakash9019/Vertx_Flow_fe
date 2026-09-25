# Task 6 Implementation Report: Theme Token System Refactor

## Status: DONE

Completed on 2026-09-19.

## What Was Implemented

### File-by-File Summary

#### 1. TitleLayout.jsx
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to h1 RichText component
- Added `style={{ fontFamily: "var(--theme-body-font)" }}` to subtitle p RichText component
- No other changes; defaults and structure unchanged

#### 2. ProblemLayout.jsx
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to h1 RichText heading
- Added `style={{ fontFamily: "var(--theme-body-font)" }}` to div RichText body
- Toolbar buttons and structure preserved

#### 3. MediaDescriptionLayout.jsx
- Replaced hardcoded `bg-white/10` placeholder with `style={{ backgroundColor: "var(--theme-surface-muted)" }}` in MediaColumn
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to h2 heading
- Added `style={{ fontFamily: "var(--theme-body-font)" }}` to body text
- MediaColumn internal structure fully matches brief

#### 4. Media3PointsLayout.jsx
- Replaced hardcoded `bg-white/10` placeholder with `style={{ backgroundColor: "var(--theme-surface-muted)" }}` when media.url is empty
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to h2 heading
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to h3 point titles
- Added `style={{ fontFamily: "var(--theme-body-font)" }}` to point body text
- Update logic unchanged

#### 5. MetricsGridLayout.jsx
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to h2 heading
- Added `style={{ fontFamily: "var(--theme-heading-font)", color: "var(--theme-primary)" }}` to metric value div (now uses theme primary color)
- Added `style={{ fontFamily: "var(--theme-body-font)" }}` to metric label
- Grid and update logic unchanged

#### 6. TeamGridLayout.jsx
- Replaced hardcoded `bg-white/10` placeholder with `style={{ backgroundColor: "var(--theme-surface-muted)" }}` for missing member photo
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to member name
- Added `style={{ fontFamily: "var(--theme-body-font)" }}` to member role
- Update logic unchanged

#### 7. CtaLayout.jsx
- **Major change**: Replaced `className="mt-10 inline-block px-8 py-3 rounded-full bg-teal-400 text-black font-semibold"` with:
  - `className="mt-10 inline-block px-8 py-3 rounded-full font-semibold"`
  - `style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-background)", fontFamily: "var(--theme-body-font)" }}`
- Button now uses theme tokens exclusively (removed hardcoded teal-400 and text-black)
- Added `style={{ fontFamily: "var(--theme-heading-font)" }}` to h1 heading
- Added `style={{ fontFamily: "var(--theme-body-font)" }}` to body text

#### 8. CtaLayout.test.jsx
- Added new regression test: `"styles the button from theme tokens instead of a hardcoded color"`
- Test verifies:
  - Button className does NOT contain `bg-teal-400` or `text-black`
  - Button style.backgroundColor equals `"var(--theme-primary)"`
  - Button style.color equals `"var(--theme-background)"`
- Pre-existing test "renders heading, body, and the button label" preserved unchanged

## Test Results

**Command:** `npm test -- --run`

**Results:**
```
Test Files  20 passed (20)
     Tests  102 passed (102)
```

**Details:**
- Baseline: 101 tests / 20 files (confirmed by brief)
- After changes: 102 tests / 20 files
- **Delta:** +1 test (the new CtaLayout regression test)
- **Status:** All tests pass, no pre-existing tests broken
- **Verification:** Ran full suite with `--run` flag to ensure deterministic results

All pre-existing layout tests continue to pass. Verified that none of the existing layout tests assert on color (only on text content), as stated in the brief.

## Files Modified

```
src/components/new/deck/layouts/TitleLayout.jsx
src/components/new/deck/layouts/ProblemLayout.jsx
src/components/new/deck/layouts/MediaDescriptionLayout.jsx
src/components/new/deck/layouts/Media3PointsLayout.jsx
src/components/new/deck/layouts/MetricsGridLayout.jsx
src/components/new/deck/layouts/TeamGridLayout.jsx
src/components/new/deck/layouts/CtaLayout.jsx
src/components/new/deck/layouts/CtaLayout.test.jsx
```

## Self-Review Findings

### Code Quality
- ✓ All style props use consistent inline object syntax: `style={{ ... }}`
- ✓ All theme variable names match the brief exactly (no typos):
  - `--theme-heading-font`
  - `--theme-body-font`
  - `--theme-primary`
  - `--theme-background`
  - `--theme-surface-muted`
- ✓ No extra abstractions introduced; each layout focuses solely on its layout logic
- ✓ Prop signatures unchanged; no interface breaking changes

### Alignment with Dependencies
- ✓ Task 1 themeTokens.js: Variables used are all defined there
- ✓ Task 4 RichText.jsx: All RichText components now use optional `style` prop correctly forwarded
- ✓ Task 5 EditorPage.jsx: `themeToRootStyle(deckTheme)` already applies CSS custom properties to root; layouts inherit them

### Hardcoded Color Replacement
- ✓ TitleLayout: No hardcoded colors to replace (only typography)
- ✓ ProblemLayout: No hardcoded colors to replace (only typography)
- ✓ MediaDescriptionLayout: Replaced `bg-white/10` → `var(--theme-surface-muted)` ✓
- ✓ Media3PointsLayout: Replaced `bg-white/10` → `var(--theme-surface-muted)` ✓
- ✓ MetricsGridLayout: Added `color: "var(--theme-primary)"` to metric value (was implicit before)
- ✓ TeamGridLayout: Replaced `bg-white/10` → `var(--theme-surface-muted)` ✓
- ✓ CtaLayout: Replaced `bg-teal-400 text-black` → `var(--theme-primary)` + `var(--theme-background)` ✓

### Test Coverage
- ✓ New test in CtaLayout.test.jsx validates the button styling change precisely
- ✓ Test catches regression if hardcoded colors are reintroduced
- ✓ No other layout tests touched (they don't assert on color anyway)

### Completeness Check (against brief Step 9)
- ✓ All 7 layouts refactored (Steps 1-7)
- ✓ CtaLayout.test.jsx updated with regression test (Step 8)
- ✓ Full suite passes (Step 9)
- ✓ Commit created with specified message (Step 10)

## Issues or Concerns

**None.** All current layout files matched the brief's snapshots exactly (modulo the missing theme tokens, which is what we added). No divergences found that required reconciliation.

## Commit

**SHA:** b5932b6  
**Message:** `refactor: layouts consume theme tokens via CSS variables instead of hardcoded colors`

Full commit includes:
- 8 files changed
- 40 insertions, 4 deletions
- Co-authored by Claude Haiku 4.5

---

**Task 6 Status:** ✓ COMPLETE  
All refactoring done, tests passing, commit landed.
