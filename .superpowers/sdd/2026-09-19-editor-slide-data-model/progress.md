# SDD ledger — plan: docs/superpowers/plans/2026-09-19-editor-slide-data-model.md

## Pre-flight scan

Setup ruling: created worktree manually (git worktree fallback) instead of
via EnterWorktree — EnterWorktree defaults to branching fresh off
origin/main, which lacks this repo's 2 local-only commits (spec + plan)
and would have silently dropped the pre-existing uncommitted WIP diff the
user asked to build on. Committed that WIP as a snapshot commit on main
first, then branched `editor-deck-model` from local main HEAD so nothing
is lost. Ruling: safe — worktree branches from the correct base; nothing
downstream depends on how the worktree was created.

Cross-task interface check (one row per task pair sharing a file/interface):

| Tasks | Shared interface | Check | Result |
|---|---|---|---|
| 2 -> 4 | createSlide/createFreeElement/LAYOUT_IDS | reducer imports match Task 2 exports | OK |
| 2,3 -> 4 | getContentMapper | reducer's SET_SLIDE_LAYOUT calls match Task 3 signature | OK |
| 4 -> 5 | deckReducer | DeckProvider wraps it via useReducer, no signature mismatch | OK |
| 6 -> 8-14 | RichText props (value/onChange/as/className/toolbarButtons) | every layout's usage matches Task 6's signature | OK |
| 2,7,8-14 -> 15 | SlideRegistry shape {component, defaultContent} | matches SlideCanvas's getRegistryEntry usage | OK |
| 3 -> 4,11 | paragraphToBulletsMapper output shape vs Media3PointsLayout's unconditional `content.media.url` read | **CONFLICT**: mapper produced `{heading, points}` with no `media` key; Task 11 always reads `content.media.url` -> would throw after a problem->media-3points layout switch | **Ruling: fixed in plan text** — mapper now defaults/passes through `media`, plan's Task 3 test + implementation code blocks updated accordingly before any dispatch. Cost if this ruling is wrong: trivial — it only adds a field, doesn't remove plan-mandated behavior. |
| 15 (Task 7 test) -> 15 (Steps 1-2) | deferred test execution ordering | plan explicitly sequences SlideRegistry test to pass only after layouts (8-14) exist | OK, intentional per plan text |
| 16 -> 5,7,8-14,15 | import surface EditorPage needs (DeckProvider, useDeck, SlideCanvas, createDeck/createSlide, default*Content x7, getRegistryEntry) | every name exists with matching export shape from its producing task | OK |

Self-consistency (each task's own tests vs its own code): no other issues found — one pass through every task's test file against its implementation code block.

Scan conclusion: one conflict found and ruled on above; all other rows clean.

Task 1: complete (commits 92bfb1c..5717d1c, review clean)

Task 2: complete (commits 5717d1c..06c773e, review clean)

Task 3: fix round 1/5 (1 addressed, 0 open; commits c3d127d..a42ba08)
Task 3: complete (commits 06c773e..a42ba08, 1 fix round)

Task 4: minor (deferred): deckReducer.js:79 DUPLICATE_SLIDE copies background by reference, not cloned (harmless today, all writes replace background wholesale)
Task 4: minor (deferred): deckReducer.js:121-130,144-153 UPDATE_SLIDE_CONTENT/ADD_FREE_ELEMENT don't validate shape of action.content/action.element before merging (not covered by brief's tests, doesn't throw)
Task 4: complete (commits a42ba08..2f01301, review clean, 2 minors deferred)

Task 5: complete (commits 2f01301..d8be42d, review clean)

Task 6: minor (deferred): RichText.test.jsx:91 unused `vi` import from vitest
Task 6: complete (commits d8be42d..e49a754, review clean, 1 minor deferred)

Task 8: complete (commits e49a754..cfae58e, review clean)

Task 9: complete (commits cfae58e..2b7bc21, review clean)

Task 10: Ruling: implementer reported DONE_WITH_CONCERNS — "puts the media column first..." test failed with `.flex > *:last-child` returning null. Controller independently reproduced outside the fix loop: rendering two React trees via RTL's render() in the same test without cleanup() between them corrupts jsdom/nwsapi's :last-child matching for the second tree (confirmed via isolated debug script; unrelated to MediaDescriptionLayout's actual DOM output, which is correct in both cases). This is a plan defect (flaky test I authored), not an implementer defect. Fixed the plan text (added `cleanup` import and a `cleanup()` call between the two renders in Task 10's test) and committed the fix to the plan. Cost if this ruling is wrong: low — the fix only adds test isolation, doesn't change assertions or the component under test.

Task 10: Ruling: first review dispatch used wrong BASE (8fff712 instead of 2b7bc21), scoping the diff to only the test-fix commit and hiding the actual component implementation. Redispatched a corrected full review before accepting the task; no code impact, controller process error only.
Task 10: minor (deferred): MediaDescriptionLayout.jsx:97 alt="media" instead of alt="" per brief (cosmetic, untested, no functional effect)
Task 10: complete (commits 2b7bc21..a9148e9, 1 pre-review fix for a plan-authored flaky test + corrected review, 1 minor deferred)

Task 11: complete (commits a9148e9..beeae04, review clean)

Task 12: minor (deferred): MetricsGridLayout.jsx:48 uses array index as React key (safe for current fixed-size, non-reorderable list)
Task 12: complete (commits beeae04..8b3fde2, review clean, 1 minor deferred)

Task 13: minor (deferred): TeamGridLayout.jsx:40 uses array index as React key (same pattern as Task 12, acceptable for current fixed list)
Task 13: complete (commits 8b3fde2..904934a, review clean, 1 minor deferred)

Task 14: complete (commits 904934a..363c525, review clean)

Ruling: Controller process gap discovered before dispatching Task 15 — Task 7 (SlideRegistry.js + SlideRegistry.test.js) was never actually dispatched to an implementer; the controller generated its brief but moved straight to Tasks 8-14 without creating the files. No downstream task was built on Task 7's files (Tasks 8-14 are standalone layout files with no SlideRegistry dependency), so no rework is needed — dispatching Task 7 now, in its correct plan order, before Task 15. Cost if this ruling is wrong: none — Task 7 simply runs now instead of earlier, with no different outcome since all its dependencies (the 7 layouts) are already complete.

Task 7: complete (commits 363c525..14c98b4, review clean, dispatched late per process-gap ruling above)

Task 15: fix round 1/5 (1 addressed, 0 open; commits 10a20d1..dee5c2e)
Task 15: complete (commits 14c98b4..dee5c2e, 1 fix round)

Task 16: minor (deferred): scroll-stack slide animation removed as unavoidable consequence of SlideCanvas rendering only currentSlide (disclosed, out of scope per spec, navigation preserved); worth a TODO for a future animation task
Task 16: minor (deferred): EditorPage.jsx uiTheme local state seeded once from deck.theme with no sync mechanism (harmless, no reducer action exists yet to change deck.theme)
Task 16: complete (commits dee5c2e..3a487a6, review clean, 2 minors deferred)

ALL 16 TASKS COMPLETE. Proceeding to final whole-branch review.

Final whole-branch review (opus): "Ready to merge: With fixes." Found 1 Critical (RichText stale-closure + controlled/uncontrolled DOM conflict causing silent edit loss in 3 array-based layouts), 4 Important (per-slide background dead/regressed to local state, SET_SLIDE_LAYOUT can crash on unregistered layout pairs, uncommitted scratch test file inflating count, aspect-ratio mismatch between SlideCanvas and layouts), 6 Minor. Dispatched ONE consolidated fix wave (opus) covering the Critical, all 4 Important, and 2 explicitly-triaged-fix-now Minors; deferred the rest per reviewer's own triage.

Final-review fix wave re-review: all 7 original findings ADDRESSED and verified (including independent reproduction of the Critical RichText regression-proof). One NEW Critical breakage introduced by the fix: SlideCanvas.jsx renders <LayoutComponent> (and EditorPage.jsx renders <SlideCanvas>) with no `key={slide.id}`, so navigating between two slides that share a layout type does not remount RichText — the now-uncontrolled editor keeps showing the previous slide's HTML, and the next keystroke dispatches UPDATE_SLIDE_CONTENT for the NEW slide's id carrying the OLD slide's text, silently corrupting data. Reachable today via the ordinary "add slide" flow (adding a second slide of any existing layout).
Ruling: real and load-bearing, not parked. Per skill's Final Review process, no second fix wave is dispatched here — surfacing to the user via finishing-a-development-branch instead of unilaterally patching or re-dispatching. Recommended minimal fix (not yet applied): add `key={slide.id}` to the `<LayoutComponent>` render in SlideCanvas.jsx. Cost if this ruling is wrong (i.e. if it should have been auto-fixed): none — the fix is trivial and pending, cost is only a small delay for user confirmation before applying it.

User directed fixing the open Critical bug (missing key on SlideCanvas's layout component) before finishing, rather than deferring it. Applied `key={slide.id}`, added a regression test that reproduces the exact reported bug, verified it fails without the fix (queryByText("Slide One") found the stale element) and passes with it. Full suite 64/64 passing, build clean. Committed c91d1e1.

PLAN COMPLETE. All 16 tasks done, final review's fix wave applied and re-reviewed, the one residual Critical bug fixed and verified per user direction. Ready for finishing-a-development-branch.
