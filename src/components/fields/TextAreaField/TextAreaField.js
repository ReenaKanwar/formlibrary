import './TextAreaField.css';
import { BaseField } from '../BaseField';

export function TextAreaField({ label, required, errorMessage, value, onChange, placeholder, rows = 4, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size}>
      <textarea
        className={`textarea-field__input ${className || ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        rows={rows}
        disabled={disabled}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}

