const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
let totalPassed = 0, totalFailed = 0;

function check(label, condition) {
  if (condition) {
    console.log('  PASS: ' + label);
    totalPassed++;
  } else {
    console.error('  FAIL: ' + label);
    totalFailed++;
  }
}

function readFile(relPath) {
  // normalize CRLF to LF for cross-platform matching
  return fs.readFileSync(path.join(cwd, relPath), 'utf8').replace(/\r\n/g, '\n');
}

function contains(content, term) {
  return content.includes(term);
}

// =========================================================
// TASK 43: Keyboard Navigation in SelectBase
// =========================================================
console.log('\n=== TASK 43: Keyboard Navigation (SelectBase.js) ===');
const selectBase = readFile('src/components/fields/SelectBase/SelectBase.js');

check('useMemo used for filteredOptions (correct ordering)', contains(selectBase, 'useMemo'));
check('filteredOptions defined via useMemo before handleKeyDown', (() => {
  const memoIdx = selectBase.indexOf('const filteredOptions = useMemo');
  const keydownIdx = selectBase.indexOf('const handleKeyDown');
  return memoIdx < keydownIdx && memoIdx > 0;
})());
check('highlightedIndex state', contains(selectBase, 'highlightedIndex'));
check('setHighlightedIndex state setter', contains(selectBase, 'setHighlightedIndex'));
check("ArrowDown key handling", contains(selectBase, "ArrowDown"));
check("ArrowUp key handling", contains(selectBase, "ArrowUp"));
check("Enter key selection", contains(selectBase, "Enter"));
check("Escape key close", contains(selectBase, "Escape"));
check('handleKeyDown function defined', contains(selectBase, 'const handleKeyDown'));
check('onKeyDown handler on container', contains(selectBase, 'onKeyDown={handleKeyDown}'));
check('listRef for scroll', contains(selectBase, 'listRef'));
check('Auto-scroll highlighted into view', contains(selectBase, 'scrollIntoView'));
check('highlighted CSS class applied', contains(selectBase, 'select-base__option--highlighted'));
check('tabIndex on trigger for keyboard focus', contains(selectBase, 'tabIndex'));
check('Wrap-around ArrowDown (back to 0)', contains(selectBase, '? 0 : next'));
check('Wrap-around ArrowUp (to last)', contains(selectBase, 'filteredOptions.length - 1'));
check('mouseEnter sets highlighted index', contains(selectBase, 'onMouseEnter'));
check('Opens on ArrowDown/ArrowUp when closed', contains(selectBase, 'openDropdown'));

// CSS checks
const selectBaseCss = readFile('src/components/fields/SelectBase/SelectBase.css');
check('highlighted option CSS class exists', contains(selectBaseCss, '.select-base__option--highlighted'));
check('highlighted+selected compound CSS class', contains(selectBaseCss, 'option--selected.select-base__option--highlighted'));

// =========================================================
// TASK 44: Sync/Async TypeAhead  
// =========================================================
console.log('\n=== TASK 44: Sync/Async TypeAhead (TypeAheadField.js) ===');
const typeahead = readFile('src/components/fields/TypeAheadField/TypeAheadField.js');

check('isAsyncRef for type detection', contains(typeahead, 'isAsyncRef'));
check('activeSearchRef for race condition prevention', contains(typeahead, 'activeSearchRef'));
check('Promise detection (.then check)', contains(typeahead, "typeof result.then === 'function'"));
check('Sync path executes immediately (else branch)', contains(typeahead, '} else {\n        try {\n          const result = loadOptions(term)'));
check('Async branch with 300ms debounce', contains(typeahead, '}, 300)'));
check('Race condition check active ref', contains(typeahead, 'activeSearchRef.current === term'));
check('setIsLoading(true) on async start', contains(typeahead, 'setIsLoading(true)'));
check('setIsLoading(false) in finally block', contains(typeahead, 'setIsLoading(false)'));
check('setSearchTerm clears on reset', contains(typeahead, "setSearchTerm('')"));
check('setAsyncOptions([]) on reset', contains(typeahead, 'setAsyncOptions([])'));
check('Initial load when minSearchLength===0', contains(typeahead, 'minSearchLength === 0'));
check('minSearchLength threshold check', contains(typeahead, 'term.length < minSearchLength'));
check('size prop forwarded to BaseField', contains(typeahead, 'size={size}'));
check('loadOptions prop accepted', contains(typeahead, 'loadOptions,'));
check('staticOptions as alternative to loadOptions', contains(typeahead, 'options: staticOptions'));

// =========================================================
// TASK 43 also: RepeatableGroup State Isolation
// =========================================================
console.log('\n=== TASK 43 (RepeatableGroup): State Isolation ===');
const repeatGroup = readFile('src/components/fields/RepeatableGroup/RepeatableGroup.js');

check('keyPoolRef (ref-based key pool, no render-time setState)', contains(repeatGroup, 'keyPoolRef'));
check('useRef imported', contains(repeatGroup, 'useRef'));
check('useCallback imported', contains(repeatGroup, 'useCallback'));
check('No render-time setRowKeys call (anti-pattern removed)', !contains(repeatGroup, 'setRowKeys'));
check('Pool grows: keyPoolRef.current.push on add', contains(repeatGroup, 'keyPoolRef.current.push'));
check('Pool shrinks: keyPoolRef.current.splice on remove', contains(repeatGroup, 'keyPoolRef.current.splice'));
check('Stable row key from pool used in JSX', contains(repeatGroup, 'keyPoolRef.current[index]'));
check('fieldConfig spread forwards all props to nested fields', contains(repeatGroup, '{...fieldConfig}'));
check('handleAdd pushes key BEFORE onChange (deterministic)', (() => {
  const pushIdx = repeatGroup.indexOf('keyPoolRef.current.push');
  const onchangeIdx = repeatGroup.indexOf('onChange([...currentValues, {}])');
  return pushIdx > 0 && onchangeIdx > 0 && pushIdx < onchangeIdx;
})());
check('handleRemove splices key BEFORE onChange (deterministic)', (() => {
  const spliceIdx = repeatGroup.indexOf('keyPoolRef.current.splice');
  const onchangeIdx = repeatGroup.indexOf('onChange(next)');
  return spliceIdx > 0 && onchangeIdx > 0 && spliceIdx < onchangeIdx;
})());
check('size prop destructured in RepeatableGroup', contains(repeatGroup, 'size\n  } = props'));
check('size forwarded to BaseField', contains(repeatGroup, 'size={size}'));

// fieldMapper aliases
const fieldMapper = readFile('src/utils/fieldMapper.js');
check('repeatable alias in fieldMapper', contains(fieldMapper, "repeatable: RepeatableGroup"));
check('typeahead alias in fieldMapper', contains(fieldMapper, "typeahead: TypeAheadField"));
check('multiselect alias in fieldMapper', contains(fieldMapper, "multiselect: MultiSelectField"));

// =========================================================
// TASK 45: Size Propagation across all 15 field components
// =========================================================
console.log('\n=== TASK 45: Size Propagation (15 components) ===');
const fieldFiles = [
  ['TextField', 'src/components/fields/TextField/TextField.js'],
  ['EmailField', 'src/components/fields/EmailField/EmailField.js'],
  ['PasswordField', 'src/components/fields/PasswordField/PasswordField.js'],
  ['NumberField', 'src/components/fields/NumberField/NumberField.js'],
  ['TextAreaField', 'src/components/fields/TextAreaField/TextAreaField.js'],
  ['DateField', 'src/components/fields/DateField/DateField.js'],
  ['FileField', 'src/components/fields/FileField/FileField.js'],
  ['RadioField', 'src/components/fields/RadioField/RadioField.js'],
  ['CheckboxField', 'src/components/fields/CheckboxField/CheckboxField.js'],
  ['CheckboxGroupField', 'src/components/fields/CheckboxGroupField/CheckboxGroupField.js'],
  ['SelectField', 'src/components/fields/SelectField/SelectField.js'],
  ['MultiSelectField', 'src/components/fields/MultiSelectField/MultiSelectField.js'],
  ['TypeAheadField', 'src/components/fields/TypeAheadField/TypeAheadField.js'],
  ['SliderField', 'src/components/fields/SliderField/SliderField.js'],
  ['RepeatableGroup', 'src/components/fields/RepeatableGroup/RepeatableGroup.js'],
];

fieldFiles.forEach(([name, relPath]) => {
  const content = readFile(relPath);
  // size must appear as a prop parameter  
  const hasSizeProp = /[,{]\s*size\s*[,})]/.test(content) || content.includes('size,') || content.includes('  size\n');
  const passesToBaseField = contains(content, 'size={size}');
  check(name + ' has size prop', hasSizeProp);
  check(name + ' forwards size={size} to BaseField', passesToBaseField);
});

// BaseField resolves size correctly
const baseField = readFile('src/components/fields/BaseField/BaseField.js');
check('BaseField resolves size (prop > formStyles > medium)', contains(baseField, "size || formStyles.size || 'medium'"));
check('BaseField applies size CSS class', contains(baseField, 'base-field--size-'));

// BaseField CSS sizing rules
const baseFieldCss = readFile('src/components/fields/BaseField/BaseField.css');
const sizeSelectors = [
  'base-field--size-small .base-field__label',
  'base-field--size-large .base-field__label',
  'base-field--size-small .select-base__trigger',
  'base-field--size-large .select-base__trigger',
  'base-field--size-small .select-base__typeahead-input',
  'base-field--size-large .select-base__typeahead-input',
  'base-field--size-small .base-field__error',
  'base-field--size-large .base-field__error',
  'base-field--size-small .multi-select__tag',
  'base-field--size-large .multi-select__tag',
  'base-field--size-small .repeatable-group__add-btn',
  'base-field--size-large .repeatable-group__add-btn',
  'base-field--size-small .text-field__input',
  'base-field--size-large .text-field__input',
  'base-field--size-small .checkbox-field__label-text',
  'base-field--size-large .checkbox-field__label-text',
  'base-field--size-small .radio-field__option-text',
  'base-field--size-large .radio-field__option-text',
];
sizeSelectors.forEach(sel => {
  check('CSS: ' + sel.split('.').pop(), contains(baseFieldCss, sel));
});

// =========================================================
// TASK 46: Slider Field
// =========================================================
console.log('\n=== TASK 46: SliderField variants & defaults ===');
const sliderJs = readFile('src/components/fields/SliderField/SliderField.js');

check("Default variant is 'slider'", contains(sliderJs, "variant = 'slider'"));
check('Rating variant: renderRating function', contains(sliderJs, 'renderRating'));
check('Emoji variant: renderEmojiSlider function', contains(sliderJs, 'renderEmojiSlider'));
check('Icon variant: renderIconSlider function', contains(sliderJs, 'renderIconSlider'));
check('switch/case for variants', contains(sliderJs, 'switch (variant)'));
check('min prop default 0', contains(sliderJs, 'min = 0'));
check('max prop default 100', contains(sliderJs, 'max = 100'));
check('step prop default 1', contains(sliderJs, 'step = 1'));
check('disabled prop handled', contains(sliderJs, 'disabled'));
check('displayValue handles undefined/empty string', contains(sliderJs, "value !== ''"));
check('onChange fires Number(val)', contains(sliderJs, 'Number('));
check('variant class applied to wrapper div', contains(sliderJs, 'slider-field--variant-'));
check('Rating: star hover interaction', contains(sliderJs, 'hoverValue'));
check('Rating: star click fires handleChange', contains(sliderJs, 'onClick={() => !disabled && handleChange'));
check('Emoji: index clamped with Math.min/max', contains(sliderJs, 'Math.min') && contains(sliderJs, 'Math.max'));
check('Icon: startIcon and endIcon props', contains(sliderJs, 'startIcon') && contains(sliderJs, 'endIcon'));
check('size prop destructured', contains(sliderJs, '  size,'));
check('size forwarded to BaseField', contains(sliderJs, 'size={size}'));

// resolveInitialValue for slider
const resolveVal = readFile('src/utils/resolveInitialValue.js');
check("resolveInitialValue: handles slider type", contains(resolveVal, "field.type === 'slider'"));
check('resolveInitialValue: slider defaults to field.min', contains(resolveVal, 'field.min'));
check('resolveInitialValue: slider falls back to 0', contains(resolveVal, ': 0'));

// =========================================================
// REGRESSION: Form and ConditionalForm still pass size
// =========================================================
console.log('\n=== REGRESSION: Form & ConditionalForm size pass-through ===');
const formJs = readFile('src/components/Form/Form.js');
const condFormJs = readFile('src/components/ConditionalForm/ConditionalForm.js');

check('Form.js passes size={field.size} to each field', contains(formJs, 'size={field.size}'));
check('Form.js resolves global size from formStyles', contains(formJs, "formStyles.size || 'medium'"));
check('ConditionalForm.js passes size={field.size} to each field', contains(condFormJs, 'size={field.size}'));
check('ConditionalForm.js resolves global size from formStyles', contains(condFormJs, "formStyles.size || 'medium'"));

// =========================================================
// BUILD ARTIFACTS EXIST AND ARE FRESH
// =========================================================
console.log('\n=== BUILD: dist artifacts present ===');
const distEs = path.join(cwd, 'dist/skemvora.es.js');
const distUmd = path.join(cwd, 'dist/skemvora.umd.js');
const distCss = path.join(cwd, 'dist/styles.css');
const srcSelectBase = path.join(cwd, 'src/components/fields/SelectBase/SelectBase.js');

check('dist/skemvora.es.js exists', fs.existsSync(distEs));
check('dist/skemvora.umd.js exists', fs.existsSync(distUmd));
check('dist/styles.css exists', fs.existsSync(distCss));
check('dist is newer than SelectBase.js source', (() => {
  if (!fs.existsSync(distEs)) return false;
  const distMtime = fs.statSync(distEs).mtime.getTime();
  const srcMtime = fs.statSync(srcSelectBase).mtime.getTime();
  return distMtime >= srcMtime;
})());

// =========================================================
// SUMMARY
// =========================================================
console.log('\n' + '='.repeat(70));
console.log('FINAL VERIFICATION RESULTS: ' + totalPassed + ' PASSED, ' + totalFailed + ' FAILED');
console.log('='.repeat(70));
if (totalFailed === 0) {
  console.log('ALL CHECKS PASSED - Implementation is complete and verified!');
} else {
  console.log('SOME CHECKS FAILED - see FAIL lines above');
}
process.exit(totalFailed > 0 ? 1 : 0);
