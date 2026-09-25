## Task 1: Add a test runner (Vitest + Testing Library)

**Files:**
- Create: `vitest.config.js`
- Create: `src/test/setup.js`
- Modify: `package.json` (devDependencies + `test` script)

**Interfaces:**
- Produces: `npm test` runs Vitest once; `npm run test:watch` runs it in watch mode. Every later task's tests assume these scripts exist.

- [ ] **Step 1: Install dependencies**

Run: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

- [ ] **Step 2: Create the Vitest config**

```js
// vitest.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
```

- [ ] **Step 3: Create the setup file**

```js
// src/test/setup.js
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add scripts to package.json**

Add under `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify the runner works with a throwaway test**

Create `src/test/smoke.test.js`:

```js
import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test`
Expected: 1 passed test.

- [ ] **Step 6: Delete the throwaway test and commit**

```bash
rm src/test/smoke.test.js
git add vitest.config.js src/test/setup.js package.json package-lock.json
git commit -m "test: add Vitest + Testing Library runner"
```

---

