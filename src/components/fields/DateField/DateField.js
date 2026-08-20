import './DateField.css';
import { BaseField } from '../BaseField';

export function DateField({ labelPosition, labelWidth, labelAlign, labelVariant, fieldVariant, width, minWidth, maxWidth,  label, required, errorMessage, value, onChange, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size} labelPosition={labelPosition} labelWidth={labelWidth} labelAlign={labelAlign} labelVariant={labelVariant} fieldVariant={fieldVariant} width={width} minWidth={minWidth} maxWidth={maxWidth} hasValue={!!value || (Array.isArray(value) && value.length > 0)}>
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

