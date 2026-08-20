import { useState, useRef, useEffect } from 'react';
import './SelectBase.css';

/**
 * SelectBase - Shared dropdown mechanism (no BaseField wrapper).
 * Consumed by SelectField, MultiSelectField, TypeAheadField.
 *
 * For TypeAhead: pass isTypeAhead=true. The trigger becomes a plain
 * text input; the dropdown opens only when the user types.
 */
export function SelectBase({ labelPosition, labelWidth, labelAlign, labelVariant, fieldVariant, width, minWidth, maxWidth, 
  options = [],
  isMulti = false,
  searchable = false,
  isTypeAhead = false,
  selectedValues = [],
  onSelect,
  onDeselect,
  maxSelection,
  className,
  style,
  formStyles = {},
  renderCustomTrigger,
  isLoading = false,
  isClearable = false,
  onClear,
  onSearchChange,          // provided by TypeAhead; signals async parent
  noResultsMessage = 'No options found',
  searchPlaceholder = 'Search...',
  typeAheadDisplayValue = '', // label to show when a value is selected in typeahead
  disabled,
  placeholder,
}) {
  const [isOpen, setIsOpen]       = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef  = useRef(null);
  const searchInputRef = useRef(null);

  /* ── Close on outside click ── */
  useEffect(() => {
    function onOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        if (isTypeAhead && !selectedValues.length) setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isTypeAhead, selectedValues.length]);

  /* ── Auto-focus search input inside dropdown ── */
  useEffect(() => {
    if (isOpen && searchable && !isTypeAhead && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, searchable, isTypeAhead]);

  /* ── Helpers ── */
  const openDropdown  = () => { if (!disabled) setIsOpen(true);  };
  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) closeDropdown();
    else { setIsOpen(true); if (!onSearchChange && !isTypeAhead) setSearchTerm(''); }
  };

  const handleDropdownSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchChange) onSearchChange(val);
  };

  /* TypeAhead: the main input IS the search box */
  const handleTypeAheadInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.length > 0) openDropdown();
    else closeDropdown();
    if (onSearchChange) onSearchChange(val);
  };

  const handleClearClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setSearchTerm('');
    if (onSearchChange) onSearchChange('');
    if (onClear) onClear();
    closeDropdown();
  };

  const handleOptionClick = (option) => {
    const value    = typeof option === 'object' ? option.value : option;
    if (isMulti) {
      if (selectedValues.includes(value)) {
        if (onDeselect) onDeselect(value);
      } else {
        if (!maxSelection || selectedValues.length < maxSelection) {
          if (onSelect) onSelect(value);
        }
      }
      // keep dropdown open for multi
    } else {
      if (onSelect) onSelect(value);
      closeDropdown();
      setSearchTerm('');
      if (onSearchChange) onSearchChange('');
    }
  };

  /* ── Filter options locally unless parent handles it (async) ── */
  const filteredOptions = onSearchChange
    ? options
    : options.filter(opt => {
        if (!searchable || !searchTerm) return true;
        const lbl = typeof opt === 'object' ? opt.label : opt;
        return String(lbl).toLowerCase().includes(searchTerm.toLowerCase());
      });

  const showClearBtn = isClearable && selectedValues.length > 0 && !disabled;

  /* ── Derived styles: merge formStyles.input + field-level style ── */
  const inputStyle = { ...(formStyles.input || {}), ...(style || {}) };

  /* ── For TypeAhead: what to show in the native input ── */
  const typeAheadInputValue = selectedValues.length > 0 ? typeAheadDisplayValue : searchTerm;

  /* ── Whether to render dropdown ── */
  const shouldShowDropdown = isOpen && (
    isTypeAhead
      ? (isLoading || filteredOptions.length > 0 || searchTerm.length >= 1)
      : true
  );

  return (
    <div
      className={`select-base__container${disabled ? ' select-base--disabled' : ''}${className ? ' ' + className : ''}`}
      ref={containerRef}
    >
      {/* ── TRIGGER ── */}
      {isTypeAhead ? (
        /* TypeAhead: native input IS the trigger */
        <div className="select-base__trigger" style={inputStyle}>
          <input
            className="select-base__typeahead-input"
            type="text"
            placeholder={placeholder || searchPlaceholder}
            value={typeAheadInputValue}
            onChange={handleTypeAheadInputChange}
            disabled={disabled}
            autoComplete="off"
          />
          <div className="select-base__trigger-actions">
            {showClearBtn && (
              <button type="button" className="select-base__clear-btn" onClick={handleClearClick}>
                &times;
              </button>
            )}
            <span className="select-base__arrow" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
              {isOpen ? '▲' : '▼'}
            </span>
          </div>
        </div>
      ) : (
        /* Select / MultiSelect: click-to-open trigger */
        <div className="select-base__trigger" style={inputStyle} onClick={toggleDropdown}>
          <div className="select-base__trigger-content-wrapper">
            {renderCustomTrigger ? renderCustomTrigger() : (
              <div className={`select-base__trigger-text${!selectedValues.length ? ' select-base__placeholder' : ''}`}>
                {isMulti
                  ? (selectedValues.length ? null : (placeholder || 'Select options...'))
                  : (selectedValues.length ? selectedValues[0] : (placeholder || 'Select an option...'))}
              </div>
            )}
          </div>
          <div className="select-base__trigger-actions">
            {showClearBtn && (
              <button type="button" className="select-base__clear-btn" onClick={handleClearClick}>
                &times;
              </button>
            )}
            <span className="select-base__arrow">{isOpen ? '▲' : '▼'}</span>
          </div>
        </div>
      )}

      {/* ── DROPDOWN ── */}
      {shouldShowDropdown && (
        <div className="select-base__dropdown" style={formStyles.dropdown || {}}>
          {/* Search box inside dropdown (only for non-TypeAhead searchable) */}
          {searchable && !isTypeAhead && (
            <div className="select-base__search-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                className="select-base__search-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleDropdownSearchChange}
              />
            </div>
          )}
          <ul className="select-base__options-list">
            {isLoading ? (
              <li className="select-base__loading">Loading...</li>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const optValue   = typeof option === 'object' ? option.value : option;
                const optLabel   = typeof option === 'object' ? option.label : option;
                const isSelected = selectedValues.includes(optValue);
                return (
                  <li
                    key={index}
                    className={`select-base__option${isSelected ? ' select-base__option--selected' : ''}`}
                    onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                    onClick={() => handleOptionClick(option)}
                    style={{ ...(formStyles.option || {}), ...(isSelected ? (formStyles.selectedOption || {}) : {}) }}
                  >
                    {isMulti && (
                      <input type="checkbox" checked={isSelected} readOnly className="select-base__option-checkbox" />
                    )}
                    <span>{optLabel}</span>
                  </li>
                );
              })
            ) : (
              <li className="select-base__no-results">{noResultsMessage}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
