import { BaseField } from '../BaseField';
import { SelectBase } from '../SelectBase';

export function SelectField({ labelPosition, labelWidth, labelAlign, labelVariant, fieldVariant, width, minWidth, maxWidth, 
  label,
  required,
  errorMessage,
  value,
  onChange,
  options,
  searchable = false,
  placeholder,
  formStyles = {},
  className,
  style,
  labelStyle,
  labelGap,
  disabled,
  size,
}) {
  const handleSelect = (selectedValue) => {
    if (onChange) onChange({ target: { value: selectedValue } });
  };

  return (
    <BaseField
      label={label}
      required={required}
      errorMessage={errorMessage}
      formStyles={formStyles}
      labelStyle={labelStyle}
      labelGap={labelGap}
      size={size}
     labelPosition={labelPosition} labelWidth={labelWidth} labelAlign={labelAlign} labelVariant={labelVariant} fieldVariant={fieldVariant} width={width} minWidth={minWidth} maxWidth={maxWidth} hasValue={!!value || (Array.isArray(value) && value.length > 0)}>
      <SelectBase
        options={options}
        isMulti={false}
        searchable={searchable}
        selectedValues={value ? [value] : []}
        onSelect={handleSelect}
        formStyles={formStyles}
        className={className}
        style={style}
        disabled={disabled}
        placeholder={placeholder}
      />
    </BaseField>
  );
}
