import './RepeatableGroup.css';
import { BaseField } from '../BaseField';
import { fieldMapper } from '../../../utils/fieldMapper';
import { normalizeGrid } from '../../../utils/normalizeGrid';
import { evaluateCondition } from '../../../utils/conditionEvaluator';

export function RepeatableGroup(props) {
  const {
    label, required, errorMessage, className, style,
    formStyles = {}, labelGap, labelStyle, disabled,
    name, value, onChange, fields = [],
    minItems = 0, maxItems = Infinity,
    addButtonText = "Add", addControl, removeControl
  } = props;

  let currentValues = Array.isArray(value) ? value : [];
  
  if (currentValues.length < minItems) {
      // pad currentValues to meet minItems during render, but this doesn't trigger onChange immediately
      // it's better if it's handled by Form/ConditionalForm initially, but we pad it here to ensure UI displays them.
      const padded = [...currentValues];
      while (padded.length < minItems) {
          padded.push({});
      }
      currentValues = padded;
  }

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (currentValues.length >= maxItems) return;
    onChange([...currentValues, {}]);
  };

  const handleRemove = (index, e) => {
    if (e) e.preventDefault();
    if (currentValues.length <= minItems) return;
    const newValues = [...currentValues];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const handleNestedChange = (index, fieldConfig, e) => {
    const val = fieldConfig.type === 'checkbox' ? e.target.checked :
                fieldConfig.type === 'file' && e.target.files ? e.target.files[0] :
                e.target.value;
    const key = fieldConfig.name || fieldConfig.label;
    
    const newValues = [...currentValues];
    if (!newValues[index]) newValues[index] = {};
    newValues[index] = { ...newValues[index], [key]: val };
    
    onChange(newValues);
  };

  const renderAddControl = (position) => {
    const defaultControl = { type: 'button', label: addButtonText, position: 'footer-right' };
    const config = addControl || defaultControl;
    if (config.position !== position) return null;
    
    if (currentValues.length >= maxItems) return null;

    if (config.type === 'icon') {
        return (
            <button type="button" className={`repeatable-group__add-icon ${config.className || ''}`.trim()} style={config.style} onClick={handleAdd} disabled={disabled}>
                +
            </button>
        );
    }
    if (config.type === 'icon-with-text') {
        return (
            <button type="button" className={`repeatable-group__add-btn repeatable-group__add-icon-text ${config.className || ''}`.trim()} style={config.style} onClick={handleAdd} disabled={disabled}>
                <span className="icon">+</span> {config.label || 'Add'}
            </button>
        );
    }
    return (
        <button type="button" className={`repeatable-group__add-btn ${config.className || ''}`.trim()} style={config.style} onClick={handleAdd} disabled={disabled}>
            {config.label || 'Add'}
        </button>
    );
  };

  const renderRemoveControl = (index, position) => {
    const defaultControl = { type: 'icon-with-text', label: 'Remove', position: 'block-header-right' };
    const config = removeControl || defaultControl;
    if (config.position !== position) return null;

    if (currentValues.length <= minItems) return null;

    if (config.type === 'icon') {
        return (
            <button type="button" className={`repeatable-group__remove-icon ${config.className || ''}`.trim()} style={config.style} onClick={(e) => handleRemove(index, e)} disabled={disabled}>
                ×
            </button>
        );
    }
    if (config.type === 'button') {
        return (
            <button type="button" className={`repeatable-group__remove-btn ${config.className || ''}`.trim()} style={config.style} onClick={(e) => handleRemove(index, e)} disabled={disabled}>
                {config.label || 'Remove'}
            </button>
        );
    }
    return (
        <button type="button" className={`repeatable-group__remove-btn repeatable-group__remove-icon-text ${config.className || ''}`.trim()} style={config.style} onClick={(e) => handleRemove(index, e)} disabled={disabled}>
            <span className="icon">×</span> {config.label || 'Remove'}
        </button>
    );
  };

  return (
    <BaseField label={label} required={required} errorMessage={typeof errorMessage === 'string' ? errorMessage : undefined} formStyles={formStyles} labelStyle={labelStyle} labelGap={labelGap}>
      <div className={`repeatable-group ${className || ''}`.trim()} style={style}>
        
        <div className="repeatable-group__controls-container repeatable-group__header-controls">
            {renderAddControl('header-left')}
            {renderAddControl('header-right')}
        </div>

        <div className="repeatable-group__items">
            {currentValues.map((blockValue, index) => {
                const blockErrors = (typeof errorMessage === 'object' && errorMessage !== null) ? errorMessage[index] : {};
                
                return (
                    <div key={index} className="repeatable-group__block">
                        <div className="repeatable-group__block-header">
                            {renderRemoveControl(index, 'block-header-left')}
                            <span className="repeatable-group__block-title">{label || 'Item'} {index + 1}</span>
                            {renderRemoveControl(index, 'block-header-right')}
                        </div>
                        
                        <div className="repeatable-group__block-body form-wrapper" style={{ ...(formStyles.formContainer || {}), width: '100%' }}>
                            {fields.map((fieldConfig, fIndex) => {
                                if (fieldConfig.condition && !evaluateCondition(fieldConfig.condition, blockValue)) {
                                    return null;
                                }

                                const FieldComponent = fieldMapper[fieldConfig.type];
                                if (!FieldComponent) return null;

                                const fKey = fieldConfig.name || fieldConfig.label;
                                
                                const gridConfig = normalizeGrid(fieldConfig.grid);
                                let gridClasses = 'form-grid-item';
                                if (gridConfig.xs) gridClasses += ` grid-col-xs-${gridConfig.xs}`;
                                if (gridConfig.sm) gridClasses += ` grid-col-sm-${gridConfig.sm}`;
                                if (gridConfig.md) gridClasses += ` grid-col-md-${gridConfig.md}`;
                                if (gridConfig.lg) gridClasses += ` grid-col-lg-${gridConfig.lg}`;

                                return (
                                    <div key={fIndex} className={gridClasses}>
                                        <FieldComponent
                                            name={fKey}
                                            label={fieldConfig.label}
                                            required={fieldConfig.required}
                                            options={fieldConfig.options}
                                            value={blockValue[fKey] !== undefined ? blockValue[fKey] : ''}
                                            checked={!!blockValue[fKey]}
                                            onChange={(e) => handleNestedChange(index, fieldConfig, e)}
                                            errorMessage={blockErrors ? blockErrors[fKey] : undefined}
                                            formStyles={formStyles}
                                            className={fieldConfig.className}
                                            style={fieldConfig.style}
                                            labelStyle={fieldConfig.labelStyle}
                                            labelGap={formStyles.labelGap}
                                            disabled={disabled || !!fieldConfig.disabled}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="repeatable-group__controls-container repeatable-group__block-footer">
                            {renderRemoveControl(index, 'block-footer-left')}
                            {renderRemoveControl(index, 'block-footer-right')}
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="repeatable-group__controls-container repeatable-group__footer-controls">
            {renderAddControl('footer-left')}
            {renderAddControl('footer-center')}
            {renderAddControl('footer-right')}
        </div>
      </div>
    </BaseField>
  );
}
