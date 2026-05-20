import './NumberField.css';
import { BaseField } from '../BaseField';

export function NumberField({ label, required, value, onChange, placeholder, min, max, step }) {
  return (
    <BaseField label={label} required={required}>
      <input
        className="number-field__input"
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        min={min}
        max={max}
        step={step}
      />
    </BaseField>
  );
}
