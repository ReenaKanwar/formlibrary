import './NumberField.css';
import { BaseField } from '../BaseField';

export function NumberField({ label, required, errorMessage, value, onChange, placeholder, min, max, step, maxDigits, precision, prefix, suffix, prefixStyle, suffixStyle, formStyles = {}, className, style, labelStyle, labelGap, disabled, size }) {
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val) {
      if (maxDigits !== undefined) {
        const digitCount = val.replace(/[^0-9]/g, '').length;
        if (digitCount > maxDigits) return;
      }
      if (precision !== undefined) {
        const parts = val.split('.');
        if (precision === 0 && parts.length > 1) return;
        if (parts.length > 1 && parts[1].length > precision) return;
      }
    }
    if (onChange) {
      onChange(e);
    }
  };

  const mergedPrefixStyle = { ...(formStyles.prefix || {}), ...(prefixStyle || {}) };
  const mergedSuffixStyle = { ...(formStyles.suffix || {}), ...(suffixStyle || {}) };

  const baseInputStyle = { ...(formStyles.input || {}), ...(style || {}) };

  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap} size={size}>
      {(prefix || suffix) ? (
        <div className={`prefix-suffix-wrapper ${prefix ? 'has-prefix' : ''} ${suffix ? 'has-suffix' : ''} ${disabled ? 'is-disabled' : ''} ${className || ''}`} style={baseInputStyle}>
          {prefix && <span className="field-prefix" style={mergedPrefixStyle}>{prefix}</span>}
          <input
            className="number-field__input inner-input"
            type="number"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder || label}
            required={required}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
          {suffix && <span className="field-suffix" style={mergedSuffixStyle}>{suffix}</span>}
        </div>
      ) : (
        <input
          className={`number-field__input ${className || ''}`}
          type="number"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder || label}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          style={baseInputStyle}
        />
      )}
    </BaseField>
  );
}

