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
      'violet', 'navy', 'teal', 'olive', 'maroon', 'silver', 'gold'
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
  
  // Handle named colors with Tailwind equivalents
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
    'cyan': 'cyan-500'
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
