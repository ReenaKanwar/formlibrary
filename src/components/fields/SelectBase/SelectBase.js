import { useState, useRef, useEffect, useMemo } from 'react';
import './SelectBase.css';

/**
 * SelectBase - Shared dropdown mechanism (no BaseField wrapper).
 * Consumed by SelectField, MultiSelectField, TypeAheadField.
 *
 * For TypeAhead: pass isTypeAhead=true. The trigger becomes a plain
 * text input; the dropdown opens only when the user types.
 *
 * Task 43: Full keyboard navigation (ArrowUp/Down, Enter, Escape).
 */
export function SelectBase({
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
  const [isOpen, setIsOpen]             = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef   = useRef(null);
  const searchInputRef = useRef(null);
  const listRef        = useRef(null);

  /* ── Filter options locally unless parent handles it (async) ── */
  const filteredOptions = useMemo(() => {
    if (onSearchChange) return options;            // parent filters async results
    return options.filter(opt => {
      if (!searchable || !searchTerm) return true;
      const lbl = typeof opt === 'object' ? opt.label : opt;
      return String(lbl).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [options, onSearchChange, searchable, searchTerm]);

  /* ── Reset/set highlighted index when dropdown opens/closes or options change ── */
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    } else {
      setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filteredOptions.length]);

  /* ── Auto-scroll highlighted option into view ── */
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

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
  const openDropdown   = () => { if (!disabled) setIsOpen(true); };
  const closeDropdown  = () => setIsOpen(false);
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
    const value = typeof option === 'object' ? option.value : option;
    if (isMulti) {
      if (selectedValues.includes(value)) {
        if (onDeselect) onDeselect(value);
      } else {
        if (!maxSelection || selectedValues.length < maxSelection) {
          if (onSelect) onSelect(value, option);
        }
      }
      // keep dropdown open for multi
    } else {
      if (onSelect) onSelect(value, option);
      closeDropdown();
      setSearchTerm('');
    }
  };

  /* ── Task 43: Keyboard navigation handler ── */
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      // Open dropdown on ArrowDown / ArrowUp when closed
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openDropdown();
        if (isTypeAhead && onSearchChange) {
          onSearchChange(searchTerm);
        }
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        if (filteredOptions.length === 0) return -1;
        const next = prev + 1;
        return next >= filteredOptions.length ? 0 : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        if (filteredOptions.length === 0) return -1;
        const next = prev - 1;
        return next < 0 ? filteredOptions.length - 1 : next;
      });
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        e.preventDefault();
        handleOptionClick(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  };

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
      onKeyDown={handleKeyDown}
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
            onFocus={() => {
              if (isTypeAhead) {
                openDropdown();
                if (onSearchChange && !selectedValues.length) {
                  onSearchChange(searchTerm);
                }
              }
            }}
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
        <div
          className="select-base__trigger"
          style={inputStyle}
          onClick={toggleDropdown}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            // Enter/Space open the dropdown when the trigger div is focused
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDropdown();
            }
          }}
        >
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
          <ul className="select-base__options-list" ref={listRef}>
            {isLoading ? (
              <li className="select-base__loading">Loading...</li>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const optValue     = typeof option === 'object' ? option.value : option;
                const optLabel     = typeof option === 'object' ? option.label : option;
                const isSelected   = selectedValues.includes(optValue);
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={optValue !== undefined ? optValue : index}
                    className={[
                      'select-base__option',
                      isSelected   ? 'select-base__option--selected'    : '',
                      isHighlighted ? 'select-base__option--highlighted' : '',
                    ].filter(Boolean).join(' ')}
                    onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                    onMouseEnter={() => setHighlightedIndex(index)}
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
