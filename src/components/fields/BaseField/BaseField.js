import './BaseField.css';

export function BaseField({ label, required, errorMessage, children, formStyles = {}, labelStyle = {}, labelGap, size }) {
  const containerStyle = { ...(formStyles.fieldWrapper || {}) };
  if (labelGap) {
    containerStyle.gap = labelGap;
  }

  const mergedLabelStyle = {
    ...(formStyles.label || {}),
    ...(labelStyle || {}),
  };

  const resolvedSize = size || formStyles.size || 'medium';
  const sizeClass = `base-field--size-${resolvedSize}`;

  return (
    <div className={`base-field ${sizeClass}`} style={containerStyle}>
      {label && (
        <label className="base-field__label" style={mergedLabelStyle}>
          {label}
          {required && <span className="base-field__required"> *</span>}
        </label>
      )}
      {children}
      {errorMessage && <span className="base-field__error" style={formStyles.error || {}}>{errorMessage}</span>}
    </div>
  );
}
