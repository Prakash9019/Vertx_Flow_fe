// An element the browser/Froala/contentEditable already gives its own
// keyboard behavior to - global shortcuts (deck undo/redo, free-element
// delete/arrow-move) must not hijack keys while the user is mid text-edit
// inside one of these.
export function isEditableTarget(target) {
  if (!target || typeof target.closest !== "function") return false;
  return !!target.closest('[contenteditable="true"], input, textarea, .fr-element');
}
