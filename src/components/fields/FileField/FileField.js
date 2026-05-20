import './FileField.css';
import { BaseField } from '../BaseField';

export function FileField({ label, required, onChange, accept }) {
  return (
    <BaseField label={label} required={required}>
      <input
        className="file-field__input"
        type="file"
        onChange={onChange}
        accept={accept}
        required={required}
      />
    </BaseField>
  );
}
