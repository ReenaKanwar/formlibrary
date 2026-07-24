import './RadioField.css';
import { BaseField } from '../BaseField';

export function RadioField({ label, required, errorMessage, value, onChange, options, name, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size}>
      <div className={`radio-field__options ${className || ''}`} style={style || {}}>
        {options && options.map((option) => (
          <label key={option.value || option} className="radio-field__option-label" style={formStyles.label || {}}>
            <input
              className="radio-field__input"
              type="radio"
              name={name || label}
              value={option.value || option}
              checked={value === (option.value || option)}
              onChange={onChange}
              required={required}
              disabled={disabled}
              style={formStyles.input || {}}
            />
            <span className="radio-field__option-text">{option.label || option}</span>
          </label>
        ))}
      </div>
    </BaseField>
  );
}

