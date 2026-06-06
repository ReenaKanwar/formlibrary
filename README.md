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
import { Form, ConditionalForm } from 'formLibrary';
import 'formLibrary/dist/style.css'; // Ensure CSS is imported

const formData = [
  { label: "Full Name", name: "fullName", type: "text", required: true },
  {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
    errorMessage: "Email is mandatory.",
    className: "custom-email",
    labelStyle: { color: "green", fontWeight: "bold" },
    style: { borderRadius: "10px", borderColor: "green" },
  },
  { label: "Password", name: "password", type: "password", required: true },
  { label: "Age", name: "age", type: "number", required: false },
  { label: "Birth Date", name: "birthDate", type: "date", required: false },
  { label: "Gender", name: "gender", type: "radio", options: ["Male", "Female"], required: true },
  { label: "Subscribe", name: "subscribe", type: "checkbox", required: false },
  { label: "Country", name: "country", type: "select", options: ["India", "USA", "UK"], required: false },
  { label: "Country Object", name: "countryObj", type: "select", options: [{ value: "IND", label: "India" }, { value: "USA", label: "United States of America" }, { value: "UK", label: "United Kingdom" }], required: false },
  { label: "Bio", name: "bio", type: "textarea", required: false },
  { label: "Hobbies", name: "hobbies", type: "checkboxGroup", options: ["Reading", "Sports", "Music", "Traveling"], required: false },
  { 
    label: "Skills", 
    name: "skills", 
    type: "checkboxGroup", 
    options: ["React", "Node.js", "Python", "Java"], 
    required: false,
    style: { display: "flex", gap: "5px" }
  },
  { label: "Resume", name: "resume", type: "file", required: false },
];

const conditionalFormData = [
  { label: "Are you happy?", name: "happy", type: "radio", options: ["Yes", "No"], required: true },
  { 
    label: "Describe why you are happy", 
    name: "happyReason", 
    type: "textarea", 
    required: true,
    condition: { logic: "AND", rules: [{ field: "happy", operator: "equals", value: "Yes" }] }
  },
  { 
    label: "Describe why you are not happy", 
    name: "unhappyReason", 
    type: "textarea", 
    required: true,
    condition: { logic: "AND", rules: [{ field: "happy", operator: "equals", value: "No" }] }
  },
  { label: "Age", name: "age", type: "number", required: true },
  {
    label: "Adult Happy Thoughts",
    name: "adultThoughts",
    type: "textarea",
    required: true,
    condition: {
      logic: "AND",
      rules: [
        { field: "happy", operator: "equals", value: "Yes" },
        { field: "age", operator: "greaterThan", value: 18 }
      ]
    }
  },
  {
    label: "Select Options",
    name: "selectedOptions",
    type: "checkboxGroup",
    options: [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4",
      "Option 5",
    ],
    required: true,
  },
  {
    label: "Please provide additional details",
    name: "details",
    type: "textarea",
    condition: {
      logic: "AND",
      rules: [
        {
          field: "selectedOptions",
          operator: "includes",
          value: "Option 2",
        },
        {
          field: "selectedOptions",
          operator: "includes",
          value: "Option 3",
        },
      ],
    },
  },
  {
    label: "Why did you choose Option 4?",
    name: "option4Reason",
    type: "text",
    condition: {
      logic: "AND",
      rules: [
        {
          field: "selectedOptions",
          operator: "includes",
          value: "Option 4",
        },
      ],
    },
  },
];

const gridFormData = [
  { label: "First Name", name: "firstName", type: "text", grid: { md: 6 }, required: true },
  { label: "Last Name", name: "lastName", type: "text", grid: { md: 6 }, required: true },
  { label: "Address", name: "address", type: "textarea", grid: { md: 12, xs: 12 } },
  { label: "Email", name: "email", type: "email", grid: { md: 12, xs: 12 }, required: true },
  { label: "City", name: "city", type: "text", grid: { md: 4 } },
  { label: "State", name: "state", type: "text", grid: { md: 4 } },
  { label: "Country", name: "country", type: "text", grid: { md: 4 } }
];

const gridConditionalFormData = [
  { label: "Employment Status", name: "employed", type: "radio", options: ["Yes", "No"], grid: { md: 6 }, required: true },
  { 
    label: "Company Name", 
    name: "companyName", 
    type: "text", 
    grid: { md: 6 },
    condition: { logic: "AND", rules: [{ field: "employed", operator: "equals", value: "Yes" }] },
    required: true
  },
  {
    label: "Select Options",
    name: "selectedOptions",
    type: "checkboxGroup",
    options: ["Option 1", "Option 2", "Option 3"],
    grid: { md: 12 },
    required: false,
  },
  {
    label: "Please provide additional details",
    name: "details",
    type: "textarea",
    grid: { md: 12 },
    condition: {
      logic: "AND",
      rules: [
        { field: "selectedOptions", operator: "includes", value: "Option 2" },
        { field: "selectedOptions", operator: "includes", value: "Option 3" },
      ],
    },
  }
];


function App() {

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    alert("Form Submitted:\n" + JSON.stringify(values, null, 2));
  };

  const handleChange = (values) => {
    console.log("Form Changed:", values);
  };

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
      <style>{`
        .custom-email {
          background-color: #f0fdf4 !important;
        }
      `}</style>
      
      <h1>Standard Layouts</h1>
      <div style={{ display: 'flex', gap: '60px' }}>
        <div style={{ flex: 1 }}>
          <h2>Static Form</h2>
          <Form
            data={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            formStyles={{
              formContainer: { gap: '20px', },
              labelGap: '8px',
              label: { color: 'blue', fontWeight: 'bold' },
              input: { borderRadius: '20px', padding: '12px', border: '1px solid #ccc' },
              error: { color: 'red', fontStyle: 'italic' }
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2>Conditional Form</h2>
          <ConditionalForm
            data={conditionalFormData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            formStyles={{
              formContainer: { gap: '20px', },
              labelGap: '8px',
              label: { color: 'purple', fontWeight: 'bold' },
              input: { borderRadius: '8px', padding: '10px', border: '1px solid #999' },
              error: { color: 'darkred', fontStyle: 'normal' }
            }}
          />
        </div>
      </div>

      <hr />
      <h1>Grid Layouts</h1>
      <div style={{  gap: '60px' }}>
        <div style={{ flex: 1 }}>
          <h2>Static Form (Grid)</h2>
          <Form
            data={gridFormData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            formStyles={{
              grid: { rowGap: '20px', columnGap: '16px' },
              labelGap: '8px',
              label: { color: 'blue', fontWeight: 'bold' },
              input: { borderRadius: '20px', padding: '12px', border: '1px solid #ccc' },
              error: { color: 'red', fontStyle: 'italic' }
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2>Conditional Form (Grid)</h2>
          <ConditionalForm
            data={gridConditionalFormData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            formStyles={{
              grid: { rowGap: '20px', columnGap: '16px' },
              labelGap: '8px',
              label: { color: 'purple', fontWeight: 'bold' },
              input: { borderRadius: '8px', padding: '10px', border: '1px solid #999' },
              error: { color: 'darkred', fontStyle: 'normal' }
            }}
          />
        </div>
      </div>
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
