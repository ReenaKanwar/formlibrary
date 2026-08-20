import './SliderField.css';
import { BaseField } from '../BaseField';
import { useState } from 'react';

export function SliderField({ labelPosition, labelWidth, labelAlign, labelVariant, fieldVariant, width, minWidth, maxWidth, 
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
  defaultValue,
  variant = 'default',
  allowHalf = false,
  icons = []
}) {
  const [hoverValue, setHoverValue] = useState(null);

  // Ensure displayValue stays within bounds for default variant
  let displayValue = value !== undefined && value !== '' ? Number(value) : (defaultValue !== undefined ? Number(defaultValue) : min);
  if (variant === 'default') {
      if (displayValue < min) displayValue = min;
      if (displayValue > max) displayValue = max;
  }

  const handleChange = (newValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  const renderDefaultSlider = () => (
    <>
      <input
        type="range"
        className="slider-field__input"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled={disabled}
      />
      <div className="slider-field__value-display">
        {displayValue}
      </div>
    </>
  );

  const renderRating = () => {
    const stars = [];
    const currentValue = hoverValue !== null ? hoverValue : displayValue;
    
    for (let i = 1; i <= max; i++) {
      const isFilled = i <= currentValue;
      const isHalf = allowHalf && !isFilled && i - 0.5 === currentValue;

      stars.push(
        <div
          key={i}
          className={`slider-field__star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''} ${disabled ? 'disabled' : ''}`}
          onMouseLeave={() => !disabled && setHoverValue(null)}
        >
          {allowHalf && (
            <div
              className="slider-field__star-half-left"
              onMouseEnter={() => !disabled && setHoverValue(i - 0.5)}
              onClick={() => handleChange(i - 0.5)}
            />
          )}
          <div
            className={`slider-field__star-full ${allowHalf ? 'has-half' : ''}`}
            onMouseEnter={() => !disabled && setHoverValue(i)}
            onClick={() => handleChange(i)}
          >
            ★
          </div>
        </div>
      );
    }
    return <div className="slider-field__rating-container">{stars}</div>;
  };

  const renderIcons = () => {
    return (
      <div className="slider-field__icons-container">
        {icons.map((item, index) => {
          const isSelected = displayValue === item.value;
          return (
            <div
              key={index}
              className={`slider-field__icon-item ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => handleChange(item.value)}
              title={item.label}
            >
              <span className="slider-field__icon-emoji">{item.icon}</span>
              {item.label && <span className="slider-field__icon-label">{item.label}</span>}
            </div>
          );
        })}
      </div>
    );
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
     labelPosition={labelPosition} labelWidth={labelWidth} labelAlign={labelAlign} labelVariant={labelVariant} fieldVariant={fieldVariant} width={width} minWidth={minWidth} maxWidth={maxWidth} hasValue={!!value || (Array.isArray(value) && value.length > 0)}>
      <div className={`slider-field-wrapper variant-${variant} ${className || ''}`.trim()} style={style}>
        {variant === 'default' && renderDefaultSlider()}
        {variant === 'rating' && renderRating()}
        {variant === 'icons' && renderIcons()}
      </div>
    </BaseField>
  );
}
