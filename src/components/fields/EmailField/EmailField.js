import './EmailField.css';
import { BaseField } from '../BaseField';

export function EmailField({ label, required, errorMessage, value, onChange, formStyles = {}, className, style, labelStyle, labelGap, disabled }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <input
        className={`email-field__input ${className || ''}`}
        type="email"
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
        disabled={disabled}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}

