import './DateField.css';
import { BaseField } from '../BaseField';

export function DateField({ label, required, value, onChange }) {
  return (
    <BaseField label={label} required={required}>
      <input
        className="date-field__input"
        type="date"
        value={value}
        onChange={onChange}
        required={required}
      />
    </BaseField>
  );
}
