# SDD ledger — plan: docs/superpowers/plans/2026-09-19-theme-token-system.md

## Pre-flight conflict scan

Spec: no separate spec file reachable beyond the plan's own "Spec" line
(pasted brief in the conversation history, not a file on disk) +
`docs/superpowers/specs/2026-09-19-editor-v2-architecture-principles.md`
§5/§8, which the plan already quotes/paraphrases into its Global Constraints.
Both were read by the controller when writing the plan; the plan text itself
is treated as the authoritative task-level spec since the pasted brief isn't
a file.

Pairwise file/interface overlap:

| Task A | Task B | Shared surface | Check | Finding |
|---|---|---|---|---|
| 1 (themeTokens.js) | 2 (deckReducer SET_DECK_THEME) | none directly — reducer only checks `theme.colors` shape, doesn't import themeTokens | Reducer test constructs its own plain `{id, colors}` object, doesn't need Task 1's module | Clean |
| 1 (themeTokens.js) | 3 (deckSchema migration) | `normalizeTheme` produced by 1, consumed by 3 | Signature `normalizeTheme(value) -> full theme object`, idempotent | Clean — Task 3's step 3 imports it correctly, test in Task 1 already asserts idempotency Task 3 depends on |
| 1 (themeTokens.js) | 5 (EditorPage wiring) | `THEME_REGISTRY`, `getTheme`, `DEFAULT_THEME_ID`, `themeToRootStyle` | Same export names used in both | Clean |
| 2 (SET_DECK_THEME) | 5 (EditorPage wiring) | dispatch shape `{type:"SET_DECK_THEME", theme}` | Task 5 Step 4 dispatches exactly that shape with `getTheme(themeId)` as `theme`, which always has `.colors` | Clean |
| 3 (deckSchema) | 5 (EditorPage wiring) | `deck.theme` shape by the time `EditorPageBody` renders | Task 5 Step 3 comment asserts "deck.theme is always a full structured theme by the time it reaches this component" — true for the `deckId` path (goes through `migrateDeck`) AND the no-`deckId` path (Task 5 Step 2 makes `buildSeedDeck` use `getTheme(...)` directly) | Clean, but noted as a load-bearing assumption: Task 5 Step 2 MUST land before Step 3 relies on it. Plan already orders them this way inside the same task. |
| 4 (RichText style prop) | 6 (layouts use style=) | `style` prop forwarded by RichText, consumed by every layout | Task 6 code blocks all pass `style={{fontFamily: ...}}` to `<RichText>` | Clean — Task 6 depends on Task 4 landing first; plan's task ORDER already has 4 before 6 |
| 5 (EditorPage LayoutPicker prop removal) | existing `LayoutPicker` component | Task 5 Step 6 removes the `theme={currentTheme}` prop pass-through | Plan explicitly documents (Task 5 preamble) that this prop was already inert (`themes[theme]` keyed by an object, always undefined) — controller verified this by reading current EditorPage.jsx lines 3732-3772/4194-4200 before writing the plan | Clean, self-consistent |
| 6 (layouts) | CtaLayout.test.jsx (existing) | Task 6 Step 8 adds a new test to the same file Task 6 Step 7 rewrites the component for | Existing test only asserts text content (heading/body/button text), never color — verified by controller reading the file before writing plan | Clean |
| 7 (widgets + freeElementFactory defaults) | existing `FreeElementInteraction.integration.test.jsx` | `WIDGET_DEFAULTS.shape/divider/icon` lose their hardcoded `fill`/`color` keys | That integration test exercises drag/resize/duplicate/layering, not default color assertions (controller read status doc §1c description of that test's scope) | Clean — plan Task 7 Step 6 explicitly calls this out as the thing to verify |
| 8 (status doc) | all prior tasks | doc narrative describes Tasks 1-7's actual behavior | Task 8 leaves `<FILL IN ACTUAL COUNT>` placeholders deliberately, with an explicit instruction not to commit them unfilled | Ruling: this is intentional per the "Final check" section, not a plan defect — the SDD implementer for Task 8 must run the suite itself and fill real numbers before committing. Will hold Task 8 to this in its brief. |

Self-consistency (each task's own tests vs. its own code):

- Task 1: tests reference `getTheme`, `normalizeTheme`, `themeToCssVars`, `themeToRootStyle`, `THEME_REGISTRY`, `DEFAULT_THEME_ID` — all match the implementation code block's exports. Clean.
- Task 2: tests reference `deckReducer(deck, {type:"SET_DECK_THEME", theme})` — matches the added case. Clean.
- Task 3: tests reference `migrateDeck`, `serializeDeck`, `CURRENT_SCHEMA_VERSION` from `./deckSchema`, and `getTheme`/`DEFAULT_THEME_ID` from `./theme/themeTokens` — matches Task 1's module path (`src/components/new/deck/theme/themeTokens.js`, imported from `deckSchema.js` at `./theme/themeTokens` — same directory, correct relative path). Clean.
- Task 4: test uses `screen.getByRole("heading", {level: 1})` — matches `as="h1"` producing an `<h1>` tag. Clean.
- Task 5: no new tests (EditorPage.jsx has none today per repo structure) — Step 9 runs the existing suite + build + lint as the verification gate instead. Consistent with the file's existing test-free status.
- Task 6: each layout's default-content test functions are untouched; only CtaLayout gets a new assertion. Import paths (`../RichText`) unchanged. Clean.
- Task 7: new `ThemeDefaults.test.jsx` imports `createWidget` from `../freeElementFactory` (two dirs up from `widgets/`) — correct relative path since the test file lives in `widgets/`. Clean.
- Task 8: doc-only, no tests. Clean by construction.

**Ruling (pre-flight):** No blocking conflicts found. The scan surfaced one
already-intentional placeholder (Task 8's fill-in-actual-numbers) and one
load-bearing intra-task ordering dependency (Task 5 Steps 2→3) that the
plan already sequences correctly. Proceeding to Task 1 with no plan
amendments.

## Task log

Task 1: complete (commits 019a4a8..0bc5084, review clean)

Task 2 review: Needs fixes. Reviewer found commit 2fd2de0 bundles an
unrequested `cloneBackground()`/DUPLICATE_SLIDE fix + its test alongside
the SET_DECK_THEME work; implementer's self-review claimed "no changes to
other reducer cases", which is false against this diff.
Controller verified independently: `git show 0bc5084:.../deckReducer.js`
has NO `cloneBackground` — confirms this content is genuinely new in
2fd2de0, not a false-positive from git history the reviewer misread.
Ruling: this is legitimate carry-forward of already-documented Sub-project
#5 work (EDITOR-V2-STATUS.md §1d already describes this exact
"Duplicate slide background-by-reference fix" as implemented) that was
sitting as UNCOMMITTED working-tree changes before this plan's Task 1 even
started (confirmed: this worktree's `git status` showed
deckReducer.js/deckReducer.test.js as modified-but-uncommitted at session
start, before any SDD task ran). The implementer's `git add` on the two
files it was told to touch swept up those pre-existing uncommitted hunks
along with its own edit — not fabrication, but the report's "no changes to
other reducer cases" line is inaccurate and must not stand as-is. Fix:
split 2fd2de0 into two commits — (a) the pre-existing cloneBackground fix
+ its test, described honestly as carrying forward already-uncommitted
Sub-project #5 work, and (b) SET_DECK_THEME + its 3 tests only, matching
the brief exactly. Cost if wrong: a slightly less clean commit boundary
between two already-approved-content changes — not a correctness risk
either way, since both changes are individually sound and reviewed.
Dispatching fix round 1/5 to the same implementer (agent a0a229f07c866f593).

**INCIDENT during fix round 1:** the Task 2 implementer's fix (splitting
commit 2fd2de0 into two) also ran a `git stash` (visible in
`git fsck --dangling` as commit c442ff2 "untracked files on
editor-deck-model: 2fd2de0 ...", created 2026-09-19 21:07:39) that captured
ALL 22 untracked files in the repo — including this plan's own file
(`docs/superpowers/plans/2026-09-19-theme-token-system.md`) and every
untracked source file from the already-completed sub-projects #3/#5
(SlideSidebar.jsx, useFreeElementInteraction.js, freeElementFactory.js,
deckSchema.js, all of widgets/, DeckListPage.jsx, deckApi.js, etc.) — and
never restored it (`git stash list` was empty; the entry itself was
dropped/cleared even though the underlying commit object survived,
undiscovered until the controller went to generate a re-review package and
found the plan file missing with a clean `git status`).

Recovery (verified safe, read-only against git history — no force/reset used):
1. `git fsck --full --dangling` located the dangling stash commit.
2. Confirmed via `git ls-tree -r --name-only c442ff2` that it contained
   exactly the 22 missing files, nothing more/less.
3. `git archive c442ff2 | tar -x -C .` extracted every file from that
   tree straight to disk (does not touch the git index/HEAD, so files
   land back in their original untracked state).
4. Verified restoration: `git status --short` now matches the exact
   untracked-file set from session start; `freeElementFactory.js` content
   verified byte-for-byte identical to what the controller read during
   plan-writing orientation, before any task was dispatched.
5. Ran full suite post-recovery: 89/94 passing, 5 failing — all 5 in
   `FreeElementInteraction.integration.test.jsx`. Confirmed via
   `git log --all -- <that file> <its deps>` that these files have NEVER
   been part of any commit (always untracked) and neither Task 1 nor
   Task 2's commits touch them — so this 5-test failure is pre-existing,
   inherited exactly as it was before this SDD session started, NOT a
   regression from this plan's work. Out of scope for the Theme Token
   System plan to fix (unrelated subsystem — free-element drag/resize/
   duplicate/layer/delete interaction engine, sub-project #3/#5 territory).
   Flagging for the user; not entering this plan's fix loop.

**Ruling:** No data was permanently lost — full recovery confirmed byte-
for-byte. Going forward, every implementer dispatch for the remainder of
this plan will include an explicit instruction not to run `git stash`,
`git clean`, `git reset --hard`, or any other command that can silently
orphan or discard untracked files, and to use `git add -p`/targeted
`git add <file>` plus `git commit --amend` or sequential commits for any
future commit-history cleanup instead of stash-based workflows. Surfacing
this to the user now before continuing, per the destructive-action stop
condition, even though full recovery was already achieved.

Task 2: fix round 1/5 (1 addressed, 0 open — commit split for honest scoping ADDRESSED, no new breakage; commits 2fd2de0..01d4d65)
Task 2: complete (commits 0bc5084..01d4d65, review clean after fix round 1)

Task 3: complete (commits 01d4d65..74e48e0, review clean — 100 tests/20 files; disclosed deviation from brief's literal 'dark' default to DEFAULT_THEME_ID, verified correct against brief's own test)

Task 4: complete (commits 74e48e0..fdcab67, review clean — 101 tests/20 files)

Task 5: complete (commits fdcab67..0144ac2, review clean — 2 disclosed brief/reality divergences (no buildSeedDeck fn; single outer div not two) independently re-verified correct by reviewer via fresh greps; 101 tests/20 files, build OK, lint clean on touched files)

Task 6: complete (commits 0144ac2..b5932b6, review clean — all 7 layouts match brief exactly, 102 tests/20 files)

Task 7: complete (commits b5932b6..92f22d7, review clean — 109 tests/21 files; deferred minor: 5 widget/factory files show as first-time git commits since they were previously uncommitted from earlier sub-project work, not a defect in this task)

Task 8: fix round 1/5 (2 addressed, 0 open — theme self-contradiction in §3 removed, 3 stale 94/19 test counts updated to 109/21, no new breakage; commits b1e6bd1..be03360)
Task 8: complete (commits 92f22d7..be03360, review clean after fix round 1)

## Final whole-branch review (019a4a8..be03360, opus)

Verdict: Ready with fixes. 2 Critical, 3 Important, 5 Minor found; npm test 109/21 pristine, npm build OK, eslint clean on touched files — reviewer independently re-verified.

Ruling (Critical #2 — uncommitted sub-project #1/#3/#5 files, HEAD wouldn't build standalone from a fresh clone): NOT entering this plan's fix loop. This is pre-existing worktree state from before this SDD session started (confirmed: these exact files were untracked/modified at session start, inherited from the earlier stash-recovery incident logged above under Task 2). It spans other sub-projects' scope (persistence, free-element interaction, slide sidebar) that the pasted brief explicitly told this session NOT to expand into ("Do not spend this task rewriting persistence or sidebar functionality"). Committing ~12 unrelated files under this plan's fix wave would misattribute other sub-projects' work to the Theme Token System plan. Surfacing to the user as a required decision rather than silently fixing. Cost if wrong: a fresh clone of this branch does not build until this is resolved — a real merge blocker, but one predating and outside this plan.

Ruling (Critical #1 — free-element widgets from Task 7 unreachable at runtime because FreeElementLayer doesn't import FreeElementRenderer): NOT wiring FreeElementRenderer into FreeElementLayer in this fix wave — that wiring touches the free-element interaction engine, which the brief's §18 says not to rewrite "unless Theme integration exposes a concrete bug," and the gap is pre-existing (already disclosed, unchanged, in status doc §3: "widgets... not yet referenced anywhere"). Fixing via documentation clarification only (§1e's free-element paragraph gets a "not yet on the live render path — see §3" caveat), not a code wire-up. Cost if wrong: free elements keep rendering a hardcoded placeholder regardless of theme until sub-project #3/#5's remaining integration work wires FreeElementRenderer in; the theme token layer itself is correct and ready for that wiring when it happens.

Dispatching ONE fix subagent for the in-scope items: Important #3 (stale autosave claim), Important #4 (stale SlideSidebar claim), Important #5 (defensive normalizeTheme guard before themeToRootStyle — one-line footgun fix), Minor #10 (stale DUPLICATE_SLIDE §4 bullet), plus Critical #1's doc-only caveat. Parking Minor #6/7/8/9 as deferred (not load-bearing, no dependent task).

Final review: fix round 1/1 (5 addressed, 0 open — doc autosave/SlideSidebar/free-element-reachability claims corrected, stale DUPLICATE_SLIDE bullet removed, defensive normalizeTheme() guard added; no new breakage; commits be03360..24ee78a)
Final review: complete with 2 parked Critical findings (uncommitted sub-project #1/#3/#5 files predating this session — HEAD would not build from a clean clone; free-element widgets from Task 7 not wired into FreeElementLayer at runtime — pre-existing gap, already disclosed in status doc §3, doc caveat added). Both surfaced to user, not fixed in this plan's scope. All 8 plan tasks + final review complete. Plan HEAD: 24ee78a
