import './TextAreaField.css';
import { BaseField } from '../BaseField';

export function TextAreaField({ labelPosition, labelWidth, labelAlign, labelVariant, fieldVariant, width, minWidth, maxWidth,  label, required, errorMessage, value, onChange, placeholder, rows = 4, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size} labelPosition={labelPosition} labelWidth={labelWidth} labelAlign={labelAlign} labelVariant={labelVariant} fieldVariant={fieldVariant} width={width} minWidth={minWidth} maxWidth={maxWidth} hasValue={!!value || (Array.isArray(value) && value.length > 0)}>
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

