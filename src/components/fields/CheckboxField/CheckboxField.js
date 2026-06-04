import './CheckboxField.css';
import { BaseField } from '../BaseField';

export function CheckboxField({ label, required, errorMessage, checked, onChange, formStyles = {}, className, style, labelStyle, labelGap }) {
  return (
    <BaseField label="" required={false} errorMessage={errorMessage} formStyles={formStyles} labelGap={labelGap}>
      <label className={`checkbox-field__container ${className || ''}`} style={style || {}}>
        <input
          className="checkbox-field__input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
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
