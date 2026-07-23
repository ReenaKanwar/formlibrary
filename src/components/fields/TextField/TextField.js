import './TextField.css';
import { BaseField } from '../BaseField';

export function TextField({ label, required, errorMessage, value, onChange, placeholder, prefix, suffix, prefixStyle, suffixStyle, formStyles = {}, className, style, labelStyle, labelGap, disabled }) {
  const mergedPrefixStyle = { ...(formStyles.prefix || {}), ...(prefixStyle || {}) };
  const mergedSuffixStyle = { ...(formStyles.suffix || {}), ...(suffixStyle || {}) };

  const baseInputStyle = { ...(formStyles.input || {}), ...(style || {}) };

  return (
    <BaseField label={label} required={required} errorMessage={errorMessage} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      {(prefix || suffix) ? (
        <div className={`prefix-suffix-wrapper ${prefix ? 'has-prefix' : ''} ${suffix ? 'has-suffix' : ''} ${disabled ? 'is-disabled' : ''} ${className || ''}`} style={baseInputStyle}>
          {prefix && <span className="field-prefix" style={mergedPrefixStyle}>{prefix}</span>}
          <input
            className="text-field__input inner-input"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder || label}
            required={required}
            disabled={disabled}
          />
          {suffix && <span className="field-suffix" style={mergedSuffixStyle}>{suffix}</span>}
        </div>
      ) : (
        <input
          className={`text-field__input ${className || ''}`}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          required={required}
          disabled={disabled}
          style={baseInputStyle}
        />
      )}
    </BaseField>
  );
}

