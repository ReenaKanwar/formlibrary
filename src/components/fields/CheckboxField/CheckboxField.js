import './CheckboxField.css';
import { BaseField } from '../BaseField';

export function CheckboxField({ labelPosition, labelWidth, labelAlign, labelVariant, fieldVariant, width, minWidth, maxWidth,  label, required, errorMessage, checked, onChange, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  return (
    <BaseField label="" required={false} errorMessage={errorMessage} formStyles={formStyles} labelGap={labelGap} size={size} labelPosition={labelPosition} labelWidth={labelWidth} labelAlign={labelAlign} labelVariant={labelVariant} fieldVariant={fieldVariant} width={width} minWidth={minWidth} maxWidth={maxWidth} hasValue={!!checked}>
      <label className={`checkbox-field__container ${className || ''}`} style={style || {}}>
        <input
          className="checkbox-field__input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          style={formStyles.input || {}}
        />
        <span className="checkbox-field__label-text" style={{ ...(formStyles.label || {}), ...(labelStyle || {}) }}>
          {label}
          {required && <span className="checkbox-field__required"> *</span>}
        </span>
      </label>
    </BaseField>
  );
}

