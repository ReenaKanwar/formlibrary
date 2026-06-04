import './FileField.css';
import { BaseField } from '../BaseField';

export function FileField({ label, required, errorMessage, onChange, accept, formStyles = {}, className, style, labelStyle, labelGap }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <input
        className={`file-field__input ${className || ''}`}
        type="file"
        onChange={onChange}
        accept={accept}
        required={required}
        style={{ ...(formStyles.input || {}), ...(style || {}) }}
      />
    </BaseField>
  );
}
