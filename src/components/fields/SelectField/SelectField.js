import { BaseField } from '../BaseField';
import { SelectBase } from '../SelectBase';

export function SelectField({
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
    >
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
