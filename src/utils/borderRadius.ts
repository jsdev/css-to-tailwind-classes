// borderRadius.ts
// Utility matchers for border-radius CSS to Tailwind conversion

// Border radius properties
export const BORDER_RADIUS_PROPERTIES = [
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius'
];

// Common border radius values to Tailwind classes
export const BORDER_RADIUS_SCALE: Record<string, string> = {
  '0': '0',
  '0px': '0',
  '2px': 'sm',
  '4px': '',  // default rounded
  '6px': 'md',
  '8px': 'lg',
  '12px': 'xl',
  '16px': '2xl',
  '24px': '3xl',
  '9999px': 'full',
  '50%': 'full'
};

// Matcher for border radius pixel values
export const borderRadiusMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    return BORDER_RADIUS_PROPERTIES.includes(prop) && 
           (/^\d+(px|%)?$/.test(val) || val === '50%' || val === 'full');
  }
};

// Matcher for border radius shorthand (e.g., "4px 8px")
export const borderRadiusShorthandMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.trim();
    return prop === 'border-radius' && val.split(/\s+/).length > 1;
  }
};

/**
 * Convert border radius to Tailwind class
 * @param property - CSS property name
 * @param value - Border radius value
 * @returns Tailwind border radius class or null
 */
export function convertBorderRadius(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const val = value.toLowerCase().trim();
  
  // Property to class prefix mapping
  const propertyMap: Record<string, string> = {
    'border-radius': 'rounded',
    'border-top-left-radius': 'rounded-tl',
    'border-top-right-radius': 'rounded-tr',
    'border-bottom-left-radius': 'rounded-bl',
    'border-bottom-right-radius': 'rounded-br'
  };
  
  const prefix = propertyMap[prop];
  if (!prefix) return null;
  
  // Handle shorthand values for border-radius
  if (prop === 'border-radius' && val.split(/\s+/).length > 1) {
    // For complex shorthand, use arbitrary value
    const cleanVal = val.replace(/\s+/g, '_');
    return `${prefix}-[${cleanVal}]`;
  }
  
  // Check for known scale values
  if (BORDER_RADIUS_SCALE[val]) {
    const scaleValue = BORDER_RADIUS_SCALE[val];
    return scaleValue === '' ? prefix : `${prefix}-${scaleValue}`;
  }
  
  // Handle percentage values
  if (val.endsWith('%')) {
    const percent = parseFloat(val.replace('%', ''));
    if (percent >= 50) {
      return `${prefix}-full`;
    }
    return `${prefix}-[${val}]`;
  }
  
  // Handle pixel values not in scale
  if (val.endsWith('px')) {
    return `${prefix}-[${val}]`;
  }
  
  // Handle unitless values
  if (/^\d+$/.test(val)) {
    const num = parseInt(val);
    if (num === 0) return `${prefix}-0`;
    return `${prefix}-[${val}px]`;
  }
  
  return `${prefix}-[${val}]`;
}
