import './PasswordField.css';
import { BaseField } from '../BaseField';

export function PasswordField({ label, required, value, onChange, placeholder }) {
  return (
    <BaseField label={label} required={required}>
      <input
        className="password-field__input"
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
      />
    </BaseField>
  );
}
