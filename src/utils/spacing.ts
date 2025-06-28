// spacing.ts
// Utility functions for handling spacing-related CSS to Tailwind conversion

import { SPACING_PROPERTIES, SPACING_SCALE, FRACTION_SCALE } from './constants';

// Matcher for padding shorthand (e.g., "padding: 8px 16px")
export const paddingShorthandMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.trim();
    // Match padding with 2-4 values
    return prop === 'padding' && /^\d+(px|rem|em|%)?(\s+\d+(px|rem|em|%)?){1,3}$/.test(val);
  }
};

// Matcher for margin shorthand (e.g., "margin: 8px 16px")
export const marginShorthandMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.trim();
    // Match margin with 2-4 values
    return prop === 'margin' && /^\d+(px|rem|em|%)?(\s+\d+(px|rem|em|%)?){1,3}$/.test(val);
  }
};

// Matcher for basic spacing scale (e.g., "right: 0")
export const basicSpacingMatcher = {
  match: (property: string, value: string) => {
    return SPACING_PROPERTIES.includes(property) && Object.keys(SPACING_SCALE).includes(value);
  }
};

// Matcher for negative spacing (e.g., "right: -1")
export const negativeSpacingMatcher = {
  match: (property: string, value: string) => {
    return SPACING_PROPERTIES.includes(property) && /^-\d+(\.\d+)?$/.test(value);
  }
};

// Matcher for percentages (e.g., "width: 50%")
export const percentageSpacingMatcher = {
  match: (property: string, value: string) => {
    return SPACING_PROPERTIES.includes(property) && /^(\d+(\.\d+)?%|100%)$/.test(value);
  }
};

// Matcher for pixel values (e.g., "right: 1px")
export const pixelSpacingMatcher = {
  match: (property: string, value: string) => {
    return SPACING_PROPERTIES.includes(property) && /^(\d+(\.\d+)?px)$/.test(value);
  }
};

// Matcher for 'auto' values (e.g., "margin: auto")
export const autoSpacingMatcher = {
  match: (property: string, value: string) => {
    return SPACING_PROPERTIES.includes(property) && value === 'auto';
  }
};

// Matcher for pixel values that map to Tailwind scale
export const pixelToScaleMatcher = {
  match: (property: string, value: string) => {
    if (!SPACING_PROPERTIES.includes(property)) return false;
    const px = value.endsWith('px') ? value.replace('px', '') : null;
    return px && Object.values(SPACING_SCALE).includes(px);
  }
};

// Matcher for rem/em values
export const remEmSpacingMatcher = {
  match: (property: string, value: string) => {
    return SPACING_PROPERTIES.includes(property) && /^(\d+(\.\d+)?(rem|em))$/.test(value);
  }
};

// Matcher for margin: 0 auto pattern (horizontal centering)
export const marginAutoMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    // Split the value into parts to analyze the pattern
    const parts = val.split(/\s+/);
    
    // Check if this is a margin property
    if (prop !== 'margin') return false;
    
    // Simple cases
    if (val === 'auto') return true;
    if (val === '0 auto' || /^0(px)?\s+auto$/i.test(val)) return true;
    if (val === '0 auto 0' || /^0(px)?\s+auto\s+0(px)?$/i.test(val)) return true;
    if (val === '0 auto 0 auto' || /^0(px)?\s+auto\s+0(px)?\s+auto$/i.test(val)) return true;
    
    // Handle 3-value shorthand where 2nd value is auto (horizontal centering)
    // Pattern: top horizontal bottom (left defaults to horizontal)
    if (parts.length === 3 && parts[1].toLowerCase() === 'auto') {
      return true;
    }
    
    // Handle 4-value shorthand where 2nd and 4th values are auto
    // Pattern: top right bottom left
    if (parts.length === 4 && parts[1].toLowerCase() === 'auto' && parts[3].toLowerCase() === 'auto') {
      return true;
    }
    
    // Handle patterns like "10px auto 20px" where auto is in horizontal position
    if (parts.length >= 2 && parts.some(part => part.toLowerCase() === 'auto')) {
      // Check if auto is in horizontal position (2nd in 2+ values, or 2nd/4th in 4 values)
      if (parts.length === 2 && parts[1].toLowerCase() === 'auto') return true;
      if (parts.length === 3 && parts[1].toLowerCase() === 'auto') return true;
      if (parts.length === 4 && (parts[1].toLowerCase() === 'auto' || parts[3].toLowerCase() === 'auto')) return true;
    }
    
    return false;
  }
};

// Convert margin auto patterns to Tailwind centering classes
export function convertMarginAuto(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const val = value.toLowerCase().trim();
  
  if (prop !== 'margin') {
    return null;
  }
  
  // Split the value into parts
  const parts = val.split(/\s+/);
  
  // Helper function to convert a single spacing value to Tailwind class
  function convertSpacingValue(val: string): string {
    if (val === 'auto') return 'auto';
    if (val === '0' || val === '0px') return '0';
    
    // Handle px values
    if (val.endsWith('px')) {
      const num = val.replace('px', '');
      if ((SPACING_SCALE as Record<string, string>)[num]) {
        return (SPACING_SCALE as Record<string, string>)[num];
      }
      if (num === '1') return 'px';
      return `[${val}]`;
    }
    
    // Handle scale values
    if ((SPACING_SCALE as Record<string, string>)[val]) {
      return (SPACING_SCALE as Record<string, string>)[val];
    }
    
    // Handle other units
    return `[${val}]`;
  }
  
  // Handle single value: auto
  if (parts.length === 1 && parts[0] === 'auto') {
    return 'm-auto';
  }
  
  // Handle 2 values: vertical horizontal
  if (parts.length === 2) {
    const vertical = convertSpacingValue(parts[0]);
    const horizontal = convertSpacingValue(parts[1]);
    
    if (horizontal === 'auto') {
      const classes = [`mx-auto`];
      if (vertical !== '0') {
        classes.push(`my-${vertical}`);
      } else {
        classes.push('my-0');
      }
      return classes.join(' ');
    }
  }
  
  // Handle 3 values: top horizontal bottom (left defaults to horizontal)
  if (parts.length === 3) {
    const top = convertSpacingValue(parts[0]);
    const horizontal = convertSpacingValue(parts[1]);
    const bottom = convertSpacingValue(parts[2]);
    
    if (horizontal === 'auto') {
      const classes = [`mx-auto`];
      
      // Add top margin if not zero
      if (top !== '0') {
        classes.push(`mt-${top}`);
      } else {
        classes.push('mt-0');
      }
      
      // Add bottom margin if not zero
      if (bottom !== '0') {
        classes.push(`mb-${bottom}`);
      } else {
        classes.push('mb-0');
      }
      
      return classes.join(' ');
    }
  }
  
  // Handle 4 values: top right bottom left
  if (parts.length === 4) {
    const top = convertSpacingValue(parts[0]);
    const right = convertSpacingValue(parts[1]);
    const bottom = convertSpacingValue(parts[2]);
    const left = convertSpacingValue(parts[3]);
    
    // Check if horizontal (right and left) are auto
    if (right === 'auto' && left === 'auto') {
      const classes = [`mx-auto`];
      
      // Add top margin if not zero
      if (top !== '0') {
        classes.push(`mt-${top}`);
      } else {
        classes.push('mt-0');
      }
      
      // Add bottom margin if not zero
      if (bottom !== '0') {
        classes.push(`mb-${bottom}`);
      } else {
        classes.push('mb-0');
      }
      
      return classes.join(' ');
    }
    
    // Check if only right is auto (rare case, but handle it)
    if (right === 'auto' && left !== 'auto') {
      const classes = [`mr-auto`];
      
      if (top !== '0') classes.push(`mt-${top}`);
      if (bottom !== '0') classes.push(`mb-${bottom}`);
      if (left !== '0') classes.push(`ml-${left}`);
      
      return classes.join(' ');
    }
  }
  
  // Fallback cases
  if (val === '0 auto' || /^0(px)?\s+auto$/i.test(val)) {
    return 'mx-auto my-0';
  }
  
  if (val === '0 auto 0' || /^0(px)?\s+auto\s+0(px)?$/i.test(val)) {
    return 'mx-auto my-0';
  }
  
  if (val === '0 auto 0 auto' || /^0(px)?\s+auto\s+0(px)?\s+auto$/i.test(val)) {
    return 'mx-auto my-0';
  }
  
  return null;
}

/**
 * Convert margin and padding CSS to Tailwind classes using spacing matchers.
 * @param css - CSS string (e.g., "margin: 8px; padding: 16px 8px;")
 * @returns Array of Tailwind class strings
 */
export function convertSpacing(css: string): string[] {
  // Split CSS string into property-value pairs
  const rules = css
    .split(';')
    .map(rule => rule.trim())
    .filter(Boolean)
    .map(rule => {
      const [property, ...rest] = rule.split(':');
      return { property: property.trim(), value: rest.join(':').trim() };
    });

  // List of matchers
  const matchers = [
    paddingShorthandMatcher,
    marginShorthandMatcher,
    basicSpacingMatcher,
    negativeSpacingMatcher,
    percentageSpacingMatcher,
    pixelSpacingMatcher,
    autoSpacingMatcher,
    pixelToScaleMatcher,
    remEmSpacingMatcher,
    marginAutoMatcher
  ];

  // Use the same conversion logic as in tailwindConverter
  function spacingConvert(property: string, value: string): string | null {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    const propertyClassMap: Record<string, string> = {
      'top': 'top',
      'right': 'right',
      'bottom': 'bottom',
      'left': 'left',
      'margin': 'm',
      'margin-top': 'mt',
      'margin-right': 'mr',
      'margin-bottom': 'mb',
      'margin-left': 'ml',
      'padding': 'p',
      'padding-top': 'pt',
      'padding-right': 'pr',
      'padding-bottom': 'pb',
      'padding-left': 'pl',
      'width': 'w',
      'height': 'h',
      'min-width': 'min-w',
      'min-height': 'min-h',
      'max-width': 'max-w',
      'max-height': 'max-h',
      'gap': 'gap',
      'row-gap': 'gap-y',
      'column-gap': 'gap-x',
      'grid-gap': 'gap',
      'grid-row-gap': 'gap-y',
      'grid-column-gap': 'gap-x',
    };
    const prefix = propertyClassMap[prop];
    if (!prefix) return null;
    if (/-/.test(val)) {
      return `-${prefix}-${val.replace(/^-/, '')}`;
    }
    if (val === 'auto') {
      return `${prefix}-auto`;
    }
    if (val === '1px') {
      return `${prefix}-px`;
    }
    if ((SPACING_SCALE as Record<string, string>)[val]) {
      return `${prefix}-${(SPACING_SCALE as Record<string, string>)[val]}`;
    }
    if (/%$/.test(val)) {
      const percent = parseFloat(val.replace('%', '')) / 100;
      if ((FRACTION_SCALE as Record<string, string>)[percent.toString()]) {
        return `${prefix}-${(FRACTION_SCALE as Record<string, string>)[percent.toString()]}`;
      }
    }
    if (/^(\d+(\.\d+)?(rem|em))$/.test(val)) {
      return `${prefix}-[${val}]`;
    }
    return null;
  }

  // Find and convert all matching rules
  const classes: string[] = [];
  for (const rule of rules) {
    for (const matcher of matchers) {
      if (matcher.match(rule.property, rule.value)) {
        const tw = spacingConvert(rule.property, rule.value);
        if (tw) classes.push(tw);
        break;
      }
    }
  }
  return classes;
}
