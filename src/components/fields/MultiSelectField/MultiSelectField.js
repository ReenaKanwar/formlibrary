import './MultiSelectField.css';
import { BaseField } from '../BaseField';
import { SelectBase } from '../SelectBase';

export function MultiSelectField({
  label,
  required,
  errorMessage,
  value = [],
  onChange,
  options,
  formStyles = {},
  className,
  style,
  labelStyle,
  labelGap,
  disabled,
  searchable,
  maxSelection,
  placeholder,
  size,
}) {
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);

  // Show error when maxSelection is reached
  const atLimit = maxSelection != null && selectedValues.length >= maxSelection;
  const displayError = errorMessage || (atLimit ? `Maximum ${maxSelection} item${maxSelection === 1 ? '' : 's'} allowed` : null);

  const handleSelect = (selectedValue) => {
    if (disabled) return;
    if (maxSelection != null && selectedValues.length >= maxSelection) return;
    if (onChange) {
      onChange({ target: { value: [...selectedValues, selectedValue] } });
    }
  };

  const handleDeselect = (deselectedValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { value: selectedValues.filter(v => v !== deselectedValue) } });
    }
  };

  const handleRemoveTag = (e, valToRemove) => {
    e.stopPropagation();
    handleDeselect(valToRemove);
  };

  const renderCustomTrigger = () => (
    <div className="multi-select__trigger-content">
      {selectedValues.length === 0 ? (
        <span className="multi-select__placeholder">{placeholder || 'Select options...'}</span>
      ) : (
        <div className="multi-select__tags-container">
          {selectedValues.map((val, idx) => {
            const optionObj = options?.find(opt =>
              (typeof opt === 'object' ? opt.value : opt) === val
            );
            const displayLabel = optionObj
              ? (typeof optionObj === 'object' ? optionObj.label : optionObj)
              : val;

            return (
              <span key={idx} className="multi-select__tag" style={formStyles.tag || {}}>
                {displayLabel}
                <button
                  type="button"
                  className="multi-select__tag-remove"
                  onClick={(e) => handleRemoveTag(e, val)}
                  disabled={disabled}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <BaseField
      label={label}
      required={required}
      errorMessage={displayError}
      formStyles={formStyles}
      labelStyle={labelStyle}
      labelGap={labelGap}
      size={size}
    >
      <SelectBase
        options={options}
        isMulti={true}
        searchable={searchable}
        selectedValues={selectedValues}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        renderCustomTrigger={renderCustomTrigger}
        maxSelection={maxSelection}
        formStyles={formStyles}
        className={`multi-select-field ${className || ''}`}
        style={style}
        disabled={disabled}
      />
    </BaseField>
  );
}
