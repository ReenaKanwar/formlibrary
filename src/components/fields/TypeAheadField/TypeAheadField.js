import { useState, useEffect, useRef } from 'react';
import { BaseField } from '../BaseField';
import { SelectBase } from '../SelectBase';

export function TypeAheadField({
  label,
  required,
  errorMessage,
  value,
  onChange,
  formStyles = {},
  className,
  style,
  labelStyle,
  labelGap,
  disabled,
  loadOptions,
  options: staticOptions,      // allow static options as alternative to loadOptions
  minSearchLength = 1,
  isClearable = true,
  placeholder,
}) {
  const [asyncOptions, setAsyncOptions]   = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedOption, setSelectedOption] = useState(null);   // { label, value }

  const timerRef       = useRef(null);
  const isFirstRender  = useRef(true);

  /* Set selectedOption from initial value or external value change */
  useEffect(() => {
    if (value && (!selectedOption || selectedOption.value !== value)) {
      setSelectedOption({ label: String(value), value });
    } else if (!value && selectedOption) {
      setSelectedOption(null);
    }
  }, [value, selectedOption]);

  /* Fetch all options upfront if minSearchLength === 0 (static-style usage) */
  useEffect(() => {
    if (minSearchLength === 0 && isFirstRender.current && loadOptions) {
      isFirstRender.current = false;
      let active = true;
      setIsLoading(true);
      
      try {
        const result = loadOptions('');
        if (result && typeof result.then === 'function') {
          result.then(res => {
            if (active) { setAsyncOptions(res || []); setIsLoading(false); }
          }).catch(() => {
            if (active) { setAsyncOptions([]); setIsLoading(false); }
          });
        } else {
          setAsyncOptions(result || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('TypeAhead initial load error:', err);
        setAsyncOptions([]);
        setIsLoading(false);
      }
      return () => { active = false; };
    }
  }, [minSearchLength, loadOptions]);

  /* ── Handle search input change ── */
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (term.length < minSearchLength) {
      setAsyncOptions([]);
      setIsLoading(false);
      return;
    }

    if (loadOptions) {
      setIsLoading(true);
      timerRef.current = setTimeout(async () => {
        try {
          const result = loadOptions(term);
          if (result && typeof result.then === 'function') {
            const results = await result;
            setAsyncOptions(results || []);
          } else {
            setAsyncOptions(result || []);
          }
        } catch (err) {
          console.error('TypeAhead loadOptions error:', err);
          setAsyncOptions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    }
  };

  const handleSelect = (selectedValue) => {
    const allOpts = loadOptions ? asyncOptions : (staticOptions || []);
    const found = allOpts.find(opt =>
      (typeof opt === 'object' ? opt.value : opt) === selectedValue
    );
    const label = found
      ? (typeof found === 'object' ? found.label : found)
      : String(selectedValue);

    setSelectedOption({ label, value: selectedValue });
    setSearchTerm('');
    setAsyncOptions([]);
    if (onChange) onChange({ target: { value: selectedValue } });
  };

  const handleClear = () => {
    setSelectedOption(null);
    setSearchTerm('');
    setAsyncOptions([]);
    if (onChange) onChange({ target: { value: '' } });
  };

  /* Options shown: async results or static options (filtered by SelectBase) */
  const displayOptions = loadOptions ? asyncOptions : (staticOptions || []);

  const noResultsMessage = searchTerm.length < minSearchLength
    ? `Type at least ${minSearchLength} character${minSearchLength > 1 ? 's' : ''} to search`
    : 'No options found';

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
        isTypeAhead={true}
        options={displayOptions}
        isMulti={false}
        selectedValues={value ? [value] : []}
        onSelect={handleSelect}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
        isClearable={isClearable}
        onClear={handleClear}
        typeAheadDisplayValue={selectedOption ? selectedOption.label : (value || '')}
        noResultsMessage={noResultsMessage}
        formStyles={formStyles}
        className={`typeahead-field ${className || ''}`}
        style={style}
        disabled={disabled}
        placeholder={placeholder || 'Search...'}
      />
    </BaseField>
  );
}
