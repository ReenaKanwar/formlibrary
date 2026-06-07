import './NumberField.css';
import { BaseField } from '../BaseField';

export function NumberField({ label, required, errorMessage, value, onChange, placeholder, min, max, step, formStyles = {}, className, style, labelStyle, labelGap, disabled }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <input
        className={`number-field__input ${className || ''}`}
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}

