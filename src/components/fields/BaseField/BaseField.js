import './BaseField.css';

export function BaseField({ label, required, errorMessage, children, formStyles = {}, labelStyle = {}, labelGap }) {
  const containerStyle = { ...(formStyles.fieldWrapper || {}) };
  if (labelGap) {
    containerStyle.gap = labelGap;
  }

  const mergedLabelStyle = {
    ...(formStyles.label || {}),
    ...(labelStyle || {}),
  };

  return (
    <div className="base-field" style={containerStyle}>
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
