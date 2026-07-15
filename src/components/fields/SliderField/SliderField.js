import './SliderField.css';
import { BaseField } from '../BaseField';

export function SliderField({
  label,
  required,
  errorMessage,
  value,
  onChange,
  formStyles = {},
  className,
  style,
  labelStyle,
  labelGap,
  disabled,
  size,
  min = 0,
  max = 100,
  step = 1,
}) {
  const displayValue = value !== undefined && value !== '' ? Number(value) : min;

  const handleChange = (e) => {
    if (disabled) return;
    const numValue = Number(e.target.value);
    if (onChange) {
      onChange({ target: { value: numValue } });
    }
  };

  return (
    <BaseField
      label={label}
      required={required}
      errorMessage={errorMessage}
      formStyles={formStyles}
      labelStyle={labelStyle}
      labelGap={labelGap}
      size={size}
    >
      <div className={`slider-field-wrapper ${className || ''}`.trim()} style={style}>
        <input
          type="range"
          className="slider-field__input"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="slider-field__value-display">
          {displayValue}
        </div>
      </div>
    </BaseField>
  );
}
