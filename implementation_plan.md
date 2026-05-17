# React UI Component Library — Implementation Plan

A complete, production-structured React component library (`my-ui-library`) built with Vite in library mode, exporting a reusable `Button` component, and locally tested via `npm link` in a companion test app.

---

## Proposed Changes

### Phase 1 — Library Project (`my-ui-library`)

Located at: `c:\Users\Rajiv Kumar\Desktop\my\Lib\my-ui-library\`

#### [NEW] `package.json`
- `name`: `my-ui-library`
- `version`: `1.0.0`
- `main`: `dist/my-ui-library.umd.js`
- `module`: `dist/my-ui-library.es.js`
- `exports` field pointing to ES and UMD builds
- `peerDependencies`: `react`, `react-dom`
- `devDependencies`: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
- Scripts: `build`, `dev`

#### [NEW] `vite.config.js`
- Vite **library mode** config
- Entry: `src/index.js`
- Formats: `es`, `umd`
- Library name: `MyUILibrary`
- Externalize `react` and `react-dom` (so consumer's React is used, not bundled)
- Output to `dist/`
- CSS handled inline / separate via Vite

#### [NEW] `src/index.js`
- Central export barrel:
  ```js
  export { Button } from './components/Button';
  ```

#### [NEW] `src/components/Button/Button.js`
- Functional component with props: `label`, `onClick`, `variant`, `className`, `style`
- Variants: `primary` (filled/colored), `secondary` (outlined)
- Applies CSS classes based on variant
- No hardcoded app logic — pure UI component

#### [NEW] `src/components/Button/Button.css`
- Base `.btn` class (padding, border-radius, cursor, font, transition)
- `.btn-primary` — solid background, white text
- `.btn-secondary` — outlined, colored border, transparent background
- Hover/focus states for both variants

#### [NEW] `src/components/Button/index.js`
- Re-exports: `export { default as Button } from './Button';`

#### [NEW] `README.md`
- Installation steps (npm link / local file)
- Import examples
- Props table
- Build command
- Local testing walkthrough

---

### Phase 2 — Test App (`my-ui-test-app`)

Located at: `c:\Users\Rajiv Kumar\Desktop\my\Lib\my-ui-test-app\`

A minimal Vite + React app created to verify the library works end-to-end.

#### Steps:
1. Scaffold with `npx create-vite@latest my-ui-test-app --template react`
2. Run `npm install` inside test app
3. Inside `my-ui-library/`: run `npm run build`
4. Inside `my-ui-test-app/package.json`: add `"my-ui-library": "file:../my-ui-library"` as a dependency, then `npm install`
5. Update `src/App.jsx` to import `<Button>` from `my-ui-library` and import `my-ui-library/dist/style.css`
6. Run `npm run dev` to verify in browser

---

## Verification Plan

### Build Verification
- `npm run build` in `my-ui-library` — confirm `dist/` folder is generated with `.es.js` and `.umd.js` files

### Local Link Verification
- `npm link` in library → `npm link my-ui-library` in test app
- Run test app dev server → confirm Button renders with correct `primary` / `secondary` variants
- Confirm no React duplicate instance errors (peer dep externalization check)

### Browser Check
- `primary` Button: solid colored background, white label
- `secondary` Button: outlined style, colored border
- `onClick` prop fires correctly
- `className` and `style` props are forwarded properly

---

## Open Questions

> [!IMPORTANT]
> **Where should the projects be created?**
> Based on your workspace, I'll create both projects under:
> `c:\Users\Rajiv Kumar\Desktop\my\Lib\`
> — i.e., `my-ui-library/` and `my-ui-test-app/` side by side.
> Let me know if you prefer a different location.

> [!NOTE]
> **CSS bundling** ✅ **Chosen**: Vite outputs a separate `dist/style.css`. Consumers do one import: `import 'my-ui-library/dist/style.css'`. This is the cleanest approach — styles stay co-located with the build, no runtime injection complexity.

> [!NOTE]
> **Local testing** ✅ **Chosen**: `"my-ui-library": "file:../my-ui-library"` in test app's `package.json` + `npm install`. No global symlinks, works cleanly across projects, and reflects how a real local monorepo consumer would reference it.
