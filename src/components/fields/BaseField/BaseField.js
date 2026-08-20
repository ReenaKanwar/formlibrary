import './BaseField.css';

export function BaseField({ 
  label, 
  required, 
  errorMessage, 
  children, 
  formStyles = {}, 
  labelStyle = {}, 
  labelGap, 
  size,
  labelPosition,
  labelWidth,
  labelAlign,
  labelVariant,
  fieldVariant,
  width,
  minWidth,
  maxWidth,
  hasValue
}) {
  const containerStyle = { ...(formStyles.fieldWrapper || {}) };
  
  // Resolve layout properties (Field config takes precedence over global formStyles)
  const resolvedLabelPosition = labelPosition || formStyles.labelPosition || 'top';
  const resolvedLabelWidth = labelWidth || formStyles.labelWidth;
  const resolvedLabelAlign = labelAlign || formStyles.labelAlign || 'left';
  const resolvedLabelGap = labelGap || formStyles.labelGap;
  const resolvedLabelVariant = labelVariant || formStyles.labelVariant || 'standard';
  const resolvedFieldVariant = fieldVariant || formStyles.fieldVariant || 'outlined';

  if (resolvedLabelGap) {
    containerStyle.gap = resolvedLabelGap;
  }
  if (width) containerStyle.width = width;
  if (minWidth) containerStyle.minWidth = minWidth;
  if (maxWidth) containerStyle.maxWidth = maxWidth;

  const mergedLabelStyle = {
    ...(formStyles.label || {}),
    ...(labelStyle || {}),
  };
  
  if (resolvedLabelWidth && (resolvedLabelPosition === 'left' || resolvedLabelPosition === 'right')) {
    mergedLabelStyle.width = resolvedLabelWidth;
    mergedLabelStyle.minWidth = resolvedLabelWidth;
  }
  
  if (resolvedLabelAlign) {
    mergedLabelStyle.textAlign = resolvedLabelAlign;
  }

  const resolvedSize = size || formStyles.size || 'medium';
  
  const classNames = [
    'base-field',
    `base-field--size-${resolvedSize}`,
    `base-field--label-${resolvedLabelPosition}`,
    `base-field--label-variant-${resolvedLabelVariant}`,
    `base-field--field-variant-${resolvedFieldVariant}`,
    hasValue ? 'base-field--has-value' : 'base-field--empty',
  ].join(' ');

  return (
    <div className={classNames} style={containerStyle}>
      {label && resolvedLabelPosition !== 'hidden' && (
        <label className="base-field__label" style={mergedLabelStyle}>
          {label}
          {required && <span className="base-field__required"> *</span>}
        </label>
      )}
      <div className="base-field__input-wrapper">
        {children}
        {errorMessage && <span className="base-field__error" style={formStyles.error || {}}>{errorMessage}</span>}
      </div>
    </div>
  );
}
