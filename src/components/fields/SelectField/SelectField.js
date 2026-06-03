import './SelectField.css';
import { BaseField } from '../BaseField';

export function SelectField({ label, required, value, onChange, options }) {
  return (
    <BaseField label={label} required={required}>
      <select
        className="select-field__input"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled>Select an option</option>
        {options && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </BaseField>
  );
}
