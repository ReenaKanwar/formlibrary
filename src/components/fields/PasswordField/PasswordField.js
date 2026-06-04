import './PasswordField.css';
import { BaseField } from '../BaseField';

export function PasswordField({ label, required, errorMessage, value, onChange, placeholder, formStyles = {}, className, style, labelStyle, labelGap }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <input
        className={`password-field__input ${className || ''}`}
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}
