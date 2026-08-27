import './ContentField.css';

export function ContentField({ 
  variant = 'text', 
  content, 
  textAlign = 'left', 
  formStyles = {}, 
  className = '', 
  style = {},
  heading,
  description,
  divider,
  spacing,
  sectionSpacing
}) {
  let variantStyle = {};
  let variantClass = '';

  switch (variant) {
    case 'heading':
      variantStyle = formStyles.contentHeading || {};
      variantClass = 'content-heading';
      break;
    case 'subHeading':
      variantStyle = formStyles.contentSubHeading || {};
      variantClass = 'content-sub-heading';
      break;
    case 'text':
    default:
      variantStyle = formStyles.contentText || {};
      variantClass = 'content-text';
      break;
  }

  const baseStyle = formStyles.content || {};
  const gapStyle = formStyles.contentGap ? { marginBottom: formStyles.contentGap } : {};

  // Task 49: Handle section spacing
  const marginSpacing = spacing || sectionSpacing || '';
  const sectionStyle = {};
  if (marginSpacing) {
    if (typeof marginSpacing === 'object') {
      if (marginSpacing.top) sectionStyle.marginTop = marginSpacing.top;
      if (marginSpacing.bottom) sectionStyle.marginBottom = marginSpacing.bottom;
    } else {
      sectionStyle.marginTop = marginSpacing;
      sectionStyle.marginBottom = marginSpacing;
    }
  }

  const mergedStyle = {
    ...gapStyle,
    ...baseStyle,
    ...variantStyle,
    textAlign: textAlign,
    ...style,
    ...sectionStyle
  };

  // If heading or description is present, we render a section block
  if (heading || description) {
    return (
      <div className={`content-field-section ${className || ''}`.trim()} style={mergedStyle}>
        {heading && <div className="content-field-section__heading">{heading}</div>}
        {description && <div className="content-field-section__description">{description}</div>}
        {divider && <hr className="content-field-section__divider" />}
        {content && <div className={`content-field ${variantClass}`.trim()}>{content}</div>}
      </div>
    );
  }

  return (
    <div className={`content-field ${variantClass} ${className || ''}`.trim()} style={mergedStyle}>
      {content}
    </div>
  );
}
