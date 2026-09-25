### Task 4: `RichText` accepts an optional `style` prop

**Files:**
- Modify: `src/components/new/deck/RichText.jsx`
- Test: `src/components/new/deck/RichText.test.jsx`

**Interfaces:**
- Produces: `<RichText style={{...}} .../>` renders that `style` on the underlying tag, exactly like `className` already does. No other prop or behavior changes.
- Consumed by: Task 6 (layouts set `style={{ fontFamily: "var(--theme-heading-font)" }}` etc. on heading/body `RichText` fields).

- [ ] **Step 1: Write the failing test**

Add to `src/components/new/deck/RichText.test.jsx` (check the existing file first for its exact render/setup helper and reuse it — the shape below matches the component's public API):

```js
it("forwards a style prop to the underlying element", () => {
  render(<RichText as="h1" className="text-5xl" style={{ fontFamily: "Georgia, serif" }} value="Hi" onChange={() => {}} />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading.style.fontFamily).toBe("Georgia, serif");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/new/deck/RichText.test.jsx`
Expected: FAIL — `heading.style.fontFamily` is `""` because `style` is never forwarded.

- [ ] **Step 3: Write the implementation**

In `src/components/new/deck/RichText.jsx`:

```js
export function RichText({ value, onChange, toolbarButtons, className, style, as: Tag = "div" }) {
```

and:

```js
  return <Tag ref={ref} className={className} style={style} />;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/new/deck/RichText.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/new/deck/RichText.jsx src/components/new/deck/RichText.test.jsx
git commit -m "feat: RichText forwards an optional style prop"
```

---

