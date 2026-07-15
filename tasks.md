# 📦 React UI Component Library — Team Task Board

> **Project Name:** `skemvora`
> **Goal:** Build a reusable, production-structured React component library using Vite in library mode, export a `Button` component, and verify it end-to-end in a companion test app.
> **Workspace Root:** `C:\Users\Rajiv Kumar\Desktop\my\Lib\`

---

## 🗂️ Project Structure Overview

```
Lib/
├── skemvora/          ← The component library (Phase 1 & 2)
│   ├── src/
│   │   ├── index.js                  ← Barrel export (exports all components)
│   │   └── components/
│   │       ├── Button/
│   │       │   ├── Button.js         ← Functional React component
│   │       │   ├── Button.css        ← Scoped styles
│   │       │   └── index.js          ← Re-exports Button
│   │       └── Form/                 ← [NEW] Reusable dynamic Form component
│   │           ├── Form.js           ← Functional React component
│   │           ├── Form.css          ← Scoped styles
│   │           └── index.js          ← Re-exports Form
│   ├── dist/                         ← Auto-generated on build (DO NOT edit manually)
│   ├── vite.config.js                ← Vite library mode config
│   ├── package.json
│   └── README.md
│
└── my-ui-test-app/         ← Vite + React consumer app (Phase 2)
    ├── src/
    │   └── App.jsx                   ← Imports & renders components from the library
    └── package.json
```

---

## ✅ Tasks

---

### Task 1 — Initialize the Library Project (`skemvora`)

**Status:** `[x] Done`
**Assignee:** Rajiv

**Description:**
Set up the `skemvora` project from scratch inside `C:\Users\Rajiv Kumar\Desktop\my\Lib\skemvora\`. This is the root library package — it does NOT use a scaffold tool; it is created manually.

**Steps:**
1. Create the folder `skemvora/` inside the workspace root (`Lib/`).
2. Inside `skemvora/`, create a `package.json` with the following configuration:
   - `"name": "skemvora"`
   - `"version": "1.0.0"`
   - `"main": "dist/skemvora.umd.js"`
   - `"module": "dist/skemvora.es.js"`
   - `"exports"` field pointing to both ES (`import`) and UMD (`require`) builds
   - `"peerDependencies"`: `react` and `react-dom` (both `^18.0.0`)
   - `"devDependencies"`: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
   - `"scripts"`: `"build": "vite build"`, `"dev": "vite"`
3. Run `npm install` inside `skemvora/` to install dev dependencies.

**Output Criteria:**
- `skemvora/package.json` exists and is valid JSON.
- `node_modules/` folder is created after `npm install`.

---

### Task 2 — Configure Vite for Library Mode

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 1

**Description:**
Create `vite.config.js` inside `skemvora/`. This configures Vite to build the project as a **library** (not a regular app), outputting ES and UMD bundles. This is the most critical config step.

**Steps:**
1. Create `skemvora/vite.config.js` with the following settings:
   - Import `{ defineConfig }` from `vite` and `react` from `@vitejs/plugin-react`.
   - Set `build.lib`:
     - `entry`: `src/index.js` (the barrel file)
     - `name`: `MyUILibrary` (UMD global name)
     - `fileName`: `(format) => \`skemvora.\${format}.js\``
     - `formats`: `['es', 'umd']`
   - Set `build.rollupOptions.external`: `['react', 'react-dom']` — **This is critical.** It prevents React from being bundled into the library so consumers use their own React instance.
   - Set `build.rollupOptions.output.globals`: `{ react: 'React', 'react-dom': 'ReactDOM' }`
2. Add `plugins: [react()]` to the config.

**Output Criteria:**
- `vite.config.js` exists.
- Running `npm run build` in `skemvora/` generates a `dist/` folder containing `.es.js`, `.umd.js`, and optionally `style.css`.

---

### Task 3 — Create the Barrel Entry File (`src/index.js`)

**Status:** `[x] Done`
**Assignee:** Rajiv

Create the library's central export file at `skemvora/src/index.js`. This file aggregates and re-exports all components so consumers only need to import from `skemvora`.

**Steps:**
1. Create the folder structure: `skemvora/src/`.
2. Create `skemvora/src/index.js` with the following content:
   ```js
   export { Button } from './components/Button';
   ```
3. As new components are added in the future, each one gets a new export line here.

**Output Criteria:**
- `src/index.js` exists and exports `Button`.
- No default export — only named exports.

---

### Task 4 — Build the `Button` Component (`Button.js`)

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 3

**Description:**
Create the core `Button` React component. It must be a pure, stateless UI component — no app-specific logic. It supports two visual variants via the `variant` prop.

**Steps:**
1. Create the folder: `skemvora/src/components/Button/`.
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

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 4

**Description:**
Create the CSS file for the `Button` component at `skemvora/src/components/Button/Button.css`. Styles must be scoped using specific class names to avoid global leakage.

**Steps:**
1. Create `Button.css` inside `skemvora/src/components/Button/`.
2. Import it at the top of `Button.jsx`: `import './Button.css';`
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
- `Button.jsx` imports `Button.css`.

---

### Task 6 — Create the Button Barrel (`components/Button/index.js`)

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 4

**Description:**
Create the `index.js` inside the `Button/` folder so that other files (like `src/index.js`) can import from the folder path `./components/Button` cleanly, without specifying the filename.

**Steps:**
1. Create `skemvora/src/components/Button/index.js`.
2. Add only this line:
   ```js
   export { Button } from './Button';
   ```

**Output Criteria:**
- File exists and re-exports `Button` as a named export.
- `src/index.js` (from Task 3) can now resolve `'./components/Button'` without changes.

---

### Task 7 — Build the Library and Verify `dist/` Output

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Tasks 2, 3, 4, 5, 6

**Description:**
Run the Vite build to compile the library and verify the output artifacts are correct. This is the first integration validation step.

**Steps:**
1. Open a terminal in `skemvora/`.
2. Run: `npm run build`
3. Verify the `dist/` folder is created with:
   - `skemvora.es.js` — ES module bundle
   - `skemvora.umd.js` — UMD bundle (for CommonJS consumers)
   - `style.css` — Bundled CSS (if Vite extracts it separately)
4. Open `skemvora.es.js` and confirm:
   - `react` and `react-dom` are NOT inlined — they should appear as external imports.
   - The `Button` function is exported.

**Output Criteria:**
- `dist/` contains at minimum: `*.es.js`, `*.umd.js`.
- Build completes with no errors.
- React is not bundled inside the output files.

---

### Task 8 — Scaffold the Test App (`my-ui-test-app`)

**Status:** `[x] Done`
**Assignee:** reena

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
     "skemvora": "file:../skemvora"
   }
   ```
5. Run `npm install` again to install the local library link.

**Output Criteria:**
- `my-ui-test-app/` folder exists with a working Vite React scaffold.
- `node_modules/skemvora/` is present in the test app's `node_modules`.

---

### Task 9 — Integrate the Library into the Test App (`App.jsx`)

**Status:** `[x] Done`
**Assignee:** reena

**Depends On:** Task 8

**Description:**
Update `my-ui-test-app/src/App.jsx` to import and render both button variants from `skemvora`. This is the end-to-end rendering test.

**Steps:**
1. Open `my-ui-test-app/src/App.jsx`.
2. Replace its content with the following (or edit to include):
   ```jsx
   import { Button } from 'skemvora';
   import 'skemvora/dist/style.css';

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

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Tasks 7, 9

**Description:**
Write a complete `README.md` inside `skemvora/` so any developer (or their AI assistant) can install, use, and contribute to the library without needing to read internal source code.

**Sections to include:**

1. **Project Title & Description** — What `skemvora` is.
2. **Installation**
   - Local (file-based): `"skemvora": "file:../skemvora"`
   - Future NPM (placeholder): `npm install skemvora`
3. **CSS Import** — Add `import 'skemvora/dist/style.css';` at app root.
4. **Usage Example** — Full code snippet showing both variants:
   ```jsx
   import { Button } from 'skemvora';
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
- `skemvora/README.md` contains all 8 sections.
- Props table is correctly formatted markdown.
- A new team member can set up and use the library by following the README alone.

---

### Task 11 — Create Reusable `Form` Component Structure

**Status:** `[x] Done`
**Assignee:** reena

**Depends On:** Task 3 (Barrel src/index.js)

**Description:**
Create the folder and file scaffolding for the new `Form` component inside the library. The `Form` component accepts a `data` prop (an array of field config objects) and dynamically renders the appropriate form fields based on each item's `type`.

**Steps:**
1. Create the folder: `skemvora/src/components/Form/`.
2. Create three files inside it:
   - `Form.js` — the main functional component (see Task 12 for implementation).
   - `Form.css` — scoped styles (see Task 13).
   - `index.js` — barrel re-export.
3. In `index.js`, add:
   ```js
   export { Form } from './Form';
   ```

**Output Criteria:**
- `src/components/Form/` folder exists with all 3 files.
- `Form/index.js` re-exports `Form` as a named export.

---

### Task 12 — Implement Dynamic Field Rendering in `Form.js`

**Status:** `[x] Done`
**Assignee:** reena

**Depends On:** Task 11

**Description:**
Implement the `Form` component logic. It receives a `data` prop — an array of field config objects — and renders a form field for each entry based on its `type`. Supported types: `text`, `email`, `password`, `radio`.

**Accepted `data` Prop Shape:**
```js
const formData = [
  { label: "Full Name",  type: "text",     required: true },
  { label: "Email",      type: "email",    required: true },
  { label: "Password",   type: "password", required: true },
  { label: "Gender",     type: "radio",    options: ["Male", "Female"], required: true },
];
```

**Usage Example:**
```jsx
import { Form } from 'skemvora';

const formData = [
  { label: "Full Name", type: "text", required: true },
];

<Form data={formData} />
```

**Steps:**
1. Open `Form.js` and write the component as a **named export**:
   ```js
   import './Form.css';

   export function Form({ data = [] }) {
     return (
       <form className="form-wrapper">
         {data.map((field, index) => (
           <div key={index} className="form-field">
             <label className="form-label">
               {field.label}{field.required && <span className="required"> *</span>}
             </label>

             {field.type === 'radio' ? (
               <div className="radio-group">
                 {field.options.map((option, i) => (
                   <label key={i} className="radio-option">
                     <input
                       type="radio"
                       name={field.label}
                       value={option}
                       required={field.required}
                     />
                     {option}
                   </label>
                 ))}
               </div>
             ) : (
               <input
                 className="form-input"
                 type={field.type}
                 placeholder={field.label}
                 required={field.required}
               />
             )}
           </div>
         ))}
       </form>
     );
   }
   ```
2. Verify each `type` (`text`, `email`, `password`) renders an `<input>` tag.
3. Verify `type: 'radio'` renders all `options` as individual radio inputs grouped by `name`.
4. Verify `required: true` sets the HTML `required` attribute on inputs.

**Output Criteria:**
- `Form.js` exists with a named export `Form`.
- Text / email / password types render a single `<input>`.
- Radio type renders one `<input type="radio">` per option.
- `required` attribute is correctly applied.
- Uses `.js` extension only (no `.jsx`).

---

### Task 13 — Add CSS Styling for Column Layout (`Form.css`)

**Status:** `[x] Done`
**Assignee:** reena

**Depends On:** Task 11

**Description:**
Create the CSS file for the `Form` component. Fields must render **vertically (column-wise)**. Styling must be scoped using specific class names to avoid conflicts with the rest of the library.

**Steps:**
1. Open `skemvora/src/components/Form/Form.css`.
2. Implement the following CSS rules:

   **`.form-wrapper`** — the outer `<form>` container:
   - `display: flex`
   - `flex-direction: column`
   - `gap: 16px`
   - `max-width: 400px`
   - `width: 100%`

   **`.form-field`** — wrapper around each label + input pair:
   - `display: flex`
   - `flex-direction: column`
   - `gap: 6px`

   **`.form-label`** — the field label text:
   - `font-size: 14px`
   - `font-weight: 600`
   - `color: #374151`

   **`.required`** — the asterisk for required fields:
   - `color: #ef4444`

   **`.form-input`** — text / email / password inputs:
   - `padding: 10px 12px`
   - `border: 1.5px solid #d1d5db`
   - `border-radius: 6px`
   - `font-size: 14px`
   - `outline: none`
   - `transition: border-color 0.2s ease`

   **`.form-input:focus`:**
   - `border-color: #4f46e5`

   **`.radio-group`** — container for radio options:
   - `display: flex`
   - `gap: 16px`
   - `flex-wrap: wrap`

   **`.radio-option`** — individual radio label:
   - `display: flex`
   - `align-items: center`
   - `gap: 6px`
   - `font-size: 14px`
   - `cursor: pointer`

**Output Criteria:**
- `Form.css` exists with all 8 rule blocks.
- Fields display vertically (column layout) with consistent spacing.
- Required asterisk displays in red (`#ef4444`).
- Inputs show a focus highlight matching the library's brand color (`#4f46e5`).

---

### Task 14 — Export `Form` from `src/index.js` and Test Locally

**Status:** `[x] Done`
**Assignee:** reena

**Depends On:** Tasks 12, 13

**Description:**
Register the `Form` component in the library's barrel file so it is publicly available to consumers. Then rebuild the library and verify the component renders correctly in the existing `my-ui-test-app`.

**Export Requirement:**
- `Form` must be exported from `src/index.js` so consumers can import it as:
  ```js
  import { Form } from 'skemvora';
  ```

**Steps:**
1. Open `skemvora/src/index.js` and add the Form export:
   ```js
   export { Button } from './components/Button';
   export { Form }   from './components/Form';   // ← Add this line
   ```
2. Run `npm run build` inside `skemvora/` to rebuild the `dist/` output.
3. Re-link the library in `my-ui-test-app/` (run `npm install` inside the test app).
4. Open `my-ui-test-app/src/App.jsx` and add a test render:
   ```jsx
   import { Button, Form } from 'skemvora';
   import 'skemvora/dist/style.css';

   const formData = [
     { label: 'Full Name',  type: 'text',     required: true },
     { label: 'Email',      type: 'email',    required: true },
     { label: 'Password',   type: 'password', required: true },
     { label: 'Gender',     type: 'radio',    options: ['Male', 'Female'], required: true },
   ];

   function App() {
     return (
       <div style={{ padding: '40px' }}>
         <Form data={formData} />
       </div>
     );
   }

   export default App;
   ```
5. Run `npm run dev` inside `my-ui-test-app/` and open the browser.

**Output Criteria:**
- `src/index.js` exports both `Button` and `Form`.
- `npm run build` completes with no errors.
- All 4 fields (Full Name, Email, Password, Gender) render vertically in the browser.
- Radio options (Male, Female) are both visible and clickable.
- Required asterisks are visible next to all labels.
- No console errors.

---

## 🏗️ Phase 3 — Reusable Field Component Architecture

> **Architecture Decision:** `Form.js` is refactored to remain clean and scalable. Every field type becomes its own isolated, reusable component. Dynamic rendering is handled through a `fieldMapper` utility.

---

### 🗂️ Updated Folder Structure (Phase 3)

```
src/
├── components/
│
│   ├── Form/
│   │   ├── Form.js
│   │   ├── Form.css
│   │   └── index.js
│
│   ├── fields/
│   │   ├── BaseField/
│   │   │   ├── BaseField.js
│   │   │   ├── BaseField.css
│   │   │   └── index.js
│   │   │
│   │   ├── TextField/
│   │   ├── EmailField/
│   │   ├── PasswordField/
│   │   ├── CheckboxField/
│   │   ├── RadioField/
│   │   ├── SelectField/
│   │   ├── TextAreaField/
│   │   ├── FileField/
│   │   ├── DateField/
│   │   └── NumberField/
│
├── utils/
│   └── fieldMapper.js
```

---

### 📐 Architecture Principles

| Principle | Rule |
|-----------|------|
| **Isolated field components** | Every field type must be its own self-contained, reusable component |
| **Clean Form.js** | `Form.js` only loops through data, maps types, and renders field components — no inline field logic |
| **Dynamic rendering** | Field resolution must use a `fieldMapper` object keyed by field `type` string |
| **Shared UI logic** | Common layout (label, required asterisk, wrapper) must live in `BaseField` and be reused by all field components |
| **Simple CSS** | All styling uses plain Vanilla CSS — no CSS Modules, no Tailwind |
| **JS only** | All files use `.js` extension — no `.jsx` |
| **React functional components** | All components are written as React functional components with named exports |

---

### 🎨 UI Requirements

| Requirement | Detail |
|-------------|--------|
| **Layout** | All form fields render column-wise (top to bottom, stacked vertically) |
| **Label alignment** | Labels must be left-aligned above their input |
| **Field spacing** | Consistent spacing between each field using `gap` in CSS flexbox |
| **Input width** | Inputs take the full available width of the form container |
| **Required indicator** | Required fields display a red `*` asterisk via the `required` prop |
| **Clean layout** | Form layout must remain clean, minimal, and reusable across any consumer app |

---

### 📦 Dynamic Form Data Shape

`Form.js` must accept a `data` prop — an array of field configuration objects. Each object describes one field:

```js
const formData = [
  {
    label: "Full Name",
    type: "text",
    required: true,
  },
  {
    label: "Email",
    type: "email",
    required: true,
  },
  {
    label: "Gender",
    type: "radio",
    options: ["Male", "Female"],
  },
];
```

> **Supported `type` values:** `text`, `email`, `password`, `checkbox`, `radio`, `select`, `textarea`, `file`, `date`, `number`

---

### 📥 Final Import Requirement

The library must support the following clean import syntax in any consumer application:

```js
import { Form } from "my-ui-library";
```

No additional setup or internal path imports should be required from the consumer.

---

### Task 15 — Create Reusable Fields Folder Structure

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 11 (Form Component Structure)

**Description:**
Set up the complete `fields/` folder structure inside `src/components/`. This scaffold will house all individual field components. Creating this structure first ensures every team member works within the same organized layout before writing any component logic.

**Steps:**
1. Inside `skemvora/src/components/`, create a new folder named `fields/`.
2. Inside `fields/`, create one subfolder for each field type:
   - `BaseField/`
   - `TextField/`
   - `EmailField/`
   - `PasswordField/`
   - `CheckboxField/`
   - `RadioField/`
   - `SelectField/`
   - `TextAreaField/`
   - `FileField/`
   - `DateField/`
   - `NumberField/`
3. Inside each subfolder, create three placeholder files:
   - `[FieldName].js` — component file (leave empty for now)
   - `[FieldName].css` — styles file (leave empty for now)
   - `index.js` — barrel re-export (leave empty for now)
4. Also create the `utils/` folder at `skemvora/src/utils/` and add an empty `fieldMapper.js` file.

**Output Criteria:**
- `src/components/fields/` exists with all 11 subfolders.
- Each subfolder contains 3 placeholder files (`.js`, `.css`, `index.js`).
- `src/utils/fieldMapper.js` exists.

---

### Task 16 — Create `BaseField` Wrapper Component

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 15

**Description:**
Build the `BaseField` component — a shared wrapper that every field component uses for consistent layout. It renders the label, the required asterisk, and a slot for the actual input. This eliminates repeated label/wrapper code across all 10 field components and keeps the UI consistent.

**Steps:**
1. Open `skemvora/src/components/fields/BaseField/BaseField.js`.
2. Implement as a named export React functional component:
   ```js
   import './BaseField.css';

   export function BaseField({ label, required, children }) {
     return (
       <div className="base-field">
         <label className="base-field__label">
           {label}
           {required && <span className="base-field__required"> *</span>}
         </label>
         {children}
       </div>
     );
   }
   ```
3. Open `BaseField.css` and add:
   - `.base-field` — `display: flex`, `flex-direction: column`, `gap: 6px`, `width: 100%`
   - `.base-field__label` — `font-size: 14px`, `font-weight: 600`, `color: #374151`, `text-align: left`
   - `.base-field__required` — `color: #ef4444`, `margin-left: 2px`
4. Open `index.js` and add:
   ```js
   export { BaseField } from './BaseField';
   ```

**Output Criteria:**
- `BaseField.js` is a named export functional component accepting `label`, `required`, and `children` props.
- `BaseField.css` contains all 3 rule blocks.
- Label is left-aligned and required asterisk renders in red.
- `index.js` re-exports `BaseField`.

---

### Task 17 — Create `TextField` Component

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 16

**Description:**
Build the `TextField` component for `type: "text"` fields. It wraps `BaseField` for layout and renders a standard text input. This is the simplest and most common field type — a good first component to implement after `BaseField`.

**Steps:**
1. Open `skemvora/src/components/fields/TextField/TextField.js`.
2. Implement as a named export:
   ```js
   import './TextField.css';
   import { BaseField } from '../BaseField';

   export function TextField({ label, required, value, onChange, placeholder }) {
     return (
       <BaseField label={label} required={required}>
         <input
           className="text-field__input"
           type="text"
           value={value}
           onChange={onChange}
           placeholder={placeholder || label}
           required={required}
         />
       </BaseField>
     );
   }
   ```
3. In `TextField.css`, style `.text-field__input`:
   - `padding: 10px 12px`
   - `border: 1.5px solid #d1d5db`
   - `border-radius: 6px`
   - `font-size: 14px`
   - `width: 100%`
   - `box-sizing: border-box`
   - `outline: none`
   - `transition: border-color 0.2s ease`
   - On `:focus` — `border-color: #4f46e5`
4. Add `export { TextField } from './TextField';` to `index.js`.

**Output Criteria:**
- `TextField` renders inside `BaseField` with label and required asterisk.
- Input takes full width and shows a focus ring on interaction.
- `index.js` re-exports the component.

---

### Task 18 — Create `EmailField` Component

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 16

**Description:**
Build the `EmailField` component for `type: "email"` fields. It is structurally identical to `TextField` but uses `type="email"` on the input element, which enables browser-native email format validation.

**Steps:**
1. Open `EmailField/EmailField.js` and implement as a named export:
   ```js
   import './EmailField.css';
   import { BaseField } from '../BaseField';

   export function EmailField({ label, required, value, onChange }) {
     return (
       <BaseField label={label} required={required}>
         <input
           className="email-field__input"
           type="email"
           value={value}
           onChange={onChange}
           placeholder={label}
           required={required}
         />
       </BaseField>
     );
   }
   ```
2. In `EmailField.css`, copy the same input styles as `TextField.css` using the class `.email-field__input`.
3. Add `export { EmailField } from './EmailField';` to `index.js`.

**Output Criteria:**
- Input uses `type="email"` for browser-native validation.
- Component wraps `BaseField` for consistent label layout.
- `index.js` re-exports `EmailField`.

---

### Task 19 — Create `PasswordField` Component

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 16

**Description:**
Build the `PasswordField` component for `type: "password"` fields. It uses `type="password"` on the input to automatically mask the entered text. The component follows the same structure as `TextField` and `EmailField`.

**Steps:**
1. Open `PasswordField/PasswordField.js` and implement as a named export:
   ```js
   import './PasswordField.css';
   import { BaseField } from '../BaseField';

   export function PasswordField({ label, required, value, onChange }) {
     return (
       <BaseField label={label} required={required}>
         <input
           className="password-field__input"
           type="password"
           value={value}
           onChange={onChange}
           placeholder={label}
           required={required}
         />
       </BaseField>
     );
   }
   ```
2. In `PasswordField.css`, apply the same input styles using the class `.password-field__input`.
3. Add `export { PasswordField } from './PasswordField';` to `index.js`.

**Output Criteria:**
- Input uses `type="password"` and masks characters.
- Layout is consistent with `TextField` and `EmailField`.
- `index.js` re-exports `PasswordField`.

---

### Task 20 — Create `CheckboxField` Component

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 16

**Description:**
Build the `CheckboxField` component for `type: "checkbox"` fields. Unlike text-based fields, this component renders a checkbox input alongside the label in a horizontal inline layout.

**Steps:**
1. Open `CheckboxField/CheckboxField.js` and implement as a named export:
   ```js
   import './CheckboxField.css';

   export function CheckboxField({ label, required, checked, onChange }) {
     return (
       <div className="checkbox-field">
         <input
           className="checkbox-field__input"
           type="checkbox"
           checked={checked}
           onChange={onChange}
           required={required}
           id={label}
         />
         <label className="checkbox-field__label" htmlFor={label}>
           {label}
           {required && <span className="checkbox-field__required"> *</span>}
         </label>
       </div>
     );
   }
   ```
   > Note: `CheckboxField` does not use `BaseField` because its label renders beside the checkbox, not above it.
2. In `CheckboxField.css`, style:
   - `.checkbox-field` — `display: flex`, `align-items: center`, `gap: 8px`
   - `.checkbox-field__label` — `font-size: 14px`, `color: #374151`, `cursor: pointer`
   - `.checkbox-field__required` — `color: #ef4444`
3. Add `export { CheckboxField } from './CheckboxField';` to `index.js`.

**Output Criteria:**
- Checkbox and label appear on the same horizontal line.
- Clicking the label toggles the checkbox (via `htmlFor` + `id`).
- `index.js` re-exports `CheckboxField`.

---

### Task 21 — Create `RadioField` Component

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 16

**Description:**
Extract the radio input logic from the existing `Form.js` (Task 12) into a dedicated, reusable `RadioField` component. The component accepts an `options` array and renders one radio button per option, all grouped under the same `name`.

**Steps:**
1. Open `RadioField/RadioField.js` and implement as a named export:
   ```js
   import './RadioField.css';
   import { BaseField } from '../BaseField';

   export function RadioField({ label, required, options = [], value, onChange }) {
     return (
       <BaseField label={label} required={required}>
         <div className="radio-field__group">
           {options.map((option, i) => (
             <label key={i} className="radio-field__option">
               <input
                 type="radio"
                 name={label}
                 value={option}
                 checked={value === option}
                 onChange={onChange}
                 required={required}
               />
               {option}
             </label>
           ))}
         </div>
       </BaseField>
     );
   }
   ```
2. In `RadioField.css`, style:
   - `.radio-field__group` — `display: flex`, `gap: 16px`, `flex-wrap: wrap`
   - `.radio-field__option` — `display: flex`, `align-items: center`, `gap: 6px`, `font-size: 14px`, `cursor: pointer`
3. Add `export { RadioField } from './RadioField';` to `index.js`.

**Output Criteria:**
- All radio options render inside `BaseField` with the shared label.
- Options are grouped by `name` so only one can be selected at a time.
- `index.js` re-exports `RadioField`.

---

### Task 22 — Create `fieldMapper` Utility

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Tasks 17, 18, 19, 20, 21

**Description:**
Create the `fieldMapper` utility at `src/utils/fieldMapper.js`. This is a plain JavaScript object that maps each field `type` string to its corresponding component. `Form.js` imports this object to dynamically resolve which component to render — keeping `Form.js` clean with zero `if/else` or `switch` statements.

**Steps:**
1. Open `skemvora/src/utils/fieldMapper.js`.
2. Implement the mapper object as a named export:
   ```js
   import { TextField }    from '../components/fields/TextField';
   import { EmailField }   from '../components/fields/EmailField';
   import { PasswordField } from '../components/fields/PasswordField';
   import { CheckboxField } from '../components/fields/CheckboxField';
   import { RadioField }   from '../components/fields/RadioField';
   import { SelectField }  from '../components/fields/SelectField';
   import { TextAreaField } from '../components/fields/TextAreaField';
   import { FileField }    from '../components/fields/FileField';
   import { DateField }    from '../components/fields/DateField';
   import { NumberField }  from '../components/fields/NumberField';

   export const fieldMapper = {
     text:     TextField,
     email:    EmailField,
     password: PasswordField,
     checkbox: CheckboxField,
     radio:    RadioField,
     select:   SelectField,
     textarea: TextAreaField,
     file:     FileField,
     date:     DateField,
     number:   NumberField,
   };
   ```
3. To add a new field type in the future, simply import the new component and add one line to this object — no other file needs to change.

**Output Criteria:**
- `fieldMapper` is a named export object with 10 keys.
- Each key maps to the correct field component.
- Adding a new field type requires changes only to this file.

---

### Task 23 — Update `Form.js` to Dynamically Render Fields via `fieldMapper`

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 22

**Description:**
Refactor `Form.js` to use the `fieldMapper` utility for dynamic field rendering. The updated `Form.js` should contain **no field-specific logic** — it only loops through the `data` array, resolves the correct component from `fieldMapper`, and renders it. This keeps `Form.js` permanently clean regardless of how many field types are added in the future.

**Steps:**
1. Open `skemvora/src/components/Form/Form.js` and replace its implementation:
   ```js
   import './Form.css';
   import { fieldMapper } from '../../utils/fieldMapper';

   export function Form({ data = [], onSubmit }) {
     const handleSubmit = (e) => {
       e.preventDefault();
       if (onSubmit) onSubmit(e);
     };

     return (
       <form className="form-wrapper" onSubmit={handleSubmit}>
         {data.map((field, index) => {
           const FieldComponent = fieldMapper[field.type];

           if (!FieldComponent) {
             console.warn(`Form: unknown field type "${field.type}"`);
             return null;
           }

           return (
             <FieldComponent
               key={index}
               label={field.label}
               required={field.required}
               options={field.options}
             />
           );
         })}

         <button type="submit" className="form-submit-btn">Submit</button>
       </form>
     );
   }
   ```
2. Update `Form.css` to add a rule for `.form-submit-btn`:
   - `margin-top: 8px`
   - `padding: 10px 24px`
   - `background-color: #4f46e5`
   - `color: #ffffff`
   - `border: none`
   - `border-radius: 6px`
   - `font-size: 14px`
   - `font-weight: 600`
   - `cursor: pointer`
   - On `:hover` — `background-color: #4338ca`

**Architecture Rules (must follow):**
- `Form.js` must NOT contain any `if/else` or `switch` for field types.
- `Form.js` must NOT import individual field components directly.
- All field type resolution must go through `fieldMapper`.

**Output Criteria:**
- `Form.js` uses `fieldMapper` for all field rendering.
- Unknown `type` values log a warning and skip gracefully.
- A submit button renders at the bottom of the form.
- `Form.js` remains clean and scalable — adding new field types requires zero changes to this file.

---

### Task 24 — Export All Field Components and Test the Full Form System Locally

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Tasks 15–23

**Description:**
Wire up all exports, rebuild the library, and run a full end-to-end verification in `my-ui-test-app`. This is the final integration task for Phase 3 — every field type should render correctly with proper labels, spacing, and required indicators.

**Steps:**
1. Open `skemvora/src/index.js` and ensure all exports are present:
   ```js
   export { Button }      from './components/Button';
   export { Form }        from './components/Form';
   export { TextField }   from './components/fields/TextField';
   export { EmailField }  from './components/fields/EmailField';
   export { PasswordField } from './components/fields/PasswordField';
   export { CheckboxField } from './components/fields/CheckboxField';
   export { RadioField }  from './components/fields/RadioField';
   export { SelectField } from './components/fields/SelectField';
   export { TextAreaField } from './components/fields/TextAreaField';
   export { FileField }   from './components/fields/FileField';
   export { DateField }   from './components/fields/DateField';
   export { NumberField } from './components/fields/NumberField';
   ```
2. Run `npm run build` inside `skemvora/` to rebuild `dist/`.
3. Run `npm install` inside `my-ui-test-app/` to re-link the updated library.
4. Open `my-ui-test-app/src/App.jsx` and add a test render covering all field types:
   ```js
   import { Form } from 'skemvora';
   import 'skemvora/dist/style.css';

   const formData = [
     { label: "Full Name",   type: "text",     required: true },
     { label: "Email",       type: "email",    required: true },
     { label: "Password",    type: "password", required: true },
     { label: "Age",         type: "number",   required: false },
     { label: "Birth Date",  type: "date",     required: false },
     { label: "Gender",      type: "radio",    options: ["Male", "Female"], required: true },
     { label: "Subscribe",   type: "checkbox", required: false },
     { label: "Country",     type: "select",   options: ["India", "USA", "UK"], required: false },
     { label: "Bio",         type: "textarea", required: false },
     { label: "Resume",      type: "file",     required: false },
   ];

   function App() {
     return (
       <div style={{ padding: '40px' }}>
         <Form data={formData} onSubmit={() => alert('Form submitted!')} />
       </div>
     );
   }

   export default App;
   ```
5. Run `npm run dev` inside `my-ui-test-app/` and open the browser at the reported local URL.
6. Visually verify:
   - All 10 fields render vertically in column layout.
   - Labels are left-aligned above each input.
   - Required asterisks are visible in red next to required fields.
   - Inputs take the full width of the form container.
   - Submit button renders at the bottom and fires the `onSubmit` callback.
   - No console errors or warnings.

**Output Criteria:**
- All 10 field types render correctly in the browser.
- `npm run build` completes with no errors.
- The library supports `import { Form } from "skemvora"` as the only consumer import.
- Form layout is clean, column-wise, and production-ready.

---

### Task 25 — Implement Reusable Form Validation and Error Message Handling

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 24

**Description:**
Implement reusable validation and error message handling for required form fields. When a required field is empty and the form is submitted, the form should display a validation error message directly below that field. The validation mechanism should be scalable and work dynamically for all field types. By default, the fallback error message must be "This is a required field.", but the form component must support custom error messages provided in the field config (e.g., `errorMessage: "Email is mandatory."`), which override the default fallback.

**Architecture Requirements:**
- Validation should be reusable and scalable.
- Error handling should work dynamically for all field types.
- Error messages should render below the field.
- Error text should use reusable CSS styling.
- `BaseField` can be used for shared error rendering logic.
- Default error message should be used as fallback.
- Custom `errorMessage` prop should override default message.

**UI Requirements:**
- Error text color should be red.
- Error spacing should remain consistent.
- Labels should stay left aligned.
- Form layout should not break when errors appear.

**Steps:**
1. Update `BaseField` (or respective field components) to accept an optional `error` or `errorMessage` prop and render it below the input field if present.
2. In `BaseField.css`, add reusable styling for validation errors (e.g., `.base-field__error` class) ensuring text color is red and margins/padding provide consistent spacing.
3. Update `Form.js` to manage form submission validation state. When submission is triggered, check all fields to ensure required ones are not empty.
4. Set validation error messages dynamically: if a required field is empty, set its error to the custom `errorMessage` from the field config if it exists, otherwise fall back to `"This is a required field."`.
5. Pass the error state down to the field components so they display the message correctly.
6. Rebuild the library using `npm run build` and link/verify in `my-ui-test-app` that layout does not break when errors appear and that custom/default error messages render correctly.

**Output Criteria:**
- Submitting the form with empty required fields triggers validation and displays error messages.
- Error messages render below the fields with a consistent layout and left-aligned labels.
- Error text color is red and spacing is consistent.
- Custom `errorMessage` prop overrides the default fallback message `"This is a required field."`.

---

### Task 26 — Implement Reusable Form State Handling

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 25

**Description:**
Implement internal form state management inside `Form.js` to collect, manage, and return form data when the form is submitted or values change. The form values should be stored in an internal state keyed by each field's unique `name` property. The collected form values should be exposed back to the user via callbacks such as `onSubmit` and `onChange`, avoiding tight coupling (e.g., do NOT ask users to pass `setState` directly into the component).

**Architecture Requirements:**
- **Isolated Internal State:** `Form.js` must manage internal form state. Never ask the user to pass a state setter directly (e.g., do NOT use `<Form setState={setFormData} />` as it tightly couples user state with the library).
- **Dynamic Field Updates:** Field updates should dynamically update the internal state for all field types.
- **Unique Name Keys:** Every field configuration object must support a unique `name` property which acts as the key for storing that field's value in state.
- **onSubmit Callback:** Form values must be returned to the consumer using the `onSubmit` callback upon form submission.
- **Reusable and Scalable:** The state management architecture must remain isolated, reusable, and scalable to support future fields.

**Expected Usage:**
```jsx
const formData = [
  {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
  },
];

function App() {
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form
      data={formData}
      onSubmit={handleSubmit}
    />
  );
}
```

**Expected Output Format:**
On form submit, the callback should return an object containing the field names and their current values:
```json
{
  "fullName": "John",
  "email": "john@gmail.com",
  "gender": "Male"
}
```

**Steps:**
1. Update the component input interface in `Form.js` to support the `onSubmit` and optional `onChange` callbacks.
2. Define internal state (e.g., using `useState`) in `Form.js` to hold the form's field values.
3. Ensure every field object in the `data` array uses its `name` property as the key (e.g., `field.name`).
4. Update dynamic rendering to pass the current value and a change handler to each field component resolved via `fieldMapper`.
5. Implement the change handler function inside `Form.js` to dynamically update the state key matching the field's `name` when a user types or selects a value.
6. Handle validation alongside state management (ensuring invalid inputs block the `onSubmit` callback).
7. In the submit handler, call the consumer's `onSubmit` handler, passing the collected form values.
8. Rebuild the library using `npm run build` and link/verify in `my-ui-test-app` that form values are printed correctly to the console on submission.

**Output Criteria:**
- The form component internally manages state without requiring the user to pass down a state setter directly.
- Form fields are identified by a unique `name` property, which acts as the key for storing form values.
- Dynamic field updates successfully capture changes for all input types.
- The `onSubmit` callback exposes the accumulated form data object to the consumer upon successful submission.
- The library compiles successfully with no build or runtime console errors.

---

### Task 27 — Implement Global and Field-Level Styling Customization

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 26

**Description:**
Create a scalable styling system that allows users to customize the appearance of form fields without modifying library code. The styling system must support global form styling (via a `formStyles` prop) and field-level styling (via field-specific `className` and `style` properties).

**Architecture Requirements:**
- **Single Scalable Object:** Avoid creating many styling props like `labelColor`, `borderColor`, `fieldGap`, etc. Use a single scalable `formStyles` object on the `<Form>` component.
- **BaseField Consumption:** `BaseField` should consume shared styles from the global `formStyles` configuration.
- **Support in all fields:** All individual field components must support custom inline `style` and `className` overrides.
- **Style Priority:** Implement and document the styling priority:
  `Default Library CSS`
  ↓
  `Global formStyles`
  ↓
  `Field-specific style`
  (Field-level styles must override global styles when conflicts occur).
- **Reusable and Scalable:** The styling architecture must remain reusable, clean, and extensible for future field types.

**Global Styling Requirement:**
The `Form` component must support a new `formStyles` prop:
```jsx
<Form
  data={formData}
  formStyles={{
    formContainer: {},
    fieldWrapper: {},
    label: {},
    input: {},
    error: {}
  }}
/>
```
Purpose:
- Customize all labels (e.g., color, font size, font weight)
- Customize all inputs (e.g., border color, border radius, padding)
- Customize field spacing (gap between labels and fields, gap between fields)
- Customize form spacing (padding, margin, outer container flex spacing)
- Customize error message appearance (color, font size, etc.)

Examples of supported use cases:
- Label color
- Label font size
- Label font weight
- Input border color
- Input border radius
- Input padding
- Gap between label and field
- Gap between fields
- Error message color

**Field-Level Styling Requirement:**
Each field configuration object in the `data` array must support:
- `className` (string) — Allow custom class names for the field.
- `style` (object) — Allow custom inline styles.

Example field configuration:
```js
{
  label: "Email",
  name: "email",
  type: "email",
  className: "custom-email",
  style: {
    borderRadius: "10px"
  }
}
```
Purpose:
- Override styles for a single field.
- Allow custom class names.
- Allow custom inline styles.

**Test App Verification Task:**
Update the local test application (`my-ui-test-app`) to demonstrate and verify the styling system.
The test application must demonstrate:
- Global label styling
- Global input styling
- Global error styling
- Gap between fields
- Field-specific style override
- Field-specific className usage

Example test setup in the companion app:
```jsx
<Form
  data={formData}
  formStyles={{
    label: {
      color: "blue"
    },
    input: {
      borderRadius: "8px"
    },
    error: {
      color: "red"
    }
  }}
  onSubmit={handleSubmit}
/>
```
And:
```js
{
  label: "Email",
  name: "email",
  type: "email",
  style: {
    borderColor: "green"
  }
}
```

Verify that:
- [ ] All fields receive global styles.
- [ ] Email field correctly overrides the global border style.
- [ ] Form remains functional after styling changes.

**Steps:**
1. Update `Form.js` to accept the `formStyles` prop and pass relevant global styling values down to the dynamically rendered field components.
2. Update the field rendering loop to pass global styling configurations (`label`, `input`, `fieldWrapper`, `error`) and the specific field-level `style` and `className` properties down to individual field components.
3. Update `BaseField` to accept global `label`, `fieldWrapper`, and `error` style configurations, applying them appropriately while ensuring field-level overrides take precedence.
4. Refactor all field components resolved via `fieldMapper` to support both `className` and `style` props, passing them to their root wrapper elements or core `<input>` elements as specified by the priority hierarchy: Default CSS -> Global `formStyles` -> Field-specific `style`.
5. Update the local test application (`my-ui-test-app/src/App.jsx`) to render a form using the global and field-level styling options.
6. Rebuild the library using `npm run build` and link/verify that global and field-specific styling works correctly.

**Output Criteria:**
- The form component supports the `formStyles` prop containing `formContainer`, `fieldWrapper`, `label`, `input`, and `error` keys.
- Every field configuration object supports custom `className` and inline `style` overrides.
- Styling priority is correctly implemented: Field-specific styles override global styles, which override default CSS.
- The test app successfully demonstrates global and field-level styling customization without console errors.

---

### Task 28 — Enhance Styling System with Global Label Gap and Field-Level Label Styling

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 27

**Description:**
Enhance the styling system to support global label-to-input gap and field-level label styling. This ensures better flexibility for customizing individual labels and controlling overall field layout spacing without manually styling each field.

**Architecture Requirements:**
- **BaseField Support:** `BaseField` must support both field-level `labelStyle` and global `labelGap`.
- **Reusable Styling:** Label styling should be reusable across all field types, and the styling system should remain scalable.
- **Minimal Props:** Avoid adding many individual styling props; continue using the `formStyles` object for global customization.
- **Updated Styling Priority:**
  `Default Library CSS`
  ↓
  `Global formStyles`
  ↓
  `Field-specific labelStyle`
  ↓
  `Field-specific style`
  (Field-specific styling should always take precedence).

**Field-Level Label Styling Requirements:**
- A field configuration object in the `data` array can support a `labelStyle` object (e.g., `labelStyle: { color: "green", fontWeight: "bold", fontSize: "16px" }`).
- `labelStyle` must only affect that specific field's label.
- The existing `style` prop on the field configuration must continue to affect only that field's input/control.
- Both `labelStyle` and `style` must override global styles when provided.

**Global Label-to-Field Gap Requirements:**
- The `formStyles` object on the `<Form>` component must support `labelGap` to control spacing between labels and fields globally (e.g., `<Form formStyles={{ labelGap: "8px" }} />`).
- The `labelGap` property must maintain a consistent layout across all fields and avoid manual spacing on a per-field basis.

**Test App Verification Requirements:**
Update the local test application (`my-ui-test-app/src/App.jsx`) to demonstrate and verify the styling enhancements:
- Set global label color, global label-to-input gap (`labelGap`), and global input border styling.
- Set field-specific `labelStyle` override and field-specific input `style` override for a single field (e.g., "Email").
- Verify that:
  - [x] Only the Email label becomes green.
  - [x] Only the Email input gets a green border.
  - [x] Other fields continue using global styles.
  - [x] Global `labelGap` is applied consistently across all fields.

**Steps:**
1. Update `Form.js` to extract `labelGap` from `formStyles` and pass it down to individual field components or `BaseField`.
2. Update `BaseField.js` to accept `labelStyle` and `labelGap` props. Apply `labelGap` as a margin/gap style (e.g., setting the margin or gap on the field wrapper/container), and apply `labelStyle` directly to the `<label>` element.
3. Ensure that all field components resolved via `fieldMapper` forward `labelStyle` and the global `labelGap` to `BaseField` while passing `style` to the input element.
4. Update the local test application (`my-ui-test-app/src/App.jsx`) to render the form with the styling configurations.
5. Rebuild the library using `npm run build` and verify that the styling rules apply properly in the browser.

**Output Criteria:**
- `BaseField` supports the global `labelGap` style and specific `labelStyle` override.
- Field-specific `labelStyle` and `style` override the corresponding global styles while leaving other fields unaffected.
- The test app successfully demonstrates the styling priority hierarchy and global `labelGap` with no console errors.

---

### Task 29 — Implement multiple selection checkboxGroup field

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 28

**Description:**
Add a new `checkboxGroup` field type to `skemvora` that supports multiple selections from a given array of options. Update the `CheckboxGroupField` CSS to allow natural flex layout without forcing a `flex-direction: column`, enabling developers to control layout via the `style` prop. Verify by providing single-column and multi-column examples in the local test app.

---

# Phase 4 - Advanced Form Features

## Task 30 - Create ConditionalForm Component

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:**

**Description:**
Create a new reusable component `<ConditionalForm />` that is separate from the existing `Form` component. Its purpose is to handle conditional field rendering, field dependencies, dynamic form flows, advanced questionnaires, and dynamic survey forms. This component must remain independent from the existing `Form` component, which should continue working exactly as it does today.

### Architecture Requirements
Create a new component structure:
- `src/components/ConditionalForm/ConditionalForm.js`
- `src/components/ConditionalForm/ConditionalForm.css`
- `src/components/ConditionalForm/index.js`

Export `ConditionalForm` from `src/index.js`. Usage should support:
```jsx
import { ConditionalForm } from "my-ui-library";
```

### Condition Configuration
Do NOT use raw JavaScript expressions inside configurations (do NOT support `happy === "Yes"` or `age > 18` inside config). Use a structured condition object:
```json
{
  "label": "Describe your experience",
  "name": "description",
  "type": "textarea",
  "condition": {
    "logic": "AND",
    "rules": [
      {
        "field": "happy",
        "operator": "equals",
        "value": "Yes"
      }
    ]
  }
}
```

### Multiple Field Dependencies
The architecture must support conditions based on multiple fields:
```json
{
  "label": "Describe your experience",
  "name": "description",
  "type": "textarea",
  "condition": {
    "logic": "AND",
    "rules": [
      {
        "field": "happy",
        "operator": "equals",
        "value": "Yes"
      },
      {
        "field": "age",
        "operator": "greaterThan",
        "value": 18
      }
    ]
  }
}
```
Fields should render only when all rules are satisfied.

### Supported Logic
- `AND`
- `OR`

### Supported Operators
- `equals`
- `notEquals`
- `greaterThan`
- `greaterThanOrEqual`
- `lessThan`
- `lessThanOrEqual`
- `contains`
- `includes`
- `startsWith`
- `endsWith`

### Validation Requirement
Hidden fields must:
- Not render
- Not be validated
- Not show errors
- Not block form submission

Only visible fields should participate in validation.

### Submission Requirement
The component should:
- Maintain internal state
- Support `onSubmit` callback
- Return submitted values
- Ignore hidden fields during validation

### Test Application Requirement
Update the local test application with examples covering:
- **Scenario 1:**
  - Question: "Are you happy?" (Options: "Yes", "No")
  - When "Yes": Show "Describe why you are happy"
  - When "No": Show "Describe why you are not happy"
- **Scenario 2:**
  - Render a field only when: `Happy = Yes AND Age > 18`
- **Verify:**
  - Conditional rendering
  - Validation
  - State updates
  - Form submission
  - Hidden field behavior

### Steps:
- [ ] Create the component files under `src/components/ConditionalForm/`
- [ ] Implement conditional rule evaluation logic supporting all listed operators and logic gates (`AND`, `OR`)
- [ ] Build the dynamic rendering flow based on internal state changes in `ConditionalForm`
- [ ] Implement validation that is skipped for hidden fields
- [ ] Implement state retrieval and filtering to return only visible values on submit
- [ ] Export `ConditionalForm` from `src/index.js`
- [ ] Update companion test app to showcase Scenario 1 and Scenario 2 and verify implementation

### Output Criteria:
- `<ConditionalForm />` component exists, separate from `<Form />`
- Configuration conditions are processed structurally, not via raw evaluation of strings
- Visibility updates dynamically, hiding inputs and clearing their validation state/errors
- Submit returns only visible fields
- Local test app verifies all conditional scenarios correctly

---

## Task 31 - Add CheckboxGroup Conditional Rendering Support

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 30

**Requirement:**
The current `ConditionalForm` implementation does not properly support conditional rendering based on `CheckboxGroup` selections.
We need to enhance the condition engine to support conditions on fields that return an array of selected values.

### Example

**CheckboxGroup:**
```json
{
  "label": "Select Options",
  "name": "selectedOptions",
  "type": "checkboxGroup",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5"
  ]
}
```

**Conditional field:**
```json
{
  "label": "Please provide additional details",
  "name": "details",
  "type": "textarea",
  "condition": {
    "logic": "AND",
    "rules": [
      {
        "field": "selectedOptions",
        "operator": "includes",
        "value": "Option 2"
      },
      {
        "field": "selectedOptions",
        "operator": "includes",
        "value": "Option 3"
      }
    ]
  }
}
```

### Expected Behavior
- Field remains hidden initially
- Field remains hidden when only Option 2 is selected
- Field remains hidden when only Option 3 is selected
- Field becomes visible when Option 2 and Option 3 are both selected
- Field hides again if either option is unchecked

### Architecture Requirements
- Condition engine must support array-based field values
- `includes` operator must work correctly for `CheckboxGroup` fields
- Support `AND` and `OR` logic with checkbox conditions
- Keep implementation generic so it works with any `CheckboxGroup` field
- Hidden fields should not be validated
- Hidden fields should not appear in submitted data

### Test App Requirement
Update `my-test-ui-app` with a `CheckboxGroup` example that verifies:
- Single checkbox condition
- Multiple checkbox conditions using `AND` logic
- Multiple conditional fields rendered from the same `CheckboxGroup`
- Validation and submission behavior

### Steps:
- [x] Update `conditionEvaluator.js` to handle array values for `includes` and `contains` operators
- [x] Ensure validation logic ignores hidden fields correctly for checkboxGroup dependencies
- [x] Add the test case into `my-ui-test-app/src/App.jsx`

---

## Task 32 - Add Responsive Grid Layout Support

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 30, Task 31

**Description:**
Add responsive grid layout support to both `<Form />` and `<ConditionalForm />` without creating separate components (like `GridForm` or `ConditionalGridForm`). Grid layout must be field-based, treating layout as a presentation concern that works seamlessly with other form features.

### Architecture Requirements
- Grid support must be field-based (configured directly on individual field definitions).
- Do not create a separate `GridForm` or `ConditionalGridForm` component.
- `<Form />` and `<ConditionalForm />` must share the same grid rendering system.
- Grid must be independent of validation logic and condition evaluation logic.
- The grid system should remain reusable and scalable.
- The grid layout should automatically adjust based on visible fields in `<ConditionalForm />`. When fields are hidden, they must not leave empty grid spaces.

### Grid Configuration Spec
Each field configuration can support a `grid` object:
```js
grid: {
  xs: 12, // mobile
  sm: 6,  // tablet
  md: 4,  // small desktop
  lg: 3   // large desktop
}
```
- Grid values are based on a 12-column system (e.g., 12 is full width, 6 is half width, 4 is one-third width, 3 is one-quarter width).
- Default behavior: if no `grid` configuration is provided, fields default to `{ xs: 12, md: 12 }` (full-width).

### Styling Requirements
- Reusable grid styling utilizing Vanilla CSS (e.g., CSS Grid or Flexbox grid wrapper).
- Support configurable row gap and column gap through the existing `formStyles` config:
  ```jsx
  <Form
    formStyles={{
      grid: {
        rowGap: "20px",
        columnGap: "16px"
      }
    }}
  />
  ```
- Must support responsive behavior, automatic wrapping, and clean layout presentation.

### Test Application Requirements
Update `my-ui-test-app` to include the following examples to verify grid functionality:
- **Example 1: Two-column form**
  - First Name (md: 6, xs: 12) | Last Name (md: 6, xs: 12)
  - Address (md: 12, xs: 12)
  - Email (md: 12, xs: 12)
- **Example 2: Three-column form**
  - City (md: 4, xs: 12) | State (md: 4, xs: 12) | Country (md: 4, xs: 12)
- **Example 3: Conditional rendering + grid**
  - Employment Status (md: 6) | Company Name (md: 6, only visible when employed is "Yes")
  - Verify that when "Company Name" is hidden, the layout behaves correctly without empty grid slots, and automatically wraps/fills columns when visible.
- **Verification criteria**:
  - Responsive layout works.
  - Field wrapping works.
  - Hidden fields do not leave empty grid spaces.
  - Validation still functions correctly.
  - Form submission remains unchanged.

### Steps:
- [x] Implement grid wrapper styles and grid item class generation in `skemvora`.
- [x] Update field components or their wrapping structures to accept responsive grid classes/styles.
- [x] Enable `rowGap` and `columnGap` customization via `formStyles.grid` in both `<Form />` and `<ConditionalForm />`.
- [x] Ensure that hidden fields in `<ConditionalForm />` do not output empty grid elements.
- [x] Add Example 1, 2, and 3 layouts inside `my-ui-test-app/src/App.jsx`.
- [x] Rebuild library and verify grid responsive wrapping, validation, and submission behavior in the test app.

---

## Task 33 - Add Default Responsive Grid Fallback Support

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 32

**Description:**
Enhance the grid layout system used by both `<Form />` and `<ConditionalForm />` to automatically apply responsive defaults when breakpoint values are not provided. Currently, users must explicitly define `xs: 12` (e.g. `grid: { xs: 12, md: 6 }`), creating unnecessary configuration overhead. The grid system should automatically assume sensible defaults (e.g. `xs: 12` if `xs` is missing).

### Requirements:
- If a field configuration contains a `grid` object but `xs` is missing, the library should internally default `xs` to `12`.
- Examples:
  - `grid: { md: 6 }` behaves as `grid: { xs: 12, md: 6 }`
  - `grid: { md: 4 }` behaves as `grid: { xs: 12, md: 4 }`
  - `grid: { md: 12 }` behaves as `grid: { xs: 12, md: 12 }`
- This ensures all fields become full-width on mobile devices by default.
- The same fallback behavior must apply to `<ConditionalForm />`. Conditional fields should automatically become full width on mobile when `xs` is not specified.

### Architecture Requirements:
- Add a reusable grid normalization utility, e.g., `normalizeGrid(grid)`.
- Purpose:
  - Normalize grid configuration before rendering.
  - Apply default breakpoint values.
  - Avoid duplicate logic in `Form` and `ConditionalForm`.
- Both `<Form />` and `<ConditionalForm />` must use this shared utility.

### Test Application Requirements:
Update `my-ui-test-app` with test cases verifying:
1. Field with only `md: 6` becomes full width on mobile.
2. Two `md: 6` fields render side-by-side on desktop.
3. Conditional fields follow the same behavior.
4. Existing fields with explicit `xs` values continue to work.
5. Hidden conditional fields do not break the grid layout.

### Steps:
- [x] Create/implement a reusable `normalizeGrid` utility in the library.
- [x] Refactor `<Form />` and `<ConditionalForm />` to use `normalizeGrid` before rendering fields.
- [x] Update `my-ui-test-app` to include test cases verifying the fallback behavior for static and conditional fields under different screen widths.
- [x] Rebuild the library and verify layout responsive behavior in the browser.

---

## Task 34 - Add Initial Values and Disabled Field Support

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 33

**Description:**
Enhance both `<Form />` and `<ConditionalForm />` to support prefilled form values via an `initialValues` prop and disabled fields via a field-level `disabled` property. This feature enables users to load existing form data, resume partially completed forms, edit previously saved forms, and display read-only fields.

---

### Part 1 — Prefilled Values Support

#### Form-Level `initialValues` Prop

Add support for a new `initialValues` prop on the `<Form />` component:

```jsx
<Form
  data={formData}
  initialValues={{
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com"
  }}
/>
```

**Purpose:**
- Populate fields with existing data on initial render
- Support edit forms (loading saved records)
- Support draft forms (resuming partially completed forms)
- Support API-loaded data pre-population

When the form initializes, fields should automatically display the values provided in `initialValues`.

#### Field-Level `defaultValue` Support

Also support a field-level fallback value via `defaultValue`:

```js
{
  label: "Country",
  name: "country",
  type: "text",
  defaultValue: "India"
}
```

This value is used **only** when the field's `name` is not present in `initialValues`.

#### Value Priority Rule

Implement the following strict priority order:

```
initialValues (highest priority)
  ↓
defaultValue (field-level fallback)
  ↓
empty string (lowest priority / default)
```

**Example:**

Field config:
```js
{
  name: "email",
  defaultValue: "default@gmail.com"
}
```

Form prop:
```jsx
initialValues={{
  email: "actual@gmail.com"
}}
```

Result displayed: `actual@gmail.com`

---

### Part 2 — Disabled Field Support

Add support for a field-level `disabled` property:

```js
{
  label: "User ID",
  name: "userId",
  type: "text",
  defaultValue: "USR12345",
  disabled: true
}
```

**Purpose:**
- Display read-only information in a form context
- Prevent editing of specific fields (e.g., system-generated IDs)
- Support profile and admin forms where some values must not change

**Disabled field behavior:**
- Renders normally within the form layout
- Displays its current or prefilled value
- Remains fully visible to the user
- Does not allow user editing or input

#### Field Component Coverage

All supported field types must respect the `disabled` property. The disabled state must be passed through to the underlying HTML form control:

| Field Type | Disabled Behavior |
|------------|-------------------|
| `text` | `<input disabled />` |
| `email` | `<input disabled />` |
| `password` | `<input disabled />` |
| `number` | `<input disabled />` |
| `date` | `<input disabled />` |
| `textarea` | `<textarea disabled />` |
| `select` | `<select disabled />` |
| `radio` | All `<input type="radio" disabled />` |
| `checkbox` | `<input type="checkbox" disabled />` |
| `checkboxGroup` | All `<input type="checkbox" disabled />` |
| Any other supported type | Respective control disabled |

---

### ConditionalForm Compatibility

The same functionality must work identically inside `<ConditionalForm />`:

- `initialValues` must populate conditional fields on initial render
- Visible conditional fields must display their prefilled values correctly
- Disabled conditional fields must remain non-editable regardless of visibility
- Condition evaluation must continue working correctly based on prefilled values

---

### Architecture Requirements

| Concern | Responsibility |
|---------|----------------|
| `initialValues` | Managed at `Form` / `ConditionalForm` level — passed as a prop |
| `defaultValue` | Managed at field level — defined in the field config object |
| `disabled` | Supported by all field components — passed through to native controls |
| Backward compatibility | All existing APIs must remain unchanged and fully backward compatible |
| Scalability | Implementation must be reusable and work for any future field types added |

**Value resolution logic (to be implemented in `Form.js` and `ConditionalForm.js`):**

```js
const resolveInitialValue = (field, initialValues) => {
  if (initialValues && initialValues[field.name] !== undefined) {
    return initialValues[field.name];
  }
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }
  return '';
};
```

This utility (or equivalent inline logic) must be called when building the initial internal state for the form.

---

### Test Application Requirement

Update `my-test-ui-app` with the following four examples to verify the feature end-to-end:

#### Example 1 — Prefilled Form via `initialValues`

```jsx
<Form
  data={formData}
  initialValues={{
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com"
  }}
/>
```

**Verify:**
- [x] Values appear correctly on initial render without any user interaction
- [x] Values can still be edited by the user (fields are not locked unless explicitly disabled)

#### Example 2 — Field-Level `defaultValue`

```js
{
  label: "Country",
  name: "country",
  type: "text",
  defaultValue: "India"
}
```

**Verify:**
- [x] Default value `"India"` appears when `initialValues` does not include `country`
- [x] Default value is overridden when `initialValues` provides a value for the same field

#### Example 3 — Disabled Field

```js
{
  label: "User ID",
  name: "userId",
  type: "text",
  defaultValue: "USR12345",
  disabled: true
}
```

**Verify:**
- [x] Value `"USR12345"` is visible on render
- [x] The field cannot be edited by the user
- [x] The field renders with a visually disabled appearance

#### Example 4 — `ConditionalForm` with `initialValues` and Disabled Fields

Construct a `ConditionalForm` with:
- At least one conditionally visible field that has a prefilled value from `initialValues`
- At least one field that is `disabled: true`

**Verify:**
- [x] Prefilled values render correctly in visible conditional fields
- [x] Condition evaluation continues to work correctly (fields show/hide as expected)
- [x] Disabled conditional fields remain non-editable when visible

---

### Steps:

- [x] Add `resolveInitialValue` utility logic (in `Form.js`, `ConditionalForm.js`, or a shared utility file)
- [x] Update `Form.js` to accept `initialValues` prop and initialize internal state using the value resolution priority rule
- [x] Update `ConditionalForm.js` to accept `initialValues` prop and apply the same resolution logic
- [x] Update all field components to accept and forward the `disabled` prop to their underlying HTML controls
- [x] Apply appropriate disabled CSS styling (e.g., reduced opacity, `not-allowed` cursor) for visual clarity
- [x] Rebuild the library using `npm run build`
- [x] Re-link the library in `my-ui-test-app` via `npm install`
- [x] Add all four examples in `my-ui-test-app/src/App.jsx` and verify in the browser

### Output Criteria:

- [x] `initialValues` prop populates form fields on initial render for both `<Form />` and `<ConditionalForm />`
- [x] `defaultValue` is used as a fallback when the field's `name` is absent from `initialValues`
- [x] Value priority is correctly enforced: `initialValues` > `defaultValue` > empty string
- [x] `disabled: true` on a field renders it as non-editable across all supported field types
- [x] Disabled fields display their values but prevent user input
- [x] All existing form APIs remain backward compatible — no breaking changes
- [x] `npm run build` completes with no errors
- [x] Test app verifies all four examples with no console errors

---

## Task 35 - Add Custom Button System Support

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 34

**Description:**
Enhance both `<Form />` and `<ConditionalForm />` to support a configurable action button system. Currently, forms assume a fixed submit button behavior. We need a flexible system that allows consumer application developers to define custom button numbers, labels, types, callbacks, custom styling, and layout alignments while maintaining backward compatibility with the default submit behavior.

---

### Architecture & Design Requirements

- **Reusability:** The button rendering and click handler logic must be reusable across both `<Form />` and `<ConditionalForm />`.
- **Default Behavior:** If no `buttons` configuration is provided, automatically render the default submit button labeled `"Submit"`, which is equivalent to:
  ```js
  buttons: [
    {
      id: "submit",
      label: "Submit",
      type: "submit"
    }
  ]
  ```
- **Button Configuration Structure:** Support a `buttons` prop containing an array of button configuration objects:
  ```jsx
  <Form
    data={formData}
    buttons={[
      {
        id: "back",
        label: "Back",
        type: "button",
        onClick: handleBack
      },
      {
        id: "saveDraft",
        label: "Save & Complete Later",
        type: "button",
        validate: false,
        onClick: handleSaveDraft
      },
      {
        id: "submit",
        label: "Submit",
        type: "submit",
        onClick: handleSubmitClick
      }
    ]}
  />
  ```
- **Supported Button Properties:**
  - `id` (string): Unique identifier for the button.
  - `label` (string): The text displayed inside the button.
  - `type` (string): `"button"` or `"submit"`.
  - `validate` (boolean): Whether validation should run before executing the callback. By default, `type: "submit"` always runs validation, whereas `type: "button"` defaults to not running validation.
  - `onClick` (function): The callback function triggered on click, receiving latest form values (and visible values for conditional forms).
  - `className` (string): Custom CSS class for button-level styling.
  - `style` (object): Custom inline styling object for button-level customization.

- **Validation Flow:**
  - **Submit Button (`type: "submit"`) Flow:**
    User clicks Submit button → Validate visible form fields → If invalid, display error messages and abort execution → If valid, invoke button-level `onClick(formValues)` and then trigger the Form-level `onSubmit(formValues)`.
  - **Non-Submit Button (`type: "button"`) Flow:**
    User clicks Button → If `validate` is false (default), skip validation and directly invoke `onClick(formValues)`.

- **Button Callback Data:**
  - All button callbacks (`onClick`) must receive the latest form values (e.g. `onClick(formValues)`), permitting draft saving, API calls, tracking, etc.

- **Button Container Customization:**
  - Support form-level configurations to customize the buttons wrapper/container alignment:
    - `buttonContainerClassName` (string)
    - `buttonContainerStyle` (object)

- **Conditional Form Compatibility:**
  - Validation must respect visible fields only. Hidden fields must not block validation.
  - Button callbacks in `<ConditionalForm />` must receive only the currently visible form values.

---

### Test Application Requirements

Update `my-ui-test-app` to include examples verifying this functionality:

- **Example 1 — Default Submit Button:**
  ```jsx
  <Form data={formData} />
  ```
- **Example 2 — Back + Next Buttons:**
  ```text
  Back | Next
  ```
- **Example 3 — Back + Save Draft + Submit Buttons:**
  ```text
  Back | Save & Complete Later | Submit
  ```
- **Verification Criteria:**
  - Submit buttons trigger validation, show errors when invalid, and invoke both button-level `onClick` and Form-level `onSubmit` on valid submission.
  - Non-submit buttons (e.g., Back, Save Draft) bypass validation and invoke `onClick` directly.
  - All button callbacks correctly receive the latest form values (or visible form values for `<ConditionalForm />`).
  - Form-level `buttonContainerClassName` and `buttonContainerStyle` are applied correctly.
  - Button-level `className` and `style` are applied correctly.

---

### Steps:

- [x] Create a reusable button container rendering system/helper shared by both `<Form />` and `<ConditionalForm />`.
- [x] Update `<Form />` to accept `buttons`, `buttonContainerClassName`, and `buttonContainerStyle` props, defaulting to the fallback Submit button if no `buttons` array is provided.
- [x] Update `<ConditionalForm />` to support the custom buttons, passing only visible form values to the callbacks and validating only visible fields.
- [x] Implement click flow handlers that distinguish between `"submit"` and `"button"` types and conditionally trigger validation prior to calling `onClick`.
- [x] Rebuild the library (`npm run build`) and update `my-ui-test-app` dependency.
- [x] Add Example 1, 2, and 3 layouts inside `my-ui-test-app/src/App.jsx`.
- [x] Verify validation, callback parameter data, and styling customization in the browser.

### Output Criteria:

- [x] Reusable button system used by both `<Form />` and `<ConditionalForm />`.
- [x] Default submit button remains available and backward compatible when no buttons configuration is provided.
- [x] Custom buttons are customizable with unique labels, ids, classNames, and inline styles.
- [x] Submit buttons run form validation; invalid fields block the action and show error messages.
- [x] Non-submit buttons bypass validation by default and call their click handlers.
- [x] Button callbacks (`onClick`) receive the latest form values (or visible form values in `<ConditionalForm />`).
- [x] Form-level button container styling customizable via `buttonContainerClassName` and `buttonContainerStyle`.

---

## Task 36 - Add RepeatableGroup Field Type Support

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 35

**Description:**
Add support for a new field type: `repeatableGroup`. This field type allows users to dynamically add and remove groups of fields.

The feature must be supported in both `Form` and `ConditionalForm`.

### Feature Specifications:

#### 1. Basic Usage & Expected Behavior
Renders initial fields and an add button. Clicking the add button adds a new group/block of fields.
Example structure:
```js
{
  label: "Educational Qualifications",
  name: "education",
  type: "repeatableGroup",
  addButtonText: "Add Education",
  fields: [
    {
      label: "University / Board",
      name: "university",
      type: "text",
      required: true
    },
    {
      label: "Institute Name",
      name: "institute",
      type: "text",
      required: true
    },
    {
      label: "Passing Year",
      name: "passingYear",
      type: "number",
      required: true
    }
  ]
}
```

#### 2. Data Structure Requirement
Submitted form data should return repeated group fields under the repeatableGroup `name` as an array of objects:
```js
{
  education: [
    {
      university: "CBSE",
      institute: "ABC School",
      passingYear: "2018"
    },
    {
      university: "MAKAUT",
      institute: "XYZ College",
      passingYear: "2022"
    }
  ]
}
```
The library should internally manage the repeated field instances.

#### 3. Remove Entry Support
Each repeated block should support removal. Users should be able to remove any block (e.g. rendering a "Remove" button or icon for each block).
Example:
```text
Education 1                         [Remove]

University / Board
Institute Name
Passing Year
```

#### 4. Minimum and Maximum Entries
Support:
- `minItems`: prevent removing below `minItems` (default should be respected if provided, e.g., `minItems: 1`).
- `maxItems`: prevent adding beyond `maxItems` (e.g., `maxItems: 10`).
Show appropriate validation messages when limits are reached or when trying to violate the bounds.

#### 5. Grid Support
Nested fields inside `repeatableGroup` must support the existing responsive 12-column grid layout and normalization fallback logic.
Example nested field configuration:
```js
fields: [
  {
    label: "University",
    name: "university",
    type: "text",
    grid: { md: 4 }
  },
  ...
]
```

#### 6. Conditional Rendering Support
Conditional rendering must work inside repeatable groups. Rule evaluation must happen independently inside each repeated block based on its local block values.

#### 7. Initial Values Support
Support prefilling repeatableGroup fields from the form-level `initialValues` prop (e.g., `initialValues: { education: [ ... ] }`). The form should render the corresponding blocks automatically.

#### 8. Disabled Field Support
Nested fields inside repeatableGroup must respect the field-level `disabled: true` property and existing disabled behavior.

#### 9. Add Control Customization
Add support for configurable add controls:
```js
addControl: {
  type: "button", // "button" | "icon" | "icon-with-text"
  label: "Add Education",
  position: "footer-right", // "header-left" | "header-right" | "footer-left" | "footer-right" | "footer-center"
  className: "add-btn",
  style: {}
}
```

#### 10. Remove Control Customization
Add support for configurable remove controls:
```js
removeControl: {
  type: "icon-with-text", // "button" | "icon" | "icon-with-text"
  label: "Remove",
  position: "block-header-right", // position configuration
  className: "remove-btn",
  style: {}
}
```

#### 11. Custom Styling and ClassNames
Allow users to customize appearance without changing functionality by passing `className` and `style` within `addControl` and `removeControl` configurations.

### Architecture Requirements:
- Create a dedicated reusable `RepeatableGroup` component.
- This must be implemented as a field type and NOT as a new form component (i.e., do not create `RepeatableForm`, etc.).
- The feature must integrate into the existing dynamic field rendering system (e.g., mapped via `fieldMapper` and managed within the form's state).

### Test Application Requirements:
Update `my-test-ui-app` with a complete RepeatableGroup example (e.g., Educational Qualifications: University/Board, Institute Name, Passing Year) and verify:
1. Add entry functionality
2. Remove entry functionality
3. minItems behavior
4. maxItems behavior
5. Grid layout support
6. Validation support
7. Conditional rendering support
8. Initial values support
9. Disabled field support
10. Add control positions
11. Remove control positions
12. Form submission structure

Add separate examples showing:
- header-right add button
- footer-right add button
- icon-only add control
- icon-with-text add control

---

### Steps:
- [x] Create `RepeatableGroup` field component files (`RepeatableGroup.js`, `RepeatableGroup.css`, `index.js`).
- [x] Register `repeatableGroup` field type in `fieldMapper.js` and export it from the library index.
- [x] Implement group instance state management and data output serialization in `Form` and `ConditionalForm`.
- [x] Implement `minItems` and `maxItems` boundaries and validation messages.
- [x] Integrate grid support and conditional evaluation context updates to resolve conditions per-group.
- [x] Add `addControl` and `removeControl` layout configuration and custom styling options.
- [x] Update `my-test-ui-app` with the complete integration demo covering all 12 validation points.

### Output Criteria:
- [x] `repeatableGroup` is registered as a standard field type supported in both `<Form />` and `<ConditionalForm />`.
- [x] Data structure maps nested inputs correctly under the repeatable group key name on submit.
- [x] Add and remove buttons/icons render at configured positions with user styles.
- [x] Grid, validations, conditional visibility, disabled status, and initial values all work correctly in nested blocks.
- [x] No regressions to existing form components or single-field operations.
- [x] Test application includes interactive validation demos.

---

### Task 37 — Add Content Field Type Support

**Status:** `[x] Done`
**Assignee:** Rajiv

**Description:**
Create a new field type named `content`. The content field should allow users to render static or conditional content inside both `Form` and `ConditionalForm`.

**Use Cases:**
- Section headings
- Sub-headings
- Informational text
- Instructions
- Warnings
- Conditional messages
- HTML content (future-ready support)

**Examples:**
```json
{
  "type": "content",
  "variant": "heading",
  "content": "Personal Information"
}
```
```json
{
  "type": "content",
  "variant": "text",
  "content": "Please fill all required fields."
}
```
```json
{
  "type": "content",
  "content": "Welcome",
  "textAlign": "center"
}
```

**Requirements:**
- Support in Form
- Support in ConditionalForm
- Support conditional rendering using existing condition engine
- Support grid layout
- Support className
- Support inline style
- Support disabled condition evaluation logic (content should still render when condition is satisfied)
- Support variants: `heading`, `subHeading`, `text`
- Alignment Support: `left`, `center`, `right`

**Global Styling Support:**
Extend formStyles:
```jsx
formStyles={{
  content: {},
  contentHeading: {},
  contentSubHeading: {},
  contentText: {},
  contentGap: "16px"
}}
```

**Style Priority:**
Library Default Styles → `formStyles` Variant Styles → `field.style`
Field-level styles must override global styles.

**Steps:**
- [x] Create `ContentField` component.
- [x] Implement support for `heading`, `subHeading`, and `text` variants.
- [x] Add alignment support (`left`, `center`, `right`).
- [x] Integrate styling priority (Library Defaults -> Global `formStyles` -> Field-level `style`).
- [x] Register `content` field type in `fieldMapper.js` and ensure it works in both `<Form />` and `<ConditionalForm />`.
- [x] Support conditional rendering using the existing condition engine.
- [x] Support grid layout and `className`.

**Output Criteria:**
- [x] `content` field type renders properly in Form and ConditionalForm.
- [x] Styling follows the correct priority and aligns text as requested.
- [x] Content fields render correctly when conditions are satisfied, even if disabled condition evaluation logic exists.
- [x] Test application includes examples for all 3 variants, 3 alignments, conditional rendering, grid usage, and global/field-level styling.

---

### Task 38 — Enhance Number Field Validation & Restrictions

**Status:** `[x] Done`
**Assignee:** Rajiv

**Description:**
Add advanced validation options for `NumberField` supporting maximum digits, decimal precision, and integer-only mode.

**Support & Examples:**
- Maximum Digits: 
```json
{ "label": "Passing Year", "name": "passingYear", "type": "number", "maxDigits": 4 }
```
Should prevent values longer than 4 digits.
- Decimal Precision: 
```json
{ "label": "Amount", "name": "amount", "type": "number", "precision": 2 }
```
(Valid: 100.25, Invalid: 100.256)
- Integer-only Mode: 
```json
{ "type": "number", "precision": 0 }
```
Should only allow whole numbers.

**Validation Requirements:**
- Real-time validation
- Submit validation
- Existing error handling integration
- Existing custom error message support
- Existing required validation compatibility

**Steps:**
- [x] Update `NumberField.js` to accept `maxDigits` and `precision` properties.
- [x] Implement real-time validation to restrict inputs visually when possible.
- [x] Implement submit validation integrated with existing error handling and custom error messages.
- [x] Ensure compatibility with existing required validation.

**Output Criteria:**
- [x] Users cannot enter values exceeding `maxDigits`.
- [x] `precision: 2` correctly limits decimal places, and `precision: 0` restricts input to whole numbers.
- [x] Real-time and submit validations work flawlessly and show custom error messages.
- [x] Test application includes examples for `maxDigits`, `precision 0`, `precision 2`, validation failures, and custom error messages.

---

### Task 39 — Add Prefix / Suffix Support for Text & Number Fields

**Status:** `[x] Done`
**Assignee:** Rajiv

**Description:**
Allow text and number fields to display static content before or after the input value. Supported Fields: `TextField`, `NumberField`.

**Prefix/Suffix Examples:**
```json
{ "type": "number", "prefix": "$" }
```
Result: `$ [________]`
```json
{ "type": "number", "suffix": "%" }
```
Result: `[________] %`
```json
{ "type": "number", "prefix": "$", "suffix": "USD" }
```

**Styling Support:**
Field Level:
```json
{
  "prefixStyle": {},
  "suffixStyle": {}
}
```
Global Level:
```jsx
formStyles={{
  prefix: {},
  suffix: {}
}}
```

**Requirements:**
- Prefix/Suffix should always remain visible
- User cannot edit prefix/suffix values
- Input value should remain clean in submitted data
- Validation should operate only on actual field value
- Compatible with disabled fields
- Compatible with grid system
- Compatible with ConditionalForm
- Compatible with existing field styling system

**Steps:**
- [ ] Update `TextField` and `NumberField` to accept `prefix`, `suffix`, `prefixStyle`, and `suffixStyle` props.
- [ ] Update `formStyles` to accept global `prefix` and `suffix` styling.
- [ ] Wrap the `input` inside a container that renders the prefix and/or suffix.
- [ ] Ensure the prefix/suffix cannot be edited and do not pollute the actual submitted field value.
- [ ] Make the changes compatible with disabled fields, grid system, ConditionalForm, and validation logic.

**Output Criteria:**
- [ ] Prefix and suffix remain visible and uneditable.
- [ ] Submitted data is clean (only the input value).
- [ ] Styling cascades correctly from global `formStyles` to field-level `prefixStyle`/`suffixStyle`.
- [ ] Test application includes examples for dollar amounts, percentages, weights, currency with prefix/suffix, text with prefix, disabled fields, global styling usage, and inline styling usage.

---

### Task 40 — Add MultiSelect Field Support

**Status:** `[x] Done`

**Objective:**
Create a new reusable field component:

```text
multiSelect
```

This field should allow users to select multiple values from a predefined list of options.

The field should work in:
* Form
* ConditionalForm

**Example:**
```js
{
  label: "Skills",
  name: "skills",
  type: "multiSelect",

  options: [
    "React",
    "JavaScript",
    "Node.js"
  ]
}
```

**Expected UI behavior:**
* User can open dropdown
* User can select multiple options
* Selected values should be displayed inside the field as tags/chips

**Example:**
```text
Skills

[React ×] [JavaScript ×]

▼
----------------
React
JavaScript
Node.js
----------------
```

**Submitted data should return:**
```js
{
  skills: [
    "React",
    "JavaScript"
  ]
}
```

**Requirements:**
* Support multiple selections
* Support deselect/remove selected values
* Support required validation
* Support existing error handling
* Support disabled state
* Support initialValues

**Example:**
```js
initialValues:{
  skills:[
    "React",
    "Node.js"
  ]
}
```

**Search Support:**
Add optional search functionality.

Example:
```js
{
 type:"multiSelect",

 searchable:true
}
```
User should be able to search inside available options.

**Support maximum selection limit:**
Example:
```js
{
 type:"multiSelect",

 maxSelection:3
}
```
Prevent selecting more than the allowed number.

**Options should support both:**
Simple:
```js
[
 "React",
 "Angular"
]
```
and object format:
```js
[
 {
   label:"React",
   value:"react"
 }
]
```

**Styling Support:**
Integrate with existing form styling system.

Add support for:
```js
formStyles={{
  dropdown:{},
  option:{},
  selectedOption:{},
  tag:{}
}}
```

Also support field level:
```js
{
 className:"",
 style:{}
}
```

**Compatibility:**
Must support:
* Grid layout
* Conditional rendering
* Validation
* Disabled fields
* Initial values
* Form submission

**Test App Requirement:**
Add examples in `my-test-ui-app` showing:
* Basic multiSelect
* Searchable multiSelect
* Required multiSelect
* Disabled multiSelect
* maxSelection example
* Initial values example
* Custom styling example

**General Architecture Requirement:**
Create a reusable common base component for dropdown/select based fields.

Example:
```text
components/
 ├── SelectBase
 ├── SelectField
 ├── MultiSelectField
 └── TypeAheadField
```
`SelectBase` should manage common functionality:
- dropdown rendering
- option list rendering
- search handling
- keyboard interaction
- selection handling
- loading state
- empty state
- common styling

`MultiSelectField` and `TypeAheadField` should extend/reuse `SelectBase` instead of duplicating logic.
Do not duplicate dropdown logic between fields. Maintain reusable architecture for future dropdown based components.

---

### Task 41 — Add TypeAhead Field Support

**Status:** `[x] Done`

**Objective:**
Create a new reusable field component:

```text
typeAhead
```

This field should support searching and selecting values dynamically.

The field should work in:
* Form
* ConditionalForm

**Example:**
```js
{
 label:"Company",
 name:"company",
 type:"typeAhead"
}
```

**Expected behavior:**
User types:
```text
mic
```
Dropdown should show:
```text
Microsoft
Microsoft India
Microsoft Azure
```
User can select one option.

**Submitted data example:**
```js
{
 company:"Microsoft"
}
```

**Requirements:**
* Support dynamic searching
* Support async option loading
* Support loading states
* Support no-result state
* Support selecting a suggestion
* Support clearing selected value
* Support disabled state
* Support required validation
* Support existing error handling
* Support initialValues

**API Design:**
Support callback:
```js
{
 type:"typeAhead",

 loadOptions: async(searchValue)=>{

   return [
     {
       label:"Microsoft",
       value:"microsoft"
     }
   ]

 }
}
```
The component should call `loadOptions` when the user searches.

**Support minimum search characters:**
Example:
```js
{
 type:"typeAhead",

 minSearchLength:3
}
```
Do not call API before the minimum characters are entered.

**Options should support:**
```js
[
 {
   label:"",
   value:""
 }
]
```

**Styling Support:**
Integrate with existing formStyles.

Support:
```js
formStyles={{
 dropdown:{},
 option:{},
 selectedOption:{}
}}
```

Support field level:
```js
{
 className:"",
 style:{}
}
```

**Compatibility:**
Must support:
* Grid layout
* Conditional rendering
* Validation
* Disabled fields
* Initial values
* Form submission

**Test App Requirement:**
Add examples in `my-test-ui-app` showing:
* Static typeAhead example
* Async search example
* Loading state
* No result state
* Required validation
* Disabled typeAhead
* Conditional rendering example
* Custom styling example

---

### Task 42 — Exclude Display-Only Fields from Form Submission

**Status:** `[x] Done`

**Assignee:** AI

**Depends On:** Task 37, Task 41

**Objective:**
Ensure that display-only fields such as `type: "content"` are never treated as form input fields.

**Requirements:**

* `type: "content"` should NOT be included in the submitted form data.
* It should NOT be stored in the internal form state.
* It should NOT participate in validation.
* It should NOT trigger `onChange` or value updates.
* It should still support:
  * Conditional rendering
  * Grid layout
  * Global `formStyles`
  * Inline `style`
  * `className`
* Existing behavior for all input fields must remain unchanged.

**Acceptance Criteria:**

* Content fields are rendered correctly.
* Form submission excludes all content fields.
* Validation ignores content fields.
* No regression in `Form` or `ConditionalForm`.

---

### Task 43 — Support TypeAhead inside RepeatableGroup

**Status:** `[x] Done`

**Depends On:** Task 36, Task 41

**Objective:**
Fix TypeAhead so that it works correctly inside RepeatableGroup.

**Requirements:**

Each repeated row must maintain its own:

* selected value
* search text
* dropdown state
* loading state
* options list

TypeAhead inside RepeatableGroup should behave exactly the same as outside RepeatableGroup.

**Verification:**

* Adding new rows works correctly.
* Removing rows does not affect other rows.
* Searching in one row does not update another row.
* Async loading works independently for every row.
* Validation continues working correctly.

**Acceptance Criteria:**

* Multiple RepeatableGroup rows can contain TypeAhead fields.
* Every row behaves independently.
* No shared state between rows.

---

### Task 44 — Support Both Synchronous and Asynchronous TypeAhead

**Status:** `[x] Done`

**Depends On:** Task 41

**Objective:**
Enhance the TypeAhead component so that developers can provide either a synchronous JavaScript function or an asynchronous Promise.

**Current Limitation:**

Only async functions are supported.

**Required Behavior:**

Support both:

Example 1 (Synchronous):
```js
loadOptions: (searchText) => {
    return data.filter(...)
}
```

Example 2 (Asynchronous):
```js
loadOptions: async (searchText) => {
    const response = await fetch(...)
    return response.data;
}
```

Internally detect whether the return value is a Promise.

If Promise:
* Show loading state.
* Await completion.
* Render options.

If Array:
* Render immediately.

**Acceptance Criteria:**

* Existing async implementations continue working.
* Sync implementations also work.
* No API changes required for existing users.

---

### Task 45 — Add Field Size Support

**Status:** `[x] Done`

**Depends On:** Task 41

**Objective:**
Allow every supported field to render in multiple predefined sizes.

**Supported Sizes:**

* `small`
* `medium` (default)
* `large`

The `size` property should affect:

* input height
* padding
* font size
* icons
* chips
* dropdowns
* buttons
* textareas
* typeAhead
* select
* multiSelect

**Example:**
```js
{
    label: "Email",
    type: "email",
    size: "small"
}
```

**Global Support:**

Allow users to configure the default size through `formStyles`.

Example:
```js
formStyles={{
    size: "medium"
}}
```

Field-level `size` should override the global `size`.

**Acceptance Criteria:**

* All supported fields respect `size`.
* Existing forms continue working.
* Default remains `medium`.

---

### Task 46 — Create SliderField Component

**Status:** `[x] Done`

**Depends On:** Task 45

**Objective:**
Create a new SliderField component for selecting numeric values using a draggable slider.

**Supported Properties:**

* `label`
* `name`
* `min`
* `max`
* `step`
* `defaultValue`
* `disabled`
* `required`
* `grid`
* `style`
* `className`
* `size`
* `condition`

**Behavior:**

* Allow dragging the slider.
* Display current selected value.
* Participate in validation.
* Submit numeric value.
* Work inside `Form`.
* Work inside `ConditionalForm`.

**Future Extensibility:**

The component architecture should make it easy to support future variants such as:

* rating
* emoji
* custom thumb icons

without requiring major code changes.

**Acceptance Criteria:**

* Slider works in `Form`.
* Slider works in `ConditionalForm`.
* Validation works.
* Submitted value is numeric.

---

### Testing — Verify All New Features in Test App

**Status:** `[x] Done`

**Depends On:** Task 42, Task 43, Task 44, Task 45, Task 46

**Objective:**
Update `my-test-ui-app` to include demonstrations for all new features.

**Test App Examples:**

1. Content field not appearing in submitted data.
2. TypeAhead inside RepeatableGroup.
3. Synchronous `loadOptions` example.
4. Asynchronous `loadOptions` example.
5. Small / Medium / Large field size comparison.
6. SliderField example.

**Verification:**

Verify all examples manually after implementation.

Do not stop after code changes.
Run `my-test-ui-app` and ensure every new feature behaves correctly without breaking any existing functionality.

**Acceptance Criteria:**

* All six examples render and function correctly.
* No regressions in existing test app examples.
* All new features are demonstrated end-to-end.

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

Task 11 (Form Component Structure)     ← Phase 2 start
  └── Task 12 (Dynamic Field Rendering)
       └── Task 13 (Form CSS — Column Layout)
            └── Task 14 (Export & Local Test Form)

Task 15 (Fields Folder Structure)      ← Phase 3 start
  └── Task 16 (BaseField Wrapper)
       ├── Task 17 (TextField)
       ├── Task 18 (EmailField)
       ├── Task 19 (PasswordField)
       ├── Task 20 (CheckboxField)
       └── Task 21 (RadioField)
            └── Task 22 (fieldMapper Utility)
                 └── Task 23 (Refactor Form.js)
                      └── Task 24 (Export All & Full Local Test)
                           └── Task 25 (Reusable Form Validation & Errors)
                                └── Task 26 (Reusable Form State Handling)
                                     └── Task 27 (Global & Field-Level Styling Customization)
                                          └── Task 28 (Enhance Styling System with Global Label Gap and Field-Level Label Styling)
                                                └── Task 29 (Implement multiple selection checkboxGroup field)
                                                     └── Task 30 (Create ConditionalForm Component)
                                                          └── Task 31 (Add CheckboxGroup Conditional Rendering Support)
                                                                └── Task 32 (Add Responsive Grid Layout Support)
                                                                     └── Task 33 (Default Grid Fallback Support)
                                                                          └── Task 34 (Initial Values & Disabled Field Support) [Done]
                                                                               └── Task 35 (Custom Button System Support) [Done]
                                                                                    └── Task 36 (RepeatableGroup Field Type Support)
                                                                                         └── Task 37 (Add Content Field Type Support)
                                                                                              └── Task 38 (Enhance Number Field Validation & Restrictions)
                                                                                                   └── Task 39 (Add Prefix / Suffix Support for Text & Number Fields)
                                                                                                        └── Task 40 (Add MultiSelect Field Support)
                                                                                                             └── Task 41 (Add TypeAhead Field Support)
                                                                                                                  ├── Task 42 (Exclude Display-Only Fields from Form Submission)
                                                                                                                  ├── Task 43 (Support TypeAhead inside RepeatableGroup)
                                                                                                                  ├── Task 44 (Support Both Sync and Async TypeAhead)
                                                                                                                  └── Task 45 (Add Field Size Support)
                                                                                                                       └── Task 46 (Create SliderField Component)
                                                                                                                            └── Testing (Verify All New Features)
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

*Last updated: 2026-06-08 | Conversation ID: 6d11314a-5f8a-4ff2-872e-2d1cab1bd633*
