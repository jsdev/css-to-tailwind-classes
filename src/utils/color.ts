// color.ts
// Utility matchers for color-related CSS to Tailwind conversion

// Common color properties that can have color values
export const COLOR_PROPERTIES = [
  'color', 'background-color', 'border-color', 'border-top-color', 
  'border-right-color', 'border-bottom-color', 'border-left-color',
  'text-decoration-color', 'outline-color', 'fill', 'stroke', 'caret-color',
  'accent-color', 'scrollbar-color'
];

// Property to Tailwind prefix mapping
export const COLOR_PROPERTY_MAP: Record<string, string> = {
  'color': 'text',
  'background-color': 'bg',
  'border-color': 'border',
  'border-top-color': 'border-t',
  'border-right-color': 'border-r',
  'border-bottom-color': 'border-b',
  'border-left-color': 'border-l',
  'text-decoration-color': 'decoration',
  'outline-color': 'outline',
  'fill': 'fill',
  'stroke': 'stroke',
  'caret-color': 'caret',
  'accent-color': 'accent'
};

// Matcher for hex colors (e.g., "#ff0000", "#f00")
export const hexColorMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    return COLOR_PROPERTIES.includes(prop) && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(val);
  }
};

// Matcher for RGB/RGBA colors (e.g., "rgb(255, 0, 0)", "rgba(255, 0, 0, 0.5)")
export const rgbColorMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    return COLOR_PROPERTIES.includes(prop) && 
           /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)$/i.test(val);
  }
};

// Matcher for HSL/HSLA colors (e.g., "hsl(0, 100%, 50%)", "hsla(0, 100%, 50%, 0.5)")
export const hslColorMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    return COLOR_PROPERTIES.includes(prop) && 
           /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)$/i.test(val);
  }
};

// Matcher for named colors (e.g., "red", "blue", "transparent")
export const namedColorMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    const namedColors = [
      'transparent', 'currentcolor', 'inherit', 'initial', 'unset',
      'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
      'pink', 'gray', 'grey', 'brown', 'cyan', 'magenta', 'lime', 'indigo',
      'violet', 'navy', 'teal', 'olive', 'maroon', 'silver', 'gold',
      // Extended named colors from form-color.ts
      'crimson', 'darkred', 'darkgreen', 'darkblue', 'darkgray', 'darkgrey',
      'lightgray', 'lightgrey', 'coral', 'salmon', 'khaki', 'plum', 'orchid',
      'tan', 'beige', 'lavender', 'azure', 'ivory', 'aqua', 'auto'
    ];
    return COLOR_PROPERTIES.includes(prop) && namedColors.includes(val);
  }
};

// Matcher for CSS custom properties/variables (e.g., "var(--primary-color)")
export const cssVariableColorMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.trim();
    return COLOR_PROPERTIES.includes(prop) && /^var\(--[\w-]+\)$/i.test(val);
  }
};

/**
 * Convert color values to Tailwind classes
 * @param property - CSS property name
 * @param value - CSS color value
 * @returns Tailwind color class or null
 */
export function convertColor(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const val = value.trim();
  
  const prefix = COLOR_PROPERTY_MAP[prop];
  if (!prefix) return null;
  
  // Handle named colors with Tailwind equivalents (enhanced with form-color mappings)
  const namedColorMap: Record<string, string> = {
    'transparent': 'transparent',
    'currentcolor': 'current',
    'black': 'black',
    'white': 'white',
    'red': 'red-500',
    'green': 'green-500',
    'blue': 'blue-500',
    'yellow': 'yellow-500',
    'orange': 'orange-500',
    'purple': 'purple-500',
    'pink': 'pink-500',
    'gray': 'gray-500',
    'grey': 'gray-500',
    'indigo': 'indigo-500',
    'cyan': 'cyan-500',
    'teal': 'teal-500',
    'lime': 'lime-500',
    'emerald': 'emerald-500',
    'sky': 'sky-500',
    'rose': 'rose-500',
    'fuchsia': 'fuchsia-500',
    'amber': 'amber-500',
    'violet': 'violet-500',
    // Extended mappings from form-color.ts
    'crimson': 'red-600',
    'darkred': 'red-800',
    'darkgreen': 'green-800',
    'darkblue': 'blue-800',
    'navy': 'blue-900',
    'maroon': 'red-900',
    'olive': 'yellow-600',
    'darkgray': 'gray-700',
    'darkgrey': 'gray-700',
    'lightgray': 'gray-300',
    'lightgrey': 'gray-300',
    'silver': 'gray-400',
    'gold': 'yellow-400',
    'coral': 'orange-400',
    'salmon': 'orange-300',
    'khaki': 'yellow-300',
    'plum': 'purple-400',
    'orchid': 'purple-300',
    'tan': 'yellow-200',
    'beige': 'yellow-100',
    'lavender': 'purple-200',
    'azure': 'blue-100',
    'ivory': 'yellow-50',
    'aqua': 'cyan-500',
    'magenta': 'fuchsia-500',
    'brown': 'amber-800',
    'auto': 'auto'
  };
  
  const lowerVal = val.toLowerCase();
  if (namedColorMap[lowerVal]) {
    return `${prefix}-${namedColorMap[lowerVal]}`;
  }
  
  // For hex, rgb, hsl, or other values, use arbitrary value syntax
  if (/^#|^rgb|^hsl|^var\(/i.test(val)) {
    // Clean up spaces for arbitrary syntax
    const cleanVal = val.replace(/\s+/g, '');
    return `${prefix}-[${cleanVal}]`;
  }
  
  return null;
}

// Form-specific color pattern matchers for backward compatibility
export const accentColorPatternMatcher = {
  test: (property: string): boolean => {
    return property.toLowerCase().trim() === 'accent-color';
  },
  convert: (property: string, value: string): string | null => {
    return convertColor(property, value);
  }
};

export const caretColorPatternMatcher = {
  test: (property: string): boolean => {
    return property.toLowerCase().trim() === 'caret-color';
  },
  convert: (property: string, value: string): string | null => {
    return convertColor(property, value);
  }
};

// Combined matcher for form colors
export const formColorPatternMatcher = {
  test: (property: string): boolean => {
    const prop = property.toLowerCase().trim();
    return prop === 'accent-color' || prop === 'caret-color';
  },
  convert: (property: string, value: string): string | null => {
    return convertColor(property, value);
  }
};
