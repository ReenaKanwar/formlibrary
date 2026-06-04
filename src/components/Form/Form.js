import './Form.css';
import { fieldMapper } from '../../utils/fieldMapper';
import { useState } from 'react';

export function Form({ data = [], onSubmit, onChange, formStyles = {} }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (field, e) => {
    const value = field.type === 'checkbox' ? e.target.checked : 
                  field.type === 'file' && e.target.files ? e.target.files[0] : 
                  e.target.value;
                  
    const key = field.name || field.label;
    const nextValues = { ...values, [key]: value };
    
    setValues(nextValues);
    
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
    
    if (onChange) {
      onChange(nextValues);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;

    data.forEach((field) => {
      const key = field.name || field.label;
      if (field.required) {
        const val = values[key];
        const isEmpty = val === undefined || val === null || val === "" || val === false;
        if (isEmpty) {
          newErrors[key] = field.errorMessage || "This is a required field.";
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit} noValidate style={formStyles.formContainer || {}}>
      {data.map((field, index) => {
        const FieldComponent = fieldMapper[field.type];

        if (!FieldComponent) {
          console.warn(`Form: unknown field type "${field.type}"`);
          return null;
        }

        const key = field.name || field.label;

        return (
          <FieldComponent
            key={index}
            name={key}
            label={field.label}
            required={field.required}
            options={field.options}
            value={values[key] || ''}
            checked={!!values[key]}
            onChange={(e) => handleChange(field, e)}
            errorMessage={errors[key]}
            formStyles={formStyles}
            className={field.className}
            style={field.style}
            labelStyle={field.labelStyle}
            labelGap={formStyles.labelGap}
          />
        );
      })}

      <button type="submit" className="form-submit-btn">Submit</button>
    </form>
  );
}
