// Pure index bookkeeping for wiring SlideSidebar into EditorPage.jsx.
// `currentSlideIndex` there is a position, not an id, so every sidebar
// action that mutates `deck.slides` needs to work out, from the
// pre-dispatch slide list, where the slide the user cares about (usually
// whichever one is currently open) will land - kept here as pure functions
// so the bookkeeping itself is unit-tested independent of React/dispatch.

// Simulates deckReducer's REORDER_SLIDES splice and returns where `targetId`
// ends up afterwards.
export function reorderedIndexOf(slides, fromIndex, toIndex, targetId) {
  const ids = slides.map((s) => s.id);
  const [moved] = ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, moved);
  return ids.indexOf(targetId);
}

// Where `currentSlideIndex` should move to after deleting the slide at
// `deletedIndex` (deckReducer's DELETE_SLIDE just filters it out and
// renumbers - the array shifts left by one past that point).
export function indexAfterDelete(deletedIndex, currentSlideIndex, slidesLengthBeforeDelete) {
  if (deletedIndex === currentSlideIndex) {
    return Math.min(deletedIndex, slidesLengthBeforeDelete - 2);
  }
  if (deletedIndex < currentSlideIndex) {
    return currentSlideIndex - 1;
  }
  return currentSlideIndex;
}

// Where a new slide inserted after `afterSlideId` (deckReducer's ADD_SLIDE
// with `afterSlideId`) lands, given the pre-dispatch slide list.
export function indexAfterInsert(slides, afterSlideId) {
  const afterIndex = slides.findIndex((s) => s.id === afterSlideId);
  return afterIndex === -1 ? slides.length : afterIndex + 1;
}
