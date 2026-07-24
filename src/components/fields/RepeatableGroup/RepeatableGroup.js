import './RepeatableGroup.css';
import { BaseField } from '../BaseField';
import { fieldMapper } from '../../../utils/fieldMapper';
import { normalizeGrid } from '../../../utils/normalizeGrid';
import { evaluateCondition } from '../../../utils/conditionEvaluator';
import { useState, useEffect } from 'react';

export function RepeatableGroup(props) {
  const {
    label, required, errorMessage, className, style,
    formStyles = {}, labelGap, labelStyle, disabled,
    name, value, onChange, fields = [],
    minItems = 0, maxItems = Infinity,
    addButtonText = 'Add', addControl, removeControl,
    size
  } = props;

  let currentValues = Array.isArray(value) ? value : [];
  if (currentValues.length < minItems) {
    const padded = [...currentValues];
    while (padded.length < minItems) padded.push({});
    currentValues = padded;
  }

  // ─── stable keys for nested components with state ────────────────────
  const [rowKeys, setRowKeys] = useState(() => currentValues.map(() => crypto.randomUUID()));

  useEffect(() => {
    // Sync rowKeys length if currentValues changes externally
    if (currentValues.length !== rowKeys.length) {
      setRowKeys(prev => {
        if (currentValues.length > prev.length) {
          const newKeys = Array(currentValues.length - prev.length).fill(0).map(() => crypto.randomUUID());
          return [...prev, ...newKeys];
        } else {
          return prev.slice(0, currentValues.length);
        }
      });
    }
  }, [currentValues.length]);

  // ─── position helpers ────────────────────────────────────────────────
  const addPos    = addControl?.position    || 'footer-right';
  const removePos = removeControl?.position || 'block-header-right';

  // ─── handlers ────────────────────────────────────────────────────────
  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (currentValues.length >= maxItems) return;
    setRowKeys(prev => [...prev, crypto.randomUUID()]);
    onChange([...currentValues, {}]);
  };

  const handleRemove = (index, e) => {
    if (e) e.preventDefault();
    if (currentValues.length <= minItems) return;
    setRowKeys(prev => prev.filter((_, i) => i !== index));
    const next = [...currentValues];
    next.splice(index, 1);
    onChange(next);
  };

  const handleNestedChange = (index, fieldConfig, e) => {
    const val = fieldConfig.type === 'checkbox'          ? e.target.checked
              : fieldConfig.type === 'file' && e.target.files ? e.target.files[0]
              : e.target.value;
    const key = fieldConfig.name || fieldConfig.label;
    const next = [...currentValues];
    if (!next[index]) next[index] = {};
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };

  // ─── add button node (reusable) ──────────────────────────────────────
  const renderAddBtn = () => {
    if (currentValues.length >= maxItems) return null;
    const cfg = addControl || { type: 'button', label: addButtonText };
    if (cfg.type === 'icon') {
      return (
        <button
          type="button"
          className={`repeatable-group__add-icon ${cfg.className || ''}`.trim()}
          style={cfg.style}
          onClick={handleAdd}
          disabled={disabled}
        >+</button>
      );
    }
    if (cfg.type === 'icon-with-text') {
      return (
        <button
          type="button"
          className={`repeatable-group__add-btn repeatable-group__add-icon-text ${cfg.className || ''}`.trim()}
          style={cfg.style}
          onClick={handleAdd}
          disabled={disabled}
        >
          <span className="repeatable-group__icon">+</span>
          {cfg.label || addButtonText}
        </button>
      );
    }
    return (
      <button
        type="button"
        className={`repeatable-group__add-btn ${cfg.className || ''}`.trim()}
        style={cfg.style}
        onClick={handleAdd}
        disabled={disabled}
      >
        {cfg.label || addButtonText}
      </button>
    );
  };

  // ─── remove button node (reusable) ───────────────────────────────────
  const renderRemoveBtn = (index) => {
    if (currentValues.length <= minItems) return null;
    const cfg = removeControl || { type: 'icon-with-text', label: 'Remove' };
    if (cfg.type === 'icon') {
      return (
        <button
          type="button"
          className={`repeatable-group__remove-icon ${cfg.className || ''}`.trim()}
          style={cfg.style}
          onClick={(e) => handleRemove(index, e)}
          disabled={disabled}
        >×</button>
      );
    }
    if (cfg.type === 'button') {
      return (
        <button
          type="button"
          className={`repeatable-group__remove-btn ${cfg.className || ''}`.trim()}
          style={cfg.style}
          onClick={(e) => handleRemove(index, e)}
          disabled={disabled}
        >
          {cfg.label || 'Remove'}
        </button>
      );
    }
    // default: icon-with-text
    return (
      <button
        type="button"
        className={`repeatable-group__remove-btn repeatable-group__remove-icon-text ${cfg.className || ''}`.trim()}
        style={cfg.style}
        onClick={(e) => handleRemove(index, e)}
        disabled={disabled}
      >
        <span className="repeatable-group__icon">×</span>
        {cfg.label || 'Remove'}
      </button>
    );
  };

  // ─── positional add-control wrappers ─────────────────────────────────
  // Each wrapper is a full-width flex row with alignment driven by CSS class.
  const renderAddArea = (position) => {
    if (addPos !== position) return null;
    const btn = renderAddBtn();
    if (!btn) return null;
    // Map position → CSS modifier
    const mod = position === 'header-left'   ? 'left'
               : position === 'header-right'  ? 'right'
               : position === 'footer-left'   ? 'left'
               : position === 'footer-right'  ? 'right'
               : position === 'footer-center' ? 'center'
               : 'left';
    return (
      <div className={`repeatable-group__add-area repeatable-group__add-area--${mod}`}>
        {btn}
      </div>
    );
  };

  // ─── block header: title + remove ────────────────────────────────────
  const renderBlockHeader = (index) => {
    const title = <span className="repeatable-group__block-title">{label || 'Item'} {index + 1}</span>;
    const removeBtn = renderRemoveBtn(index);

    if (removePos === 'block-header-left') {
      return (
        <div className="repeatable-group__block-header repeatable-group__block-header--remove-left">
          {removeBtn}
          {title}
        </div>
      );
    }
    // default: block-header-right — title left, remove right
    return (
      <div className="repeatable-group__block-header repeatable-group__block-header--remove-right">
        {title}
        {removeBtn}
      </div>
    );
  };

  // ─── render ──────────────────────────────────────────────────────────
  return (
    <BaseField
      label={label}
      required={required}
      errorMessage={typeof errorMessage === 'string' ? errorMessage : undefined}
      formStyles={formStyles}
      labelStyle={labelStyle}
      labelGap={labelGap}
      size={size}
    >
      <div className={`repeatable-group ${className || ''}`.trim()} style={style}>

        {/* Header add-control area */}
        {renderAddArea('header-left')}
        {renderAddArea('header-right')}

        {/* Block list */}
        <div className="repeatable-group__items">
          {currentValues.map((blockValue, index) => {
            const blockErrors = (typeof errorMessage === 'object' && errorMessage !== null)
              ? errorMessage[index] : {};

            return (
              <div key={rowKeys[index] || index} className="repeatable-group__block">

                {renderBlockHeader(index)}

                {/* Nested fields in grid wrapper */}
                <div
                  className="repeatable-group__block-body form-wrapper"
                  style={{ ...(formStyles.formContainer || {}), width: '100%' }}
                >
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
                          {...fieldConfig}
                          name={fKey}
                          value={blockValue[fKey] !== undefined ? blockValue[fKey] : ''}
                          checked={!!blockValue[fKey]}
                          onChange={(e) => handleNestedChange(index, fieldConfig, e)}
                          errorMessage={blockErrors ? blockErrors[fKey] : undefined}
                          formStyles={formStyles}
                          labelGap={formStyles.labelGap}
                          disabled={disabled || !!fieldConfig.disabled}
                        />
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer add-control area */}
        {renderAddArea('footer-left')}
        {renderAddArea('footer-center')}
        {renderAddArea('footer-right')}

      </div>
    </BaseField>
  );
}
