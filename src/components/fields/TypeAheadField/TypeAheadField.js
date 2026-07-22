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
  size,
}) {
  const [asyncOptions, setAsyncOptions]   = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedOption, setSelectedOption] = useState(null);   // { label, value }

  const timerRef        = useRef(null);
  const activeSearchRef = useRef('');

  // Helper to find label from options array
  const findOptionLabel = (val, opts) => {
    if (!opts || !Array.isArray(opts)) return null;
    const found = opts.find(opt => {
      const optVal = typeof opt === 'object' ? opt.value : opt;
      return optVal === val || String(optVal) === String(val);
    });
    if (found !== undefined) {
      return typeof found === 'object' ? found.label : String(found);
    }
    return null;
  };

  /* Sync selectedOption with incoming value prop */
  useEffect(() => {
    if (value !== undefined && value !== null && value !== '') {
      // If we already have a selectedOption matching this value, preserve the human-readable label!
      if (selectedOption && (selectedOption.value === value || String(selectedOption.value) === String(value))) {
        return;
      }
      // Otherwise attempt to resolve label from static or async options
      const allOpts = staticOptions || asyncOptions || [];
      const label = findOptionLabel(value, allOpts) || String(value);
      setSelectedOption({ label, value });
    } else {
      setSelectedOption(null);
      setSearchTerm('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, staticOptions]);

  /* Fetch all options upfront if minSearchLength === 0 and loadOptions is present */
  useEffect(() => {
    if (minSearchLength === 0 && loadOptions) {
      let active = true;
      setIsLoading(true);
      try {
        const result = loadOptions('');
        if (result && typeof result.then === 'function') {
          result.then(res => {
            if (active) {
              setAsyncOptions(res || []);
              setIsLoading(false);
            }
          }).catch(() => {
            if (active) {
              setAsyncOptions([]);
              setIsLoading(false);
            }
          });
        } else {
          setAsyncOptions(result || []);
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          setAsyncOptions([]);
          setIsLoading(false);
        }
      }
      return () => { active = false; };
    }
  }, [minSearchLength, loadOptions]);

  /* Handle search input change */
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    activeSearchRef.current = term;
    if (timerRef.current) clearTimeout(timerRef.current);

    // If an option was selected and user starts typing a new search, clear selection
    if (selectedOption) {
      setSelectedOption(null);
      if (onChange) onChange({ target: { value: '' } });
    }

    if (term.length < minSearchLength) {
      setAsyncOptions([]);
      setIsLoading(false);
      return;
    }

    if (loadOptions) {
      try {
        const result = loadOptions(term);
        if (result && typeof result.then === 'function') {
          setIsLoading(true);
          result.then(res => {
            if (activeSearchRef.current === term) {
              setAsyncOptions(res || []);
              setIsLoading(false);
            }
          }).catch(() => {
            if (activeSearchRef.current === term) {
              setAsyncOptions([]);
              setIsLoading(false);
            }
          });
        } else {
          // Synchronous loadOptions
          setAsyncOptions(result || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('TypeAhead loadOptions error:', err);
        setAsyncOptions([]);
        setIsLoading(false);
      }
    }
  };

  /* Handle option selection */
  const handleSelect = (selectedValue, selectedOpt) => {
    let label = selectedOpt
      ? (typeof selectedOpt === 'object' ? selectedOpt.label : selectedOpt)
      : null;

    if (!label) {
      const allOpts = loadOptions ? asyncOptions : (staticOptions || []);
      label = findOptionLabel(selectedValue, allOpts) || String(selectedValue);
    }

    const newOption = { label: String(label), value: selectedValue };
    setSelectedOption(newOption);
    setSearchTerm('');
    setAsyncOptions([]);
    if (onChange) onChange({ target: { value: selectedValue } });
  };

  /* Handle clear */
  const handleClear = () => {
    setSelectedOption(null);
    setSearchTerm('');
    setAsyncOptions([]);
    if (onChange) onChange({ target: { value: '' } });
  };

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
      size={size}
    >
      <SelectBase
        isTypeAhead={true}
        options={displayOptions}
        isMulti={false}
        selectedValues={selectedOption ? [selectedOption.value] : []}
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
