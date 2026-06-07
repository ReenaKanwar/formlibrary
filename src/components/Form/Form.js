import './Form.css';
import { fieldMapper } from '../../utils/fieldMapper';
import { useState } from 'react';
import { normalizeGrid } from '../../utils/normalizeGrid';
import { resolveInitialValue } from '../../utils/resolveInitialValue';

export function Form({ data = [], onSubmit, onChange, formStyles = {}, initialValues, buttons, buttonContainerClassName, buttonContainerStyle }) {
    const [values, setValues] = useState(() => {
        const initial = {};
        data.forEach((field) => {
            const key = field.name || field.label;
            initial[key] = resolveInitialValue(field, initialValues);
        });
        return initial;
    });
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

    const handleButtonClick = (e, btnConfig) => {
        e.preventDefault();
        const shouldValidate = btnConfig.validate !== undefined ? btnConfig.validate : btnConfig.type === 'submit';

        let hasErrors = false;
        const newErrors = {};

        if (shouldValidate) {
            data.forEach((field) => {
                const key = field.name || field.label;
                if (field.required && !field.disabled) {
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
        }

        if (btnConfig.onClick) {
            btnConfig.onClick(values);
        }

        if (btnConfig.type === 'submit' && onSubmit) {
            onSubmit(values);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const defaultSubmitBtn = { id: 'submit', label: 'Submit', type: 'submit' };
        const buttonsArray = buttons || [defaultSubmitBtn];
        const submitBtn = buttonsArray.find(b => b.type === 'submit') || defaultSubmitBtn;
        handleButtonClick(e, submitBtn);
    };

    const containerStyle = { ...(formStyles.formContainer || {}) };
    if (formStyles.grid) {
        if (formStyles.grid.rowGap) containerStyle.rowGap = formStyles.grid.rowGap;
        if (formStyles.grid.columnGap) containerStyle.columnGap = formStyles.grid.columnGap;
    }

    return (
        <form className="form-wrapper" onSubmit={handleFormSubmit} noValidate style={containerStyle}>
            {data.map((field, index) => {
                const FieldComponent = fieldMapper[field.type];

                if (!FieldComponent) {
                    console.warn(`Form: unknown field type "${field.type}"`);
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
                            value={values[key] !== undefined ? values[key] : ''}
                            checked={!!values[key]}
                            onChange={(e) => handleChange(field, e)}
                            errorMessage={errors[key]}
                            formStyles={formStyles}
                            className={field.className}
                            style={field.style}
                            labelStyle={field.labelStyle}
                            labelGap={formStyles.labelGap}
                            disabled={!!field.disabled}
                        />
                    </div>
                );
            })}

            <div className={`form-submit-btn-wrapper ${buttonContainerClassName || ''}`.trim()} style={buttonContainerStyle || {}}>
                {(buttons || [{ id: 'submit', label: 'Submit', type: 'submit' }]).map((btn, idx) => (
                    <button
                        key={btn.id || idx}
                        type={btn.type === 'submit' ? 'submit' : 'button'}
                        className={`form-submit-btn ${btn.className || ''}`.trim()}
                        style={btn.style || {}}
                        onClick={(e) => handleButtonClick(e, btn)}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </form>
    );
}
