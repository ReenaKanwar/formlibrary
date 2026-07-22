const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

// Verify SliderField has all required variants
const sliderContent = fs.readFileSync(path.join(cwd, 'src/components/fields/SliderField/SliderField.js'), 'utf8');

const variantChecks = [
  ['variant prop with default', "variant = 'slider'"],
  ['rating case', "case 'rating'"],
  ['emoji case', "case 'emoji'"],
  ['icon case', "case 'icon'"],
  ['default slider case', "case 'slider'"],
  ['renderRating function', 'renderRating'],
  ['renderEmojiSlider function', 'renderEmojiSlider'],
  ['renderIconSlider function', 'renderIconSlider'],
  ['disabled prop', 'disabled'],
  ['min prop default', 'min = 0'],
  ['max prop default', 'max = 100'],
  ['step prop default', 'step = 1'],
  ['hover state for rating', 'hoverValue'],
  ['emoji display class', 'slider-emoji-display'],
  ['icon class', 'slider-icon'],
  ['size prop destructured', 'size,'],
  ['size forwarded to BaseField', 'size={size}'],
];

let passed = 0, failed = 0;
variantChecks.forEach(([label, term]) => {
  if (sliderContent.includes(term)) {
    console.log('PASS [SliderField.js]: ' + label);
    passed++;
  } else {
    console.error('FAIL [SliderField.js]: missing "' + label + '" (term: ' + term + ')');
    failed++;
  }
});

// Check CSS file
const sliderCss = fs.readFileSync(path.join(cwd, 'src/components/fields/SliderField/SliderField.css'), 'utf8');
const cssChecks = [
  ['rating container', 'slider-rating-container'],
  ['rating star', 'slider-rating-star'],
  ['active star state', 'slider-rating-star--active'],
  ['emoji wrapper', 'slider-emoji-wrapper'],
  ['emoji display', 'slider-emoji-display'],
  ['icon wrapper', 'slider-icon-wrapper'],
  ['icon element', 'slider-icon'],
  ['small size override', 'base-field--size-small'],
  ['large size override', 'base-field--size-large'],
];

cssChecks.forEach(([label, term]) => {
  if (sliderCss.includes(term)) {
    console.log('PASS [SliderField.css]: ' + label);
    passed++;
  } else {
    console.error('FAIL [SliderField.css]: missing "' + label + '"');
    failed++;
  }
});

// Check BaseField CSS for correct sizing selectors
const baseFieldCss = fs.readFileSync(path.join(cwd, 'src/components/fields/BaseField/BaseField.css'), 'utf8');
const baseChecks = [
  ['small label', 'base-field--size-small .base-field__label'],
  ['large label', 'base-field--size-large .base-field__label'],
  ['small trigger', 'base-field--size-small .select-base__trigger'],
  ['large trigger', 'base-field--size-large .select-base__trigger'],
  ['small typeahead input', 'base-field--size-small .select-base__typeahead-input'],
  ['large typeahead input', 'base-field--size-large .select-base__typeahead-input'],
  ['small error text', 'base-field--size-small .base-field__error'],
  ['large error text', 'base-field--size-large .base-field__error'],
  ['small multi-select tag', 'base-field--size-small .multi-select__tag'],
  ['large multi-select tag', 'base-field--size-large .multi-select__tag'],
  ['small repeatable btn', 'base-field--size-small .repeatable-group__add-btn'],
  ['large repeatable btn', 'base-field--size-large .repeatable-group__add-btn'],
];

baseChecks.forEach(([label, term]) => {
  if (baseFieldCss.includes(term)) {
    console.log('PASS [BaseField.css]: ' + label);
    passed++;
  } else {
    console.error('FAIL [BaseField.css]: missing "' + label + '"');
    failed++;
  }
});

console.log('\n=== TOTAL: ' + passed + ' passed, ' + failed + ' failed ===');
process.exit(failed > 0 ? 1 : 0);
