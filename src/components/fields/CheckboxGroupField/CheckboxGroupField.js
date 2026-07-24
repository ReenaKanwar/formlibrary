import './CheckboxGroupField.css';
import { BaseField } from '../BaseField';

export function CheckboxGroupField({ label, required, errorMessage, value = [], onChange, options, name, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  const handleCheckboxChange = (e, optionValue) => {
    if (disabled) return;
    const isChecked = e.target.checked;
    let newValue = [...(Array.isArray(value) ? value : [])];
    
    if (isChecked) {
      newValue.push(optionValue);
    } else {
      newValue = newValue.filter(v => v !== optionValue);
    }

    onChange({
      target: {
        value: newValue
      }
    });
  };

  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size}>
      <div className={`checkbox-group-field__options ${className || ''}`} style={style || {}}>
        {options && options.map((option) => {
          const optValue = option.value || option;
          const optLabel = option.label || option;
          const isChecked = (Array.isArray(value) ? value : []).includes(optValue);

          return (
            <label key={optValue} className="checkbox-group-field__option-label" style={formStyles.label || {}}>
              <input
                className="checkbox-group-field__input"
                type="checkbox"
                name={name || label}
                value={optValue}
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(e, optValue)}
                required={required && (!Array.isArray(value) || value.length === 0)}
                disabled={disabled}
                style={formStyles.input || {}}
              />
              <span className="checkbox-group-field__option-text">{optLabel}</span>
            </label>
          );
        })}
      </div>
    </BaseField>
  );
}

