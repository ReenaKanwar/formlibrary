# 📦 React UI Component Library — Team Task Board

> **Project Name:** `formLibrary`
> **Goal:** Build a reusable, production-structured React component library using Vite in library mode, export a `Button` component, and verify it end-to-end in a companion test app.
> **Workspace Root:** `C:\Users\Rajiv Kumar\Desktop\my\Lib\`

---

## 🗂️ Project Structure Overview

```
Lib/
├── formLibrary/          ← The component library (Phase 1)
│   ├── src/
│   │   ├── index.js                  ← Barrel export (exports all components)
│   │   └── components/
│   │       └── Button/
│   │           ├── Button.js         ← Functional React component
│   │           ├── Button.css        ← Scoped styles
│   │           └── index.js          ← Re-exports Button
│   ├── dist/                         ← Auto-generated on build (DO NOT edit manually)
│   ├── vite.config.js                ← Vite library mode config
│   ├── package.json
│   └── README.md
│
└── my-ui-test-app/         ← Vite + React consumer app (Phase 2)
    ├── src/
    │   └── App.jsx                   ← Imports & renders Button from the library
    └── package.json
```

---

## ✅ Tasks

---

### Task 1 — Initialize the Library Project (`formLibrary`)

**Status:** `[x] Done`
**Assignee:** Rajiv

**Description:**
Set up the `formLibrary` project from scratch inside `C:\Users\Rajiv Kumar\Desktop\my\Lib\formLibrary\`. This is the root library package — it does NOT use a scaffold tool; it is created manually.

**Steps:**
1. Create the folder `formLibrary/` inside the workspace root (`Lib/`).
2. Inside `formLibrary/`, create a `package.json` with the following configuration:
   - `"name": "formLibrary"`
   - `"version": "1.0.0"`
   - `"main": "dist/formLibrary.umd.js"`
   - `"module": "dist/formLibrary.es.js"`
   - `"exports"` field pointing to both ES (`import`) and UMD (`require`) builds
   - `"peerDependencies"`: `react` and `react-dom` (both `^18.0.0`)
   - `"devDependencies"`: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
   - `"scripts"`: `"build": "vite build"`, `"dev": "vite"`
3. Run `npm install` inside `formLibrary/` to install dev dependencies.

**Output Criteria:**
- `formLibrary/package.json` exists and is valid JSON.
- `node_modules/` folder is created after `npm install`.

---

### Task 2 — Configure Vite for Library Mode

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 1

**Description:**
Create `vite.config.js` inside `formLibrary/`. This configures Vite to build the project as a **library** (not a regular app), outputting ES and UMD bundles. This is the most critical config step.

**Steps:**
1. Create `formLibrary/vite.config.js` with the following settings:
   - Import `{ defineConfig }` from `vite` and `react` from `@vitejs/plugin-react`.
   - Set `build.lib`:
     - `entry`: `src/index.js` (the barrel file)
     - `name`: `MyUILibrary` (UMD global name)
     - `fileName`: `(format) => \`formLibrary.\${format}.js\``
     - `formats`: `['es', 'umd']`
   - Set `build.rollupOptions.external`: `['react', 'react-dom']` — **This is critical.** It prevents React from being bundled into the library so consumers use their own React instance.
   - Set `build.rollupOptions.output.globals`: `{ react: 'React', 'react-dom': 'ReactDOM' }`
2. Add `plugins: [react()]` to the config.

**Output Criteria:**
- `vite.config.js` exists.
- Running `npm run build` in `formLibrary/` generates a `dist/` folder containing `.es.js`, `.umd.js`, and optionally `style.css`.

---

### Task 3 — Create the Barrel Entry File (`src/index.js`)

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 1

**Description:**
Create the library's central export file at `formLibrary/src/index.js`. This file aggregates and re-exports all components so consumers only need to import from `formLibrary`.

**Steps:**
1. Create the folder structure: `formLibrary/src/`.
2. Create `formLibrary/src/index.js` with the following content:
   ```js
   export { Button } from './components/Button';
   ```
3. As new components are added in the future, each one gets a new export line here.

**Output Criteria:**
- `src/index.js` exists and exports `Button`.
- No default export — only named exports.

---

### Task 4 — Build the `Button` Component (`Button.js`)

**Status:** `[ ] Pending`
**Assignee:** ___________

**Depends On:** Task 3

**Description:**
Create the core `Button` React component. It must be a pure, stateless UI component — no app-specific logic. It supports two visual variants via the `variant` prop.

**Steps:**
1. Create the folder: `formLibrary/src/components/Button/`.
2. Create `Button.js` as a **named export** functional component with the following props:
   - `label` (string) — The text displayed inside the button.
   - `onClick` (function) — Callback for click events.
   - `variant` (string) — Either `'primary'` or `'secondary'`. Defaults to `'primary'`.
   - `className` (string) — Optional extra CSS class passed by consumer.
   - `style` (object) — Optional inline styles passed by consumer.
3. The component renders a `<button>` element:
   - Applies `btn` as the base class always.
   - Applies `btn-primary` or `btn-secondary` based on `variant`.
   - Merges consumer's `className` onto the class string.
   - Spreads `style` onto the button's `style` attribute.
   - Binds `onClick` to the button's `onClick` event.
   - Renders `{label}` as the button text.

**Example Output:**
```jsx
export function Button({ label, onClick, variant = 'primary', className = '', style = {} }) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  );
}
```

**Output Criteria:**
- Component is a named export (not default).
- Accepts all 5 props listed.
- Does not import from outside `Button/` folder (no cross-component dependencies yet).

---

### Task 5 — Style the `Button` Component (`Button.css`)

**Status:** `[ ] Pending`
**Assignee:** ___________

**Depends On:** Task 4

**Description:**
Create the CSS file for the `Button` component at `formLibrary/src/components/Button/Button.css`. Styles must be scoped using specific class names to avoid global leakage.

**Steps:**
1. Create `Button.css` inside `formLibrary/src/components/Button/`.
2. Import it at the top of `Button.js`: `import './Button.css';`
3. Implement the following CSS rules:

   **Base class `.btn`:**
   - `padding`: `10px 20px`
   - `border-radius`: `6px`
   - `cursor`: `pointer`
   - `font-size`: `14px`
   - `font-weight`: `600`
   - `border`: `2px solid transparent`
   - `transition`: `all 0.2s ease`

   **`.btn-primary`:**
   - `background-color`: a vibrant brand color (e.g., `#4f46e5`)
   - `color`: `#ffffff`
   - `border-color`: same as background

   **`.btn-primary:hover`:**
   - Slightly darker background (e.g., `#4338ca`)

   **`.btn-secondary`:**
   - `background-color`: `transparent`
   - `color`: brand color (e.g., `#4f46e5`)
   - `border-color`: brand color

   **`.btn-secondary:hover`:**
   - `background-color`: very light tint (e.g., `#ede9fe`)

**Output Criteria:**
- `Button.css` exists with all 5 rule blocks (base, primary, primary:hover, secondary, secondary:hover).
- `Button.js` imports `Button.css`.

---

### Task 6 — Create the Button Barrel (`components/Button/index.js`)

**Status:** `[ ] Pending`
**Assignee:** ___________

**Depends On:** Task 4

**Description:**
Create the `index.js` inside the `Button/` folder so that other files (like `src/index.js`) can import from the folder path `./components/Button` cleanly, without specifying the filename.

**Steps:**
1. Create `formLibrary/src/components/Button/index.js`.
2. Add only this line:
   ```js
   export { Button } from './Button';
   ```

**Output Criteria:**
- File exists and re-exports `Button` as a named export.
- `src/index.js` (from Task 3) can now resolve `'./components/Button'` without changes.

---

### Task 7 — Build the Library and Verify `dist/` Output

**Status:** `[ ] Pending`
**Assignee:** ___________

**Depends On:** Tasks 2, 3, 4, 5, 6

**Description:**
Run the Vite build to compile the library and verify the output artifacts are correct. This is the first integration validation step.

**Steps:**
1. Open a terminal in `formLibrary/`.
2. Run: `npm run build`
3. Verify the `dist/` folder is created with:
   - `formLibrary.es.js` — ES module bundle
   - `formLibrary.umd.js` — UMD bundle (for CommonJS consumers)
   - `style.css` — Bundled CSS (if Vite extracts it separately)
4. Open `formLibrary.es.js` and confirm:
   - `react` and `react-dom` are NOT inlined — they should appear as external imports.
   - The `Button` function is exported.

**Output Criteria:**
- `dist/` contains at minimum: `*.es.js`, `*.umd.js`.
- Build completes with no errors.
- React is not bundled inside the output files.

---

### Task 8 — Scaffold the Test App (`my-ui-test-app`)

**Status:** `[ ] Pending`
**Assignee:** ___________

**Depends On:** Task 7

**Description:**
Create a minimal Vite + React consumer application at `Lib/my-ui-test-app/`. This app exists solely to verify the library renders and works correctly in a real React project.

**Steps:**
1. Open a terminal in `C:\Users\Rajiv Kumar\Desktop\my\Lib\`.
2. Run:
   ```
   npx create-vite@latest my-ui-test-app --template react
   ```
3. Navigate into `my-ui-test-app/` and run `npm install`.
4. In `my-ui-test-app/package.json`, add the library as a local dependency:
   ```json
   "dependencies": {
     "formLibrary": "file:../formLibrary"
   }
   ```
5. Run `npm install` again to install the local library link.

**Output Criteria:**
- `my-ui-test-app/` folder exists with a working Vite React scaffold.
- `node_modules/formLibrary/` is present in the test app's `node_modules`.

---

### Task 9 — Integrate the Library into the Test App (`App.jsx`)

**Status:** `[ ] Pending`
**Assignee:** ___________

**Depends On:** Task 8

**Description:**
Update `my-ui-test-app/src/App.jsx` to import and render both button variants from `formLibrary`. This is the end-to-end rendering test.

**Steps:**
1. Open `my-ui-test-app/src/App.jsx`.
2. Replace its content with the following (or edit to include):
   ```jsx
   import { Button } from 'formLibrary';
   import 'formLibrary/dist/style.css';

   function App() {
     return (
       <div style={{ padding: '40px', display: 'flex', gap: '16px' }}>
         <Button
           label="Primary Button"
           variant="primary"
           onClick={() => alert('Primary clicked!')}
         />
         <Button
           label="Secondary Button"
           variant="secondary"
           onClick={() => alert('Secondary clicked!')}
         />
       </div>
     );
   }

   export default App;
   ```
3. Run `npm run dev` inside `my-ui-test-app/`.
4. Open the browser at `http://localhost:5173` (or the port Vite reports).

**Output Criteria:**
- Both buttons render visually on screen.
- `Primary Button` has a filled background.
- `Secondary Button` has an outlined/transparent style.
- Clicking each button triggers the correct `alert`.
- No console errors (especially no "multiple React instances" warning).

---

### Task 10 — Write the Library `README.md`

**Status:** `[ ] Pending`
**Assignee:** ___________

**Depends On:** Tasks 7, 9

**Description:**
Write a complete `README.md` inside `formLibrary/` so any developer (or their AI assistant) can install, use, and contribute to the library without needing to read internal source code.

**Sections to include:**

1. **Project Title & Description** — What `formLibrary` is.
2. **Installation**
   - Local (file-based): `"formLibrary": "file:../formLibrary"`
   - Future NPM (placeholder): `npm install formLibrary`
3. **CSS Import** — Add `import 'formLibrary/dist/style.css';` at app root.
4. **Usage Example** — Full code snippet showing both variants:
   ```jsx
   import { Button } from 'formLibrary';
   <Button label="Click Me" variant="primary" onClick={() => {}} />
   <Button label="Cancel" variant="secondary" onClick={() => {}} />
   ```
5. **Props Table** for `Button`:

   | Prop        | Type     | Default     | Description                        |
   |-------------|----------|-------------|------------------------------------|
   | `label`     | string   | —           | Button text                        |
   | `onClick`   | function | —           | Click event handler                |
   | `variant`   | string   | `'primary'` | `'primary'` or `'secondary'`       |
   | `className` | string   | `''`        | Extra CSS class                    |
   | `style`     | object   | `{}`        | Inline style overrides             |

6. **Build Command** — `npm run build` → outputs to `dist/`
7. **Local Testing Walkthrough** — Steps from Task 8 and 9 in condensed form.
8. **Contributing** — How to add a new component (create folder, add CSS, export from `src/index.js`).

**Output Criteria:**
- `formLibrary/README.md` contains all 8 sections.
- Props table is correctly formatted markdown.
- A new team member can set up and use the library by following the README alone.

---

## 📌 Task Dependency Map

```
Task 1 (Init Library)
  └── Task 2 (Vite Config)
  └── Task 3 (Barrel src/index.js)
       └── Task 4 (Button Component)
            ├── Task 5 (Button CSS)
            └── Task 6 (Button index.js)
                 └── Task 7 (Build & Verify dist/)
                      └── Task 8 (Scaffold Test App)
                           └── Task 9 (Integrate in Test App)
                                └── Task 10 (Write README)
```

---

## 🛠️ Tech Stack Summary (for AI assistants)

| Tool | Purpose |
|------|---------|
| **React 18** | UI component framework |
| **Vite** | Build tool (library mode) |
| **@vitejs/plugin-react** | JSX transform for Vite |
| **Vanilla CSS** | Component styling (no Tailwind, no CSS Modules) |
| **npm** | Package manager |
| **file: protocol** | Local dependency linking for test app |

> **Key Rule:** `react` and `react-dom` are **peerDependencies** — they must be externalized in `vite.config.js` and NOT bundled into the library output.

---

*Last updated: 2026-05-17 | Conversation ID: c9136ce0-d477-4af1-b120-388293b26c74*
