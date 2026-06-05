# 📦 React UI Component Library — Team Task Board

> **Project Name:** `formLibrary`
> **Goal:** Build a reusable, production-structured React component library using Vite in library mode, export a `Button` component, and verify it end-to-end in a companion test app.
> **Workspace Root:** `C:\Users\Rajiv Kumar\Desktop\my\Lib\`

---

## 🗂️ Project Structure Overview

```
Lib/
├── formLibrary/          ← The component library (Phase 1 & 2)
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

**Status:** `[x] Done`
**Assignee:** Rajiv

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

**Status:** `[x] Done`
**Assignee:** Rajiv

**Depends On:** Task 4

**Description:**
Create the CSS file for the `Button` component at `formLibrary/src/components/Button/Button.css`. Styles must be scoped using specific class names to avoid global leakage.

**Steps:**
1. Create `Button.css` inside `formLibrary/src/components/Button/`.
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

**Status:** `[x] Done`
**Assignee:** Rajiv

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
     "formLibrary": "file:../formLibrary"
   }
   ```
5. Run `npm install` again to install the local library link.

**Output Criteria:**
- `my-ui-test-app/` folder exists with a working Vite React scaffold.
- `node_modules/formLibrary/` is present in the test app's `node_modules`.

---

### Task 9 — Integrate the Library into the Test App (`App.jsx`)

**Status:** `[x] Done`
**Assignee:** reena

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

**Status:** `[x] Done`
**Assignee:** Rajiv

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

### Task 11 — Create Reusable `Form` Component Structure

**Status:** `[x] Done`
**Assignee:** reena

**Depends On:** Task 3 (Barrel src/index.js)

**Description:**
Create the folder and file scaffolding for the new `Form` component inside the library. The `Form` component accepts a `data` prop (an array of field config objects) and dynamically renders the appropriate form fields based on each item's `type`.

**Steps:**
1. Create the folder: `formLibrary/src/components/Form/`.
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
import { Form } from 'formLibrary';

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
1. Open `formLibrary/src/components/Form/Form.css`.
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
  import { Form } from 'formLibrary';
  ```

**Steps:**
1. Open `formLibrary/src/index.js` and add the Form export:
   ```js
   export { Button } from './components/Button';
   export { Form }   from './components/Form';   // ← Add this line
   ```
2. Run `npm run build` inside `formLibrary/` to rebuild the `dist/` output.
3. Re-link the library in `my-ui-test-app/` (run `npm install` inside the test app).
4. Open `my-ui-test-app/src/App.jsx` and add a test render:
   ```jsx
   import { Button, Form } from 'formLibrary';
   import 'formLibrary/dist/style.css';

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
1. Inside `formLibrary/src/components/`, create a new folder named `fields/`.
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
4. Also create the `utils/` folder at `formLibrary/src/utils/` and add an empty `fieldMapper.js` file.

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
1. Open `formLibrary/src/components/fields/BaseField/BaseField.js`.
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
1. Open `formLibrary/src/components/fields/TextField/TextField.js`.
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
1. Open `formLibrary/src/utils/fieldMapper.js`.
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
1. Open `formLibrary/src/components/Form/Form.js` and replace its implementation:
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
1. Open `formLibrary/src/index.js` and ensure all exports are present:
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
2. Run `npm run build` inside `formLibrary/` to rebuild `dist/`.
3. Run `npm install` inside `my-ui-test-app/` to re-link the updated library.
4. Open `my-ui-test-app/src/App.jsx` and add a test render covering all field types:
   ```js
   import { Form } from 'formLibrary';
   import 'formLibrary/dist/style.css';

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
- The library supports `import { Form } from "formLibrary"` as the only consumer import.
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
Add a new `checkboxGroup` field type to `formLibrary` that supports multiple selections from a given array of options. Update the `CheckboxGroupField` CSS to allow natural flex layout without forcing a `flex-direction: column`, enabling developers to control layout via the `style` prop. Verify by providing single-column and multi-column examples in the local test app.

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

*Last updated: 2026-06-04 | Conversation ID: 17adbd17-e4dd-4640-a3ca-6513f4eaf0b4*
