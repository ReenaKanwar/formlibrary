import './FileField.css';
import { BaseField } from '../BaseField';

export function FileField({ labelPosition, labelWidth, labelAlign, labelVariant, fieldVariant, width, minWidth, maxWidth,  label, required, errorMessage, onChange, accept, formStyles = {}, className, style, labelStyle, labelGap, disabled, size, value }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size} labelPosition={labelPosition} labelWidth={labelWidth} labelAlign={labelAlign} labelVariant={labelVariant} fieldVariant={fieldVariant} width={width} minWidth={minWidth} maxWidth={maxWidth} hasValue={!!value || (Array.isArray(value) && value.length > 0)}>
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

