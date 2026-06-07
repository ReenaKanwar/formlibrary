import './SelectField.css';
import { BaseField } from '../BaseField';

export function SelectField({ label, required, errorMessage, value, onChange, options, formStyles = {}, className, style, labelStyle, labelGap, disabled }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <select
        className={`select-field__input ${className || ''}`}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      >
        <option value="" disabled>Select an option</option>
        {options && options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </BaseField>
  );
}

