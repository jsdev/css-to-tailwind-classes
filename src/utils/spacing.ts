// spacing.ts
// Utility functions for handling spacing-related CSS to Tailwind conversion

import { SPACING_PROPERTIES, SPACING_SCALE, FRACTION_SCALE } from './constants';

// Matcher for padding shorthand (e.g., "padding: 8px 16px")
export const paddingShorthandMatcher = {
  match: (property: string, value: string) => {
    return property.startsWith('padding') && /\d+(px|rem|em|%)?( \d+(px|rem|em|%)?){1,3}/.test(value);
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
    basicSpacingMatcher,
    negativeSpacingMatcher,
    percentageSpacingMatcher,
    pixelSpacingMatcher,
    autoSpacingMatcher,
    pixelToScaleMatcher,
    remEmSpacingMatcher
  ];

  // Use the same conversion logic as in tailwindConverter
  function spacingConvert(property: string, value: string): string | null {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    const propertyClassMap = {
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
    if (/^-/.test(val)) {
      return `-${prefix}-${val.replace(/^-/, '')}`;
    }
    if (val === 'auto') {
      return `${prefix}-auto`;
    }
    if (val === '1px') {
      return `${prefix}-px`;
    }
    if (SPACING_SCALE[val]) {
      return `${prefix}-${SPACING_SCALE[val]}`;
    }
    if (/%$/.test(val)) {
      const percent = parseFloat(val.replace('%', '')) / 100;
      if (FRACTION_SCALE[percent.toString()]) {
        return `${prefix}-${FRACTION_SCALE[percent.toString()]}`;
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
