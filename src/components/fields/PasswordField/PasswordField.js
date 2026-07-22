import './PasswordField.css';
import { BaseField } from '../BaseField';

export function PasswordField({ label, required, errorMessage, value, onChange, placeholder, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size}>
      <input
        className={`password-field__input ${className || ''}`}
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        disabled={disabled}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}

