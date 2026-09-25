// Roadmap #14: Change Case tool. Deterministic, pure HTML-aware text-case
// transforms - operates only on text nodes (via a detached DOM), so tags/
// attributes/formatting inside the selection are preserved exactly; only the
// visible characters change case.

function transformTextNodes(html, transformFn) {
  if (!html) return html;
  const container = document.createElement("div");
  container.innerHTML = html;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node = walker.nextNode();
  while (node) {
    textNodes.push(node);
    node = walker.nextNode();
  }
  textNodes.forEach((textNode) => {
    textNode.textContent = transformFn(textNode.textContent);
  });
  return container.innerHTML;
}

export function toUpperCase(html) {
  return transformTextNodes(html, (text) => text.toUpperCase());
}

export function toLowerCase(html) {
  return transformTextNodes(html, (text) => text.toLowerCase());
}

export function toTitleCase(html) {
  return transformTextNodes(html, (text) =>
    text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  );
}

// Sentence case needs to know whether it's at the start of a sentence, which
// can span across text-node boundaries (e.g. a <b>bold</b> word mid-sentence)
// - so unlike the other transforms, this tracks a running "capitalize next
// letter" flag across every text node in the same walk, rather than treating
// each node in isolation.
export function toSentenceCase(html) {
  if (!html) return html;
  const container = document.createElement("div");
  container.innerHTML = html;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let capitalizeNext = true;
  let node = walker.nextNode();
  while (node) {
    let result = "";
    for (const char of node.textContent.toLowerCase()) {
      if (capitalizeNext && /[a-z0-9]/i.test(char)) {
        result += char.toUpperCase();
        capitalizeNext = false;
      } else {
        result += char;
      }
      if (/[.!?]/.test(char)) capitalizeNext = true;
    }
    node.textContent = result;
    node = walker.nextNode();
  }
  return container.innerHTML;
}

// Keyed by the Froala dropdown option id used in RichText.jsx's custom
// "changeCase" command, so the command's callback can look up the right
// transform without a switch statement of its own.
export const CASE_TRANSFORMS = {
  uppercase: toUpperCase,
  lowercase: toLowerCase,
  titlecase: toTitleCase,
  sentencecase: toSentenceCase,
};
