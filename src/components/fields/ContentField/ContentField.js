import './ContentField.css';

export function ContentField({ variant = 'text', content, textAlign = 'left', formStyles = {}, className = '', style = {} }) {
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

  const mergedStyle = {
    ...gapStyle,
    ...baseStyle,
    ...variantStyle,
    textAlign: textAlign,
    ...style
  };

  return (
    <div className={`content-field ${variantClass} ${className || ''}`.trim()} style={mergedStyle}>
      {content}
    </div>
  );
}
