import './ConditionalForm.css';
import { fieldMapper } from '../../utils/fieldMapper';
import { useState } from 'react';
import { evaluateCondition } from '../../utils/conditionEvaluator';
import { normalizeGrid } from '../../utils/normalizeGrid';
import { resolveInitialValue } from '../../utils/resolveInitialValue';

export function ConditionalForm({ data = [], onSubmit, onChange, formStyles = {}, initialValues, buttons, buttonContainerClassName, buttonContainerStyle }) {
    const [values, setValues] = useState(() => {
        const initial = {};
        data.forEach((field) => {
            const key = field.name || field.label;
            if (field.type === 'repeatableGroup') {
                const minItems = field.minItems || 0;
                const initVal = (initialValues && initialValues[key]) ? initialValues[key] : [];
                const padded = [...initVal];
                while (padded.length < minItems) padded.push({});
                initial[key] = padded.length > 0 ? padded : [{}];
            } else {
                initial[key] = resolveInitialValue(field, initialValues);
            }
        });
        return initial;
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field, e) => {
        const key = field.name || field.label;
        let value;

        if (field.type === 'repeatableGroup') {
            value = e;
        } else if (field.type === 'checkbox') {
            value = e.target.checked;
        } else if (field.type === 'file' && e.target.files) {
            value = e.target.files[0];
        } else {
            value = e.target.value;
        }

        const nextValues = { ...values, [key]: value };
        setValues(nextValues);

        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: null }));
        }

        if (onChange) {
            onChange(nextValues);
        }
    };

    // Pre-calculate visible fields based on condition evaluation
    const visibleFields = data.filter(field => {
        if (!field.condition) return true;
        return evaluateCondition(field.condition, values);
    });

    const handleButtonClick = (e, btnConfig) => {
        e.preventDefault();
        const shouldValidate = btnConfig.validate !== undefined ? btnConfig.validate : btnConfig.type === 'submit';

        let hasErrors = false;
        const newErrors = {};

        if (shouldValidate) {
            // Only validate currently visible fields
            visibleFields.forEach((field) => {
                const key = field.name || field.label;
                const val = values[key];

                if (field.type === 'repeatableGroup') {
                    const groupVals = Array.isArray(val) ? val : [];
                    let hasGroupErrors = false;
                    const groupErrors = {};

                    groupVals.forEach((blockVal, index) => {
                        let blockErrors = null;
                        (field.fields || []).forEach(subField => {
                            if (subField.condition && !evaluateCondition(subField.condition, blockVal)) {
                                return;
                            }
                            if (subField.required && !subField.disabled && !field.disabled) {
                                const subKey = subField.name || subField.label;
                                const subVal = blockVal ? blockVal[subKey] : undefined;
                                const isEmpty = subVal === undefined || subVal === null || subVal === "" || subVal === false || (Array.isArray(subVal) && subVal.length === 0);
                                if (isEmpty) {
                                    if (!blockErrors) blockErrors = {};
                                    blockErrors[subKey] = subField.errorMessage || "This is a required field.";
                                    hasErrors = true;
                                    hasGroupErrors = true;
                                }
                            }
                        });
                        if (blockErrors) {
                            groupErrors[index] = blockErrors;
                        }
                    });

                    if (hasGroupErrors) {
                        newErrors[key] = groupErrors;
                    }
                } else {
                    if (field.required && !field.disabled) {
                        const isEmpty = val === undefined || val === null || val === "" || val === false || (Array.isArray(val) && val.length === 0);
                        if (isEmpty) {
                            newErrors[key] = field.errorMessage || "This is a required field.";
                            hasErrors = true;
                        }
                    }
                }
            });

            if (hasErrors) {
                setErrors(newErrors);
                return;
            }
        }

        // Extract only the visible field values for the callback
        const submittedValues = {};
        visibleFields.forEach(field => {
            const key = field.name || field.label;
            if (values[key] !== undefined) {
                submittedValues[key] = values[key];
            }
        });

        if (btnConfig.onClick) {
            btnConfig.onClick(submittedValues);
        }

        if (btnConfig.type === 'submit' && onSubmit) {
            onSubmit(submittedValues);
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
        <form className="conditional-form-wrapper" onSubmit={handleFormSubmit} noValidate style={containerStyle}>
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
                            fields={field.fields}
                            minItems={field.minItems}
                            maxItems={field.maxItems}
                            addButtonText={field.addButtonText}
                            addControl={field.addControl}
                            removeControl={field.removeControl}
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

            <div className={`conditional-form-submit-btn-wrapper ${buttonContainerClassName || ''}`.trim()} style={buttonContainerStyle || {}}>
                {(buttons || [{ id: 'submit', label: 'Submit', type: 'submit' }]).map((btn, idx) => (
                    <button
                        key={btn.id || idx}
                        type={btn.type === 'submit' ? 'submit' : 'button'}
                        className={`conditional-form-submit-btn ${btn.className || ''}`.trim()}
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
