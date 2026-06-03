import './CheckboxField.css';
import { BaseField } from '../BaseField';

export function CheckboxField({ label, required, checked, onChange }) {
  return (
    <BaseField label="" required={false}>
      <label className="checkbox-field__container">
        <input
          className="checkbox-field__input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
        />
        <span className="checkbox-field__label-text">
          {label}
          {required && <span className="checkbox-field__required"> *</span>}
        </span>
      </label>
    </BaseField>
  );
}
