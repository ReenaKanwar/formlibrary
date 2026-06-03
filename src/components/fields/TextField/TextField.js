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
