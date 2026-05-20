import './BaseField.css';

export function BaseField({ label, required, children }) {
  return (
    <div className="base-field">
      <label className="base-field__label">
        {label}
        {required && <span className="base-field__required"> *</span>}
      </label>
      {children}
    </div>
  );
}
