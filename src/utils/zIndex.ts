/**
 * Z-index utility for converting CSS z-index values to Tailwind classes
 */

export interface ZIndexMatcher {
  match: (property: string, value: string) => boolean;
}

// Z-index scale mapping (Tailwind's built-in z-index values)
const Z_INDEX_SCALE: Record<string, string> = {
  '0': '0',
  '10': '10',
  '20': '20',
  '30': '30',
  '40': '40',
  '50': '50',
  'auto': 'auto',
};

export const zIndexMatcher: ZIndexMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    return prop === 'z-index' && (
      Z_INDEX_SCALE[val] !== undefined ||
      val === 'auto' ||
      /^-?\d+$/.test(val)  // any integer
    );
  }
};

export function convertZIndex(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const val = value.toLowerCase().trim();
  
  if (prop !== 'z-index') {
    return null;
  }
  
  // Check exact matches first
  if (Z_INDEX_SCALE[val]) {
    return `z-${Z_INDEX_SCALE[val]}`;
  }
  
  // Handle auto
  if (val === 'auto') {
    return 'z-auto';
  }
  
  // Handle integer values
  if (/^-?\d+$/.test(val)) {
    const num = parseInt(val);
    
    // For common Tailwind values, use standard classes
    if (Z_INDEX_SCALE[val]) {
      return `z-${Z_INDEX_SCALE[val]}`;
    }
    
    // For negative values
    if (num < 0) {
      return `z-[-${Math.abs(num)}]`;
    }
    
    // For positive values not in scale, use arbitrary value
    return `z-[${val}]`;
  }
  
  // Fallback to arbitrary value
  return `z-[${value}]`;
}

export const zIndexPatternMatcher = {
  test: zIndexMatcher.match,
  convert: convertZIndex
};
