import './TextField.css';
import { BaseField } from '../BaseField';

export function TextField({ label, required, errorMessage, value, onChange, placeholder, formStyles = {}, className, style, labelStyle, labelGap }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <input
        className={`text-field__input ${className || ''}`}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}
