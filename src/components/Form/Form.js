import './Form.css';
import { fieldMapper } from '../../utils/fieldMapper';

export function Form({ data = [], onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      {data.map((field, index) => {
        const FieldComponent = fieldMapper[field.type];

        if (!FieldComponent) {
          console.warn(`Form: unknown field type "${field.type}"`);
          return null;
        }

        return (
          <FieldComponent
            key={index}
            label={field.label}
            required={field.required}
            options={field.options}
          />
        );
      })}

      <button type="submit" className="form-submit-btn">Submit</button>
    </form>
  );
}
