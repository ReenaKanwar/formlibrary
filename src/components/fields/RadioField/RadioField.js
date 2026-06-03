import './RadioField.css';
import { BaseField } from '../BaseField';

export function RadioField({ label, required, value, onChange, options, name }) {
  return (
    <BaseField label={label} required={required}>
      <div className="radio-field__options">
        {options && options.map((option) => (
          <label key={option.value} className="radio-field__option-label">
            <input
              className="radio-field__input"
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
            />
            <span className="radio-field__option-text">{option.label}</span>
          </label>
        ))}
      </div>
    </BaseField>
  );
}
