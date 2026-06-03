import './TextAreaField.css';
import { BaseField } from '../BaseField';

export function TextAreaField({ label, required, value, onChange, placeholder, rows = 4 }) {
  return (
    <BaseField label={label} required={required}>
      <textarea
        className="textarea-field__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        rows={rows}
      />
    </BaseField>
  );
}
