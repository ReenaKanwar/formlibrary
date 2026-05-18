# formLibrary

A reusable, production-structured React component library built with Vite in library mode. 
It currently exports a customizable `Button` component and is designed to be easily extensible.

## Installation

**Local Installation (File-based link):**
In your consumer React app's `package.json`, add the following dependency pointing to the local directory:
```json
"dependencies": {
  "formLibrary": "file:../formLibrary"
}
```
Then run:
```bash
npm install
```

*(Future NPM Installation: `npm install formLibrary`)*

## CSS Import

To use the library's styles, you must import its compiled CSS file at the root of your React app (e.g., in `main.jsx` or `App.jsx`):
```javascript
import 'formLibrary/dist/style.css';
```

## Usage Example

```jsx
import { Button } from 'formLibrary';
import 'formLibrary/dist/style.css'; // Ensure CSS is imported

function App() {
  return (
    <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
      <Button 
        label="Click Me" 
        variant="primary" 
        onClick={() => alert("Primary Clicked")} 
      />
      <Button 
        label="Cancel" 
        variant="secondary" 
        onClick={() => alert("Secondary Clicked")} 
      />
    </div>
  );
}

export default App;
```

## Props Table (`Button`)

| Prop        | Type     | Default     | Description                        |
|-------------|----------|-------------|------------------------------------|
| `label`     | string   | —           | The text displayed inside the button |
| `onClick`   | function | —           | Click event handler function       |
| `variant`   | string   | `'primary'` | Visual style: `'primary'` or `'secondary'` |
| `className` | string   | `''`        | Optional extra CSS classes         |
| `style`     | object   | `{}`        | Optional inline style overrides    |

## Build Command

To compile the library for production (outputs to `dist/`):
```bash
npm run build
```

## Local Testing Walkthrough

1. Scaffold a test app: `npx create-vite@latest my-ui-test-app --template react`
2. Run `npm run build` inside this library (`formLibrary`).
3. In `my-ui-test-app/package.json`, add `"formLibrary": "file:../formLibrary"` to `dependencies`.
4. Run `npm install` in `my-ui-test-app/`.
5. Import `Button` and `formLibrary/dist/style.css` in your test app's code.
6. Run `npm run dev` in the test app to verify it works in the browser.

## Contributing

To add a new component to the library:
1. Create a new folder under `src/components/` (e.g., `Input/`).
2. Add your React component (`Input.jsx`), scoped CSS (`Input.css`), and an `index.js` re-export file.
3. Export the new component from the main barrel file at `src/index.js`.
4. Run `npm run build` to update the `dist/` bundles.
