/**
 * Resolves the initial value for a form field using the following priority:
 * 1. initialValues[field.name]  — highest priority (form-level prop)
 * 2. field.defaultValue         — field-level fallback
 * 3. ''                         — empty string as last resort
 *
 * @param {object} field         - The field configuration object
 * @param {object} initialValues - The initialValues prop passed to Form / ConditionalForm
 * @returns {*} The resolved initial value
 */
export function resolveInitialValue(field, initialValues) {
  const key = field.name || field.label;

  if (initialValues && initialValues[key] !== undefined) {
    return initialValues[key];
  }

  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  // CheckboxGroup defaults to an empty array
  if (field.type === 'checkboxGroup') {
    return [];
  }

  // Checkbox defaults to false
  if (field.type === 'checkbox') {
    return false;
  }

  return '';
}
