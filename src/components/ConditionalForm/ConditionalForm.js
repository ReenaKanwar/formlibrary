import './ConditionalForm.css';
import { fieldMapper } from '../../utils/fieldMapper';
import { useState } from 'react';
import { evaluateCondition } from '../../utils/conditionEvaluator';
import { normalizeGrid } from '../../utils/normalizeGrid';

export function ConditionalForm({ data = [], onSubmit, onChange, formStyles = {} }) {
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

  // Pre-calculate visible fields based on the condition evaluating to true.
  const visibleFields = data.filter(field => {
    if (!field.condition) return true;
    return evaluateCondition(field.condition, values);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;

    // Only validate currently visible fields
    visibleFields.forEach((field) => {
      const key = field.name || field.label;
      if (field.required) {
        const val = values[key];
        const isEmpty = val === undefined || val === null || val === "" || val === false || (Array.isArray(val) && val.length === 0);
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

    // Submit only the visible field values
    const submittedValues = {};
    visibleFields.forEach(field => {
      const key = field.name || field.label;
      if (values[key] !== undefined) {
         submittedValues[key] = values[key];
      }
    });

    if (onSubmit) {
      onSubmit(submittedValues);
    }
  };

  const containerStyle = { ...(formStyles.formContainer || {}) };
  if (formStyles.grid) {
    if (formStyles.grid.rowGap) containerStyle.rowGap = formStyles.grid.rowGap;
    if (formStyles.grid.columnGap) containerStyle.columnGap = formStyles.grid.columnGap;
  }

  return (
    <form className="conditional-form-wrapper" onSubmit={handleSubmit} noValidate style={containerStyle}>
      {visibleFields.map((field, index) => {
        const FieldComponent = fieldMapper[field.type];

        if (!FieldComponent) {
          console.warn(`ConditionalForm: unknown field type "${field.type}"`);
          return null;
        }

        const key = field.name || field.label;

        const gridConfig = normalizeGrid(field.grid);
        let gridClasses = 'form-grid-item';
        if (gridConfig.xs) gridClasses += ` grid-col-xs-${gridConfig.xs}`;
        if (gridConfig.sm) gridClasses += ` grid-col-sm-${gridConfig.sm}`;
        if (gridConfig.md) gridClasses += ` grid-col-md-${gridConfig.md}`;
        if (gridConfig.lg) gridClasses += ` grid-col-lg-${gridConfig.lg}`;

        return (
          <div key={index} className={gridClasses}>
            <FieldComponent
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
          </div>
        );
      })}

      <div className="conditional-form-submit-btn-wrapper">
        <button type="submit" className="conditional-form-submit-btn">Submit</button>
      </div>
    </form>
  );
}
