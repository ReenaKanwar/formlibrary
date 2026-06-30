import './Form.css';
import { fieldMapper } from '../../utils/fieldMapper';
import { useState } from 'react';
import { normalizeGrid } from '../../utils/normalizeGrid';
import { resolveInitialValue } from '../../utils/resolveInitialValue';
import { evaluateCondition } from '../../utils/conditionEvaluator';

export function Form({ data = [], onSubmit, onChange, formStyles = {}, initialValues, buttons, buttonContainerClassName, buttonContainerStyle }) {
    const [values, setValues] = useState(() => {
        const initial = {};
        data.forEach((field) => {
            const key = field.name || field.label;
            if (field.type === 'repeatableGroup') {
                // Prefill with initialValues array, else start with one empty block (or minItems blocks)
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
            // e is the new array directly (passed from RepeatableGroup component)
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

    const handleButtonClick = (e, btnConfig) => {
        e.preventDefault();
        const shouldValidate = btnConfig.validate !== undefined ? btnConfig.validate : btnConfig.type === 'submit';

        let hasErrors = false;
        const newErrors = {};

        if (shouldValidate) {
            data.forEach((field) => {
                const key = field.name || field.label;
                const val = values[key];

                if (field.type === 'repeatableGroup') {
                    const groupVals = Array.isArray(val) ? val : [];
                    let hasGroupErrors = false;
                    const groupErrors = {};

                    (field.fields || []).forEach(() => {}); // intentional no-op, validation is per-block below

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
                } else if (field.type === 'number') {
                    if (field.required && !field.disabled && (val === undefined || val === null || val === "")) {
                        newErrors[key] = field.errorMessage || "This is a required field.";
                        hasErrors = true;
                    } else if (val !== undefined && val !== null && val !== "") {
                        const strVal = String(val);
                        if (field.precision !== undefined) {
                            const parts = strVal.split('.');
                            if (field.precision === 0 && parts.length > 1) {
                                newErrors[key] = field.errorMessage || "Only whole numbers are allowed.";
                                hasErrors = true;
                            } else if (parts.length > 1 && parts[1].length > field.precision) {
                                newErrors[key] = field.errorMessage || `Maximum ${field.precision} decimal places allowed.`;
                                hasErrors = true;
                            }
                        }
                        if (!newErrors[key] && field.maxDigits !== undefined) {
                            const digitCount = strVal.replace(/[^0-9]/g, '').length;
                            if (digitCount > field.maxDigits) {
                                newErrors[key] = field.errorMessage || `Maximum ${field.maxDigits} digits allowed.`;
                                hasErrors = true;
                            }
                        }
                    }
                } else if (field.type !== 'content') {
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
                            fields={field.fields}
                            minItems={field.minItems}
                            maxItems={field.maxItems}
                            addButtonText={field.addButtonText}
                            addControl={field.addControl}
                            removeControl={field.removeControl}
                            variant={field.variant}
                            content={field.content}
                            textAlign={field.textAlign}
                            maxDigits={field.maxDigits}
                            precision={field.precision}
                            prefix={field.prefix}
                            suffix={field.suffix}
                            prefixStyle={field.prefixStyle}
                            suffixStyle={field.suffixStyle}
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
                            searchable={field.searchable}
                            maxSelection={field.maxSelection}
                            loadOptions={field.loadOptions}
                            minSearchLength={field.minSearchLength}
                            isClearable={field.isClearable}
                            placeholder={field.placeholder}
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
