import { useState } from 'react';
import './SliderField.css';
import { BaseField } from '../BaseField';

export function SliderField(props) {
  const {
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
    variant = 'slider',
    emojis = ['😢', '🙁', '😐', '🙂', '😀'],
    startIcon = '🔉',
    endIcon = '🔊',
  } = props;

  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = value !== undefined && value !== '' ? Number(value) : min;

  const handleChange = (val) => {
    if (disabled) return;
    const numValue = Number(val);
    if (onChange) {
      onChange({ target: { value: numValue } });
    }
  };

  const renderSlider = () => {
    return (
      <div className="slider-field__control-wrapper">
        <input
          type="range"
          className="slider-field__input"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  };

  const renderRating = () => {
    const starCount = max > 0 ? max : 5;
    const stars = Array.from({ length: starCount }, (_, i) => i + 1);
    const activeVal = hoverValue !== null ? hoverValue : displayValue;

    return (
      <div 
        className={`slider-rating-container${disabled ? ' slider-rating-container--disabled' : ''}`}
        onMouseLeave={() => !disabled && setHoverValue(null)}
      >
        {stars.map((star) => {
          const isActive = star <= activeVal;
          return (
            <span
              key={star}
              className={`slider-rating-star${isActive ? ' slider-rating-star--active' : ''}`}
              onMouseEnter={() => !disabled && setHoverValue(star)}
              onClick={() => !disabled && handleChange(star)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  const renderEmojiSlider = () => {
    const percent = (displayValue - min) / (max - min || 1);
    const emojiIndex = Math.min(
      emojis.length - 1,
      Math.max(0, Math.floor(percent * emojis.length))
    );
    const currentEmoji = emojis[emojiIndex];

    return (
      <div className="slider-emoji-wrapper">
        <input
          type="range"
          className="slider-field__input"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        />
        <div className="slider-emoji-display" title={`${displayValue}`}>
          {currentEmoji}
        </div>
      </div>
    );
  };

  const renderIconSlider = () => {
    return (
      <div className="slider-icon-wrapper">
        <span className="slider-icon slider-icon--start">{startIcon}</span>
        <input
          type="range"
          className="slider-field__input"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        />
        <span className="slider-icon slider-icon--end">{endIcon}</span>
      </div>
    );
  };

  const renderContent = () => {
    switch (variant) {
      case 'rating':
        return renderRating();
      case 'emoji':
        return renderEmojiSlider();
      case 'icon':
        return renderIconSlider();
      case 'slider':
      default:
        return (
          <>
            {renderSlider()}
            <div className="slider-field__value-display">
              {displayValue}
            </div>
          </>
        );
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
      <div className={`slider-field-wrapper slider-field--variant-${variant} ${className || ''}`.trim()} style={style}>
        {renderContent()}
      </div>
    </BaseField>
  );
}
