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
