// src/conversion/matchers/accent-color.ts

// ========================================================================
// The COMPLETE class implementation must be here
// ========================================================================
class AccentColorPatternMatcher {
    private colorPatterns = [
      /#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})/,
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/,
      /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/,
      /^(transparent|currentColor|inherit|initial|unset|revert|auto|black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|indigo|violet|coral|salmon|khaki|plum|orchid|tan|beige|azure|ivory|lavender|crimson|fuchsia|aqua)$/i
    ];
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
      
      if (prop === 'accent-color') {
        const accentClass = this.convertAccentColor(value.trim());
        if (accentClass) {
          classes.push(accentClass);
        }
      }
  
      return classes;
    }
  
    private isValidColor(color: string): boolean {
      return this.colorPatterns.some(pattern => pattern.test(color));
    }
  
    private convertAccentColor(color: string): string | null {
      const lowerColor = color.toLowerCase();
  
      // Handle special keywords
      if (lowerColor === 'auto') {
        // 'auto' uses the user agent's accent color, which is typically the system accent
        // Tailwind doesn't have a direct equivalent, so we'll use arbitrary value
        return 'accent-auto';
      }
  
      // Handle common color keywords
      const colorMap: Record<string, string> = {
        // CSS system colors
        'transparent': 'accent-transparent',
        'currentcolor': 'accent-current',
        
        // Basic colors
        'black': 'accent-black',
        'white': 'accent-white',
        
        // Tailwind color equivalents
        'red': 'accent-red-500',
        'green': 'accent-green-500',
        'blue': 'accent-blue-500',
        'yellow': 'accent-yellow-500',
        'orange': 'accent-orange-500',
        'purple': 'accent-purple-500',
        'pink': 'accent-pink-500',
        'gray': 'accent-gray-500',
        'grey': 'accent-gray-500',
        'indigo': 'accent-indigo-500',
        'violet': 'accent-violet-500',
        'cyan': 'accent-cyan-500',
        'teal': 'accent-teal-500',
        'lime': 'accent-lime-500',
        'emerald': 'accent-emerald-500',
        'sky': 'accent-sky-500',
        'rose': 'accent-rose-500',
        'fuchsia': 'accent-fuchsia-500',
        'amber': 'accent-amber-500',
        
        // Common hex values
        '#000': 'accent-black',
        '#000000': 'accent-black',
        '#fff': 'accent-white',
        '#ffffff': 'accent-white',
        '#ff0000': 'accent-red-500',
        '#00ff00': 'accent-green-500',
        '#0000ff': 'accent-blue-500',
        '#ffff00': 'accent-yellow-500',
        '#ff8000': 'accent-orange-500',
        '#8000ff': 'accent-purple-500',
        '#ff00ff': 'accent-fuchsia-500',
        '#00ffff': 'accent-cyan-500',
        
        // CSS named colors that map well to Tailwind
        'crimson': 'accent-red-600',
        'darkred': 'accent-red-800',
        'darkgreen': 'accent-green-800',
        'darkblue': 'accent-blue-800',
        'navy': 'accent-blue-900',
        'maroon': 'accent-red-900',
        'olive': 'accent-yellow-600',
        'darkgray': 'accent-gray-700',
        'darkgrey': 'accent-gray-700',
        'lightgray': 'accent-gray-300',
        'lightgrey': 'accent-gray-300',
        'silver': 'accent-gray-400',
        'gold': 'accent-yellow-400',
        'coral': 'accent-orange-400',
        'salmon': 'accent-orange-300',
        'khaki': 'accent-yellow-300',
        'plum': 'accent-purple-400',
        'orchid': 'accent-purple-300',
        'tan': 'accent-yellow-200',
        'beige': 'accent-yellow-100',
        'lavender': 'accent-purple-200',
        'azure': 'accent-blue-100',
        'ivory': 'accent-yellow-50',
        'aqua': 'accent-cyan-500',
        'magenta': 'accent-fuchsia-500',
        'brown': 'accent-amber-800'
      };
  
      if (colorMap[lowerColor]) {
        return colorMap[lowerColor];
      }
  
      // Handle hex, rgb, hsl, and other color formats with arbitrary values
      if (this.isValidColor(color)) {
        return `accent-[${color}]`;
      }
  
      // Handle CSS custom properties (CSS variables)
      if (color.startsWith('var(')) {
        return `accent-[${color}]`;
      }
  
      // Handle inherit, initial, unset, revert
      const cssKeywords = ['inherit', 'initial', 'unset', 'revert'];
      if (cssKeywords.includes(lowerColor)) {
        return `accent-[${color}]`;
      }
  
      return null;
    }
  }
  
  // ========================================================================
  // The Adapter Logic
  // ========================================================================
  
  const accentColorConverter = new AccentColorPatternMatcher();
  
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