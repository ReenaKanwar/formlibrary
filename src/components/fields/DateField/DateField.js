import './DateField.css';
import { BaseField } from '../BaseField';

export function DateField({ label, required, errorMessage, value, onChange, formStyles = {}, className, style, labelStyle, labelGap, disabled }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <input
        className={`date-field__input ${className || ''}`}
        type="date"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}

