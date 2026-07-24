import './FileField.css';
import { BaseField } from '../BaseField';

export function FileField({ label, required, errorMessage, onChange, accept, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size}>
      <input
        className={`file-field__input ${className || ''}`}
        type="file"
        onChange={onChange}
        accept={accept}
        required={required}
        disabled={disabled}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}

