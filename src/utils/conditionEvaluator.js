export function evaluateCondition(condition, values) {
  if (!condition) return true;
  if (!condition.rules || condition.rules.length === 0) return true;

  const logic = condition.logic || 'AND';

  const evaluateRule = (rule) => {
    const { field, operator, value } = rule;
    const fieldValue = values[field];

    switch (operator) {
      case 'equals': 
        return fieldValue === value;
      case 'notEquals': 
        return fieldValue !== value;
      case 'greaterThan': 
        return Number(fieldValue) > Number(value);
      case 'greaterThanOrEqual': 
        return Number(fieldValue) >= Number(value);
      case 'lessThan': 
        return Number(fieldValue) < Number(value);
      case 'lessThanOrEqual': 
        return Number(fieldValue) <= Number(value);
      case 'contains': 
      case 'includes':
        return (typeof fieldValue === 'string' || Array.isArray(fieldValue)) && fieldValue.includes(value);
      case 'startsWith': 
        return typeof fieldValue === 'string' && fieldValue.startsWith(value);
      case 'endsWith': 
        return typeof fieldValue === 'string' && fieldValue.endsWith(value);
      default: 
        return false;
    }
  };

  if (logic === 'OR') {
    return condition.rules.some(evaluateRule);
  } else {
    // Default to AND
    return condition.rules.every(evaluateRule);
  }
}
