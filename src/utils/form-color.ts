// src/conversion/matchers/form-color.ts

// ========================================================================
// Shared color utility for form-related color properties
// ========================================================================
class FormColorUtility {
  private colorPatterns = [
    /#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})/,
    /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/,
    /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/,
    /^(transparent|currentColor|inherit|initial|unset|revert|auto|black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|indigo|violet|coral|salmon|khaki|plum|orchid|tan|beige|azure|ivory|lavender|crimson|fuchsia|aqua)$/i
  ];

  // Common color mappings for both accent-color and caret-color
  private colorMap: Record<string, string> = {
    // CSS system colors
    'transparent': 'transparent',
    'currentcolor': 'current',
    
    // Basic colors
    'black': 'black',
    'white': 'white',
    
    // Tailwind color equivalents
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
    'violet': 'violet-500',
    'cyan': 'cyan-500',
    'teal': 'teal-500',
    'lime': 'lime-500',
    'emerald': 'emerald-500',
    'sky': 'sky-500',
    'rose': 'rose-500',
    'fuchsia': 'fuchsia-500',
    'amber': 'amber-500',
    
    // Common hex values
    '#000': 'black',
    '#000000': 'black',
    '#fff': 'white',
    '#ffffff': 'white',
    '#ff0000': 'red-500',
    '#00ff00': 'green-500',
    '#0000ff': 'blue-500',
    '#ffff00': 'yellow-500',
    '#ff8000': 'orange-500',
    '#8000ff': 'purple-500',
    '#ff00ff': 'fuchsia-500',
    '#00ffff': 'cyan-500',
    
    // CSS named colors that map well to Tailwind
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
    'brown': 'amber-800'
  };

  isValidColor(color: string): boolean {
    return this.colorPatterns.some(pattern => pattern.test(color));
  }

  convertColor(color: string, prefix: string): string | null {
    const lowerColor = color.toLowerCase();

    // Handle special keywords
    if (lowerColor === 'auto') {
      // 'auto' keyword - valid for both accent-color and caret-color
      return `${prefix}-auto`;
    }

    // Handle common color keywords
    if (this.colorMap[lowerColor]) {
      return `${prefix}-${this.colorMap[lowerColor]}`;
    }

    // Handle hex, rgb, hsl, and other color formats with arbitrary values
    if (this.isValidColor(color)) {
      return `${prefix}-[${color}]`;
    }

    // Handle CSS custom properties (CSS variables)
    if (color.startsWith('var(')) {
      return `${prefix}-[${color}]`;
    }

    // Handle inherit, initial, unset, revert
    const cssKeywords = ['inherit', 'initial', 'unset', 'revert'];
    if (cssKeywords.includes(lowerColor)) {
      return `${prefix}-[${color}]`;
    }

    return null;
  }
}

// ========================================================================
// The COMPLETE class implementations
// ========================================================================
class AccentColorPatternMatcher {
  private colorUtility = new FormColorUtility();

  convertToTailwind(property: string, value: string): string[] {
    const classes: string[] = [];
    const prop = property.toLowerCase().trim();
    
    if (prop === 'accent-color') {
      const accentClass = this.colorUtility.convertColor(value.trim(), 'accent');
      if (accentClass) {
        classes.push(accentClass);
      }
    }

    return classes;
  }
}

class CaretColorPatternMatcher {
  private colorUtility = new FormColorUtility();

  convertToTailwind(property: string, value: string): string[] {
    const classes: string[] = [];
    const prop = property.toLowerCase().trim();
    
    if (prop === 'caret-color') {
      const caretClass = this.colorUtility.convertColor(value.trim(), 'caret');
      if (caretClass) {
        classes.push(caretClass);
      }
    }

    return classes;
  }
}

// ========================================================================
// The Adapter Logic
// ========================================================================

const accentColorConverter = new AccentColorPatternMatcher();
const caretColorConverter = new CaretColorPatternMatcher();

export const accentColorPatternMatcher = {
  test: (property: string): boolean => {
    const prop = property.toLowerCase().trim();
    return prop === 'accent-color';
  },
  convert: (property: string, value: string): string | null => {
    const tailwindClasses = accentColorConverter.convertToTailwind(property, value);
    if (tailwindClasses.length > 0) {
      return tailwindClasses.join(' ');
    }
    return null;
  },
};

export const caretColorPatternMatcher = {
  test: (property: string): boolean => {
    const prop = property.toLowerCase().trim();
    return prop === 'caret-color';
  },
  convert: (property: string, value: string): string | null => {
    const tailwindClasses = caretColorConverter.convertToTailwind(property, value);
    if (tailwindClasses.length > 0) {
      return tailwindClasses.join(' ');
    }
    return null;
  },
};

// Combined matcher for both properties
export const formColorPatternMatcher = {
  test: (property: string): boolean => {
    const prop = property.toLowerCase().trim();
    return prop === 'accent-color' || prop === 'caret-color';
  },
  convert: (property: string, value: string): string | null => {
    if (accentColorPatternMatcher.test(property)) {
      return accentColorPatternMatcher.convert(property, value);
    }
    if (caretColorPatternMatcher.test(property)) {
      return caretColorPatternMatcher.convert(property, value);
    }
    return null;
  },
};