import { ConversionResult, CSSRule } from '../types';
import tailwindMap from '../tailwindMap';

// Define spacing scale (Tailwind's default spacing)
const SPACING_SCALE = {
  '0': '0',
  '0.5': '0.5',
  '1': '1',
  '1.5': '1.5',
  '2': '2',
  '2.5': '2.5',
  '3': '3',
  '3.5': '3.5',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  '11': '11',
  '12': '12',
  '14': '14',
  '16': '16',
  '20': '20',
  '24': '24',
  '28': '28',
  '32': '32',
  '36': '36',
  '40': '40',
  '44': '44',
  '48': '48',
  '52': '52',
  '56': '56',
  '60': '60',
  '64': '64',
  '72': '72',
  '80': '80',
  '96': '96'
};

// Properties that use spacing scale
const SPACING_PROPERTIES = [
  'top', 'right', 'bottom', 'left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'gap', 'row-gap', 'column-gap', 'grid-gap', 'grid-row-gap', 'grid-column-gap'
];

// Grid properties
const GRID_PROPERTIES = [
  'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
  'grid-column', 'grid-row', 'grid-column-start', 'grid-column-end',
  'grid-row-start', 'grid-row-end', 'grid-auto-columns', 'grid-auto-rows',
  'grid-auto-flow', 'justify-items', 'align-items', 'place-items',
  'justify-content', 'align-content', 'place-content'
];

// Aspect ratio properties
const ASPECT_RATIO_PROPERTIES = ['aspect-ratio'];

// Fraction scale for percentages
const FRACTION_SCALE = {
  '0.08333333333333333': '1/12',
  '0.16666666666666666': '1/6',
  '0.25': '1/4',
  '0.3333333333333333': '1/3',
  '0.41666666666666669': '5/12',
  '0.5': '1/2',
  '0.5833333333333334': '7/12',
  '0.6666666666666666': '2/3',
  '0.75': '3/4',
  '0.8333333333333334': '5/6',
  '0.9166666666666666': '11/12',
  '1': 'full'
};

// Aspect ratio patterns (common ratios)
const ASPECT_RATIO_PATTERNS = {
  'auto': 'aspect-auto',
  '1 / 1': 'aspect-square',
  '1': 'aspect-square',
  '16 / 9': 'aspect-video',
  '16/9': 'aspect-video',
  '1.7777777777777777': 'aspect-video', // 16/9 as decimal
  '1.777777777777778': 'aspect-video',  // 16/9 rounded
  '1.78': 'aspect-video',               // 16/9 rounded
  '4 / 3': 'aspect-[4/3]',
  '4/3': 'aspect-[4/3]',
  '1.3333333333333333': 'aspect-[4/3]', // 4/3 as decimal
  '1.333333333333333': 'aspect-[4/3]',
  '1.33': 'aspect-[4/3]',
  '3 / 2': 'aspect-[3/2]',
  '3/2': 'aspect-[3/2]',
  '1.5': 'aspect-[3/2]',
  '2 / 3': 'aspect-[2/3]',
  '2/3': 'aspect-[2/3]',
  '0.6666666666666666': 'aspect-[2/3]', // 2/3 as decimal
  '0.666666666666667': 'aspect-[2/3]',
  '0.67': 'aspect-[2/3]',
  '3 / 4': 'aspect-[3/4]',
  '3/4': 'aspect-[3/4]',
  '0.75': 'aspect-[3/4]',
  '9 / 16': 'aspect-[9/16]',
  '9/16': 'aspect-[9/16]',
  '0.5625': 'aspect-[9/16]',            // 9/16 as decimal
  '0.56': 'aspect-[9/16]',
  '21 / 9': 'aspect-[21/9]',
  '21/9': 'aspect-[21/9]',
  '2.3333333333333335': 'aspect-[21/9]', // 21/9 as decimal
  '2.33': 'aspect-[21/9]'
};

// Helper function to parse aspect ratio values
function parseAspectRatio(value: string): { width: number, height: number } | null {
  const normalized = value.toLowerCase().trim();
  
  // Handle "auto"
  if (normalized === 'auto') {
    return null;
  }
  
  // Handle fraction format (e.g., "16 / 9", "16/9")
  const fractionMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (fractionMatch) {
    return {
      width: parseFloat(fractionMatch[1]),
      height: parseFloat(fractionMatch[2])
    };
  }
  
  // Handle decimal format (e.g., "1.777", "0.75")
  const decimalMatch = normalized.match(/^(\d+(?:\.\d+)?)$/);
  if (decimalMatch) {
    const ratio = parseFloat(decimalMatch[1]);
    return {
      width: ratio,
      height: 1
    };
  }
  
  return null;
}

// Helper function to convert aspect ratio to fraction string
function aspectRatioToFraction(width: number, height: number): string {
  // Find GCD to simplify fraction
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
  
  // Convert to integers for GCD calculation
  const multiplier = 1000;
  const w = Math.round(width * multiplier);
  const h = Math.round(height * multiplier);
  const divisor = gcd(w, h);
  
  const simplifiedW = w / divisor;
  const simplifiedH = h / divisor;
  
  return `${simplifiedW}/${simplifiedH}`;
}

// Grid template patterns
const GRID_PATTERNS = {
  // Common grid patterns
  'repeat(1, minmax(0, 1fr))': 'grid-cols-1',
  'repeat(2, minmax(0, 1fr))': 'grid-cols-2',
  'repeat(3, minmax(0, 1fr))': 'grid-cols-3',
  'repeat(4, minmax(0, 1fr))': 'grid-cols-4',
  'repeat(5, minmax(0, 1fr))': 'grid-cols-5',
  'repeat(6, minmax(0, 1fr))': 'grid-cols-6',
  'repeat(7, minmax(0, 1fr))': 'grid-cols-7',
  'repeat(8, minmax(0, 1fr))': 'grid-cols-8',
  'repeat(9, minmax(0, 1fr))': 'grid-cols-9',
  'repeat(10, minmax(0, 1fr))': 'grid-cols-10',
  'repeat(11, minmax(0, 1fr))': 'grid-cols-11',
  'repeat(12, minmax(0, 1fr))': 'grid-cols-12',
  'none': 'grid-cols-none',
  'subgrid': 'grid-cols-subgrid'
};

const GRID_ROWS_PATTERNS = {
  'repeat(1, minmax(0, 1fr))': 'grid-rows-1',
  'repeat(2, minmax(0, 1fr))': 'grid-rows-2',
  'repeat(3, minmax(0, 1fr))': 'grid-rows-3',
  'repeat(4, minmax(0, 1fr))': 'grid-rows-4',
  'repeat(5, minmax(0, 1fr))': 'grid-rows-5',
  'repeat(6, minmax(0, 1fr))': 'grid-rows-6',
  'none': 'grid-rows-none',
  'subgrid': 'grid-rows-subgrid'
};

// Helper function to analyze grid template values
function analyzeGridTemplate(value: string): { type: 'equal-columns' | 'equal-rows' | 'mixed' | 'unknown', count?: number, size?: string } {
  const normalized = value.toLowerCase().trim();
  
  // Split by spaces but handle functions properly
  const parts = normalized.match(/(?:[^\s()]+(?:\([^)]*\))?)+/g) || [];
  
  if (parts.length === 0) return { type: 'unknown' };
  
  // Check if all parts are the same (equal columns/rows)
  const firstPart = parts[0];
  const allSame = parts.every(part => part === firstPart);
  
  if (allSame) {
    return {
      type: 'equal-columns',
      count: parts.length,
      size: firstPart
    };
  }
  
  return { type: 'mixed' };
}

// Dynamic pattern matching functions
const PATTERN_MATCHERS = [
  // New matcher for padding shorthand properties
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.trim();
      // Test for 'padding' property with two values (e.g., "8px 16px")
      return prop === 'padding' && val.split(/\s+/).length === 2;
    },
    convert: (property: string, value: string) => {
      // A map to convert pixel values to Tailwind's spacing scale
      const pixelToSpacing: Record<string, string> = {
        '0px': '0', '0': '0',
        '1px': 'px',
        '2px': '0.5',
        '4px': '1',
        '6px': '1.5',
        '8px': '2',
        '10px': '2.5',
        '12px': '3',
        '14px': '3.5',
        '16px': '4',
        '20px': '5',
        '24px': '6',
        '32px': '8',
      };
      
      const parts = value.trim().split(/\s+/);
      const vertical = parts[0];
      const horizontal = parts[1];

      const pyClass = pixelToSpacing[vertical];
      const pxClass = pixelToSpacing[horizontal];

      // Check if both values were successfully mapped
      if (pyClass !== undefined && pxClass !== undefined) {
        // Handle the special case for 'p-px'
        const py = pyClass === 'px' ? 'py-px' : `py-${pyClass}`;
        const px = pxClass === 'px' ? 'px-px' : `px-${pxClass}`;
        
        // If they are the same, combine them (e.g., p-2)
        if (pyClass === pxClass) {
          return pyClass === 'px' ? 'p-px' : `p-${pyClass}`;
        }
        
        return `${py} ${px}`;
      }
      
      return null; // Return null if the pattern doesn't match a known conversion
    }
  },
  // Basic spacing scale (e.g., "right: 0" → "right-0")
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return SPACING_PROPERTIES.includes(prop) && SPACING_SCALE[val];
    },
    convert: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      const spacingClass = SPACING_SCALE[val];
      
      // Handle margin/padding shorthand
      if (prop === 'margin') return `m-${spacingClass}`;
      if (prop === 'padding') return `p-${spacingClass}`;
      
      // Handle directional properties
      const propertyClassMap: Record<string, string> = {
        'top': 'top',
        'right': 'right',
        'bottom': 'bottom',
        'left': 'left',
        'margin-top': 'mt',
        'margin-right': 'mr',
        'margin-bottom': 'mb',
        'margin-left': 'ml',
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
        'column-gap': 'gap-x'
      };
      
      const classPrefix = propertyClassMap[prop];
      return classPrefix ? `${classPrefix}-${spacingClass}` : null;
    }
  },
  
  // Negative spacing (e.g., "right: -1" → "-right-1")
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return SPACING_PROPERTIES.includes(prop) && val.startsWith('-') && SPACING_SCALE[val.substring(1)];
    },
    convert: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim().substring(1); // Remove minus sign
      const spacingClass = SPACING_SCALE[val];
      
      const propertyClassMap: Record<string, string> = {
        'top': '-top',
        'right': '-right',
        'bottom': '-bottom',
        'left': '-left',
        'margin-top': '-mt',
        'margin-right': '-mr',
        'margin-bottom': '-mb',
        'margin-left': '-ml'
      };
      
      const classPrefix = propertyClassMap[prop];
      return classPrefix ? `${classPrefix}-${spacingClass}` : null;
    }
  },
  
  // Percentages using fractions (e.g., "width: 50%" → "w-1/2")
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      if (!val.endsWith('%')) return false;
      
      const percentage = parseFloat(val.replace('%', '')) / 100;
      return ['width', 'height', 'top', 'right', 'bottom', 'left'].includes(prop) && 
             FRACTION_SCALE[percentage.toString()];
    },
    convert: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      const percentage = parseFloat(val.replace('%', '')) / 100;
      const fractionClass = FRACTION_SCALE[percentage.toString()];
      
      const propertyClassMap: Record<string, string> = {
        'width': 'w',
        'height': 'h',
        'top': 'top',
        'right': 'right',
        'bottom': 'bottom',
        'left': 'left'
      };
      
      const classPrefix = propertyClassMap[prop];
      return classPrefix ? `${classPrefix}-${fractionClass}` : null;
    }
  },
  
  // Pixel values (e.g., "right: 1px" → "right-px")
  {
    test: (property: string, value: string) => {
      const val = value.toLowerCase().trim();
      return val === '1px' || val === '-1px';
    },
    convert: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      const isNegative = val.startsWith('-');
      
      const propertyClassMap: Record<string, string> = {
        'top': isNegative ? '-top-px' : 'top-px',
        'right': isNegative ? '-right-px' : 'right-px',
        'bottom': isNegative ? '-bottom-px' : 'bottom-px',
        'left': isNegative ? '-left-px' : 'left-px',
        'margin-top': isNegative ? '-mt-px' : 'mt-px',
        'margin-right': isNegative ? '-mr-px' : 'mr-px',
        'margin-bottom': isNegative ? '-mb-px' : 'mb-px',
        'margin-left': isNegative ? '-ml-px' : 'ml-px'
      };
      
      return propertyClassMap[prop] || null;
    }
  },
  
  // Auto values (e.g., "right: auto" → "right-auto")
  {
    test: (property: string, value: string) => {
      return value.toLowerCase().trim() === 'auto';
    },
    convert: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const propertyClassMap: Record<string, string> = {
        'top': 'top-auto',
        'right': 'right-auto',
        'bottom': 'bottom-auto',
        'left': 'left-auto',
        'margin': 'm-auto',
        'margin-top': 'mt-auto',
        'margin-right': 'mr-auto',
        'margin-bottom': 'mb-auto',
        'margin-left': 'ml-auto'
      };
      
      return propertyClassMap[prop] || null;
    }
  },
  
  // Grid template columns - equal columns with fr units
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      return prop === 'grid-template-columns' && GRID_PATTERNS[value.toLowerCase().trim()];
    },
    convert: (property: string, value: string) => {
      return GRID_PATTERNS[value.toLowerCase().trim()];
    }
  },
  
  // Grid template rows - equal rows with fr units
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      return prop === 'grid-template-rows' && GRID_ROWS_PATTERNS[value.toLowerCase().trim()];
    },
    convert: (property: string, value: string) => {
      return GRID_ROWS_PATTERNS[value.toLowerCase().trim()];
    }
  },
  
  // Grid template columns - equal fixed-size columns (e.g., "200px 200px 200px")
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      if (prop !== 'grid-template-columns') return false;
      
      const analysis = analyzeGridTemplate(value);
      return analysis.type === 'equal-columns' && analysis.count && analysis.count <= 12;
    },
    convert: (property: string, value: string) => {
      const analysis = analyzeGridTemplate(value);
      if (analysis.type === 'equal-columns' && analysis.count && analysis.size) {
        // For equal fixed-size columns, use arbitrary value with repeat
        return `grid-cols-[repeat(${analysis.count},${analysis.size})]`;
      }
      return null;
    }
  },
  
  // Grid template rows - equal fixed-size rows
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      if (prop !== 'grid-template-rows') return false;
      
      const analysis = analyzeGridTemplate(value);
      return analysis.type === 'equal-columns' && analysis.count && analysis.count <= 6;
    },
    convert: (property: string, value: string) => {
      const analysis = analyzeGridTemplate(value);
      if (analysis.type === 'equal-columns' && analysis.count && analysis.size) {
        return `grid-rows-[repeat(${analysis.count},${analysis.size})]`;
      }
      return null;
    }
  },
  
  // Grid template columns - mixed sizes (fallback to arbitrary value)
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      return prop === 'grid-template-columns';
    },
    convert: (property: string, value: string) => {
      // Clean up the value for arbitrary syntax
      const cleanValue = value.trim().replace(/\s+/g, '_');
      return `grid-cols-[${cleanValue}]`;
    }
  },
  
  // Grid template rows - mixed sizes (fallback to arbitrary value)
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      return prop === 'grid-template-rows';
    },
    convert: (property: string, value: string) => {
      // Clean up the value for arbitrary syntax
      const cleanValue = value.trim().replace(/\s+/g, '_');
      return `grid-rows-[${cleanValue}]`;
    }
  },
  
  // Grid gap - single value
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return (prop === 'gap' || prop === 'grid-gap') && SPACING_SCALE[val];
    },
    convert: (property: string, value: string) => {
      const val = value.toLowerCase().trim();
      const spacingClass = SPACING_SCALE[val];
      return `gap-${spacingClass}`;
    }
  },
  
  // Grid column gap
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return (prop === 'column-gap' || prop === 'grid-column-gap') && SPACING_SCALE[val];
    },
    convert: (property: string, value: string) => {
      const val = value.toLowerCase().trim();
      const spacingClass = SPACING_SCALE[val];
      return `gap-x-${spacingClass}`;
    }
  },
  
  // Grid row gap
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return (prop === 'row-gap' || prop === 'grid-row-gap') && SPACING_SCALE[val];
    },
    convert: (property: string, value: string) => {
      const val = value.toLowerCase().trim();
      const spacingClass = SPACING_SCALE[val];
      return `gap-y-${spacingClass}`;
    }
  },
  
  // Grid column span (e.g., "span 2 / span 2")
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return prop === 'grid-column' && val.match(/^span\s+(\d+)$/);
    },
    convert: (property: string, value: string) => {
      const match = value.toLowerCase().trim().match(/^span\s+(\d+)$/);
      if (match) {
        const span = match[1];
        return `col-span-${span}`;
      }
      return null;
    }
  },
  
  // Grid row span
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return prop === 'grid-row' && val.match(/^span\s+(\d+)$/);
    },
    convert: (property: string, value: string) => {
      const match = value.toLowerCase().trim().match(/^span\s+(\d+)$/);
      if (match) {
        const span = match[1];
        return `row-span-${span}`;
      }
      return null;
    }
  },
  
  // Grid column start/end
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return (prop === 'grid-column-start' || prop === 'grid-column-end') && 
             (val === 'auto' || /^\d+$/.test(val));
    },
    convert: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      
      if (val === 'auto') {
        return prop === 'grid-column-start' ? 'col-start-auto' : 'col-end-auto';
      }
      
      if (/^\d+$/.test(val)) {
        return prop === 'grid-column-start' ? `col-start-${val}` : `col-end-${val}`;
      }
      
      return null;
    }
  },
  
  // Grid row start/end
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      return (prop === 'grid-row-start' || prop === 'grid-row-end') && 
             (val === 'auto' || /^\d+$/.test(val));
    },
    convert: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      const val = value.toLowerCase().trim();
      
      if (val === 'auto') {
        return prop === 'grid-row-start' ? 'row-start-auto' : 'row-end-auto';
      }
      
      if (/^\d+$/.test(val)) {
        return prop === 'grid-row-start' ? `row-start-${val}` : `row-end-${val}`;
      }
      
      return null;
    }
  },
  
  // Aspect ratio - common ratios
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      return prop === 'aspect-ratio' && ASPECT_RATIO_PATTERNS[value.toLowerCase().trim()];
    },
    convert: (property: string, value: string) => {
      return ASPECT_RATIO_PATTERNS[value.toLowerCase().trim()];
    }
  },
  
  // Aspect ratio - custom ratios (fraction format)
 {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      if (prop !== 'aspect-ratio') return false;
      
      const parsed = parseAspectRatio(value);
      return parsed !== null;
    },
    convert: (property: string, value: string) => {
      const parsed = parseAspectRatio(value);
      if (!parsed) return null;
      
      const { width, height } = parsed;
      
      // Check if it's a common ratio first
      const decimal = width / height;
      const decimalStr = decimal.toString();
      const roundedDecimal = Math.round(decimal * 100) / 100;
      
      // Try to match against known patterns using decimal
      for (const [pattern, className] of Object.entries(ASPECT_RATIO_PATTERNS)) {
        if (pattern === decimalStr || pattern === roundedDecimal.toString()) {
          return className;
        }
      }
      
      // For custom ratios, create fraction notation
      if (height === 1) {
        // If height is 1, it's already a decimal ratio
        return `aspect-[${width}]`;
      } else {
        // Convert to simplified fraction
        const fraction = aspectRatioToFraction(width, height);
        return `aspect-[${fraction}]`;
      }
    }
  },
  
  // Aspect ratio - fallback for any aspect-ratio value
  {
    test: (property: string, value: string) => {
      const prop = property.toLowerCase().trim();
      return prop === 'aspect-ratio';
    },
    convert: (property: string, value: string) => {
      // Final fallback - use the value as-is in arbitrary syntax
      const cleanValue = value.trim().replace(/\s+/g, '');
      return `aspect-[${cleanValue}]`;
    }
  },
  // Add these pattern matchers to your PATTERN_MATCHERS array

// Color patterns - hex colors
{
  test: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    const colorProperties = [
      'color', 'background-color', 'border-color', 'border-top-color', 
      'border-right-color', 'border-bottom-color', 'border-left-color',
      'text-decoration-color', 'outline-color', 'fill', 'stroke'
    ];
    return colorProperties.includes(prop) && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val);
  },
  convert: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    const propertyMap: Record<string, string> = {
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
      'stroke': 'stroke'
    };
    
    const prefix = propertyMap[prop];
    if (!prefix) return null;
    
    return `${prefix}-[${val}]`;
  }
},

// RGB/RGBA colors
{
  test: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    const colorProperties = [
      'color', 'background-color', 'border-color', 'border-top-color', 
      'border-right-color', 'border-bottom-color', 'border-left-color',
      'text-decoration-color', 'outline-color', 'fill', 'stroke'
    ];
    return colorProperties.includes(prop) && 
           (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)$/i.test(val) ||
            /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)$/i.test(val));
  },
  convert: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.trim();
    
    const propertyMap: Record<string, string> = {
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
      'stroke': 'stroke'
    };
    
    const prefix = propertyMap[prop];
    if (!prefix) return null;
    
    // Clean up spaces in the value for arbitrary syntax
    const cleanVal = val.replace(/\s+/g, '');
    return `${prefix}-[${cleanVal}]`;
  }
},

// Border radius - pixel values
{
  test: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    const borderRadiusProps = [
      'border-radius', 'border-top-left-radius', 'border-top-right-radius',
      'border-bottom-left-radius', 'border-bottom-right-radius'
    ];
    return borderRadiusProps.includes(prop) && /^\d+px$/.test(val);
  },
  convert: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    const propertyMap: Record<string, string> = {
      'border-radius': 'rounded',
      'border-top-left-radius': 'rounded-tl',
      'border-top-right-radius': 'rounded-tr',
      'border-bottom-left-radius': 'rounded-bl',
      'border-bottom-right-radius': 'rounded-br'
    };
    
    const prefix = propertyMap[prop];
    if (!prefix) return null;
    
    return `${prefix}-[${val}]`;
  }
},

// Border radius - common values
{
  test: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    const borderRadiusProps = [
      'border-radius', 'border-top-left-radius', 'border-top-right-radius',
      'border-bottom-left-radius', 'border-bottom-right-radius'
    ];
    const commonValues: Record<string, string> = {
      '0': '0',
      '2px': 'sm',
      '4px': '',
      '6px': 'md',
      '8px': 'lg',
      '12px': 'xl',
      '16px': '2xl',
      '24px': '3xl',
      '50%': 'full'
    };
    return borderRadiusProps.includes(prop) && commonValues[val];
  },
  convert: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    const propertyMap: Record<string, string> = {
      'border-radius': 'rounded',
      'border-top-left-radius': 'rounded-tl',
      'border-top-right-radius': 'rounded-tr',
      'border-bottom-left-radius': 'rounded-bl',
      'border-bottom-right-radius': 'rounded-br'
    };
    
    const commonValues: Record<string, string> = {
      '0': '0',
      '2px': 'sm',
      '4px': '',
      '6px': 'md',
      '8px': 'lg',
      '12px': 'xl',
      '16px': '2xl',
      '24px': '3xl',
      '50%': 'full'
    };
    
    const prefix = propertyMap[prop];
    const suffix = commonValues[val];
    if (!prefix || suffix === undefined) return null;
    
    return suffix ? `${prefix}-${suffix}` : prefix;
  }
},

// Box shadow - common patterns
{
  test: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    return prop === 'box-shadow' || prop === 'filter';
  },
  convert: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    if (prop === 'box-shadow') {
      // Common shadow patterns
      const shadowPatterns: Record<string, string> = {
        'none': 'shadow-none',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)': 'shadow-sm',
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)': 'shadow',
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)': 'shadow-md',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)': 'shadow-lg',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)': 'shadow-xl',
        '0 25px 50px -12px rgba(0, 0, 0, 0.25)': 'shadow-2xl'
      };
      
      // Check for exact matches first
      if (shadowPatterns[val]) {
        return shadowPatterns[val];
      }
      
      // For custom shadows, use arbitrary value
      const cleanVal = value.trim().replace(/\s+/g, '_');
      return `shadow-[${cleanVal}]`;
    }
    
    return null;
  }
},

// Spacing - pixel values that map to Tailwind scale
{
  test: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    // Pixel to Tailwind spacing map
    const pixelToSpacing: Record<string, string> = {
      '0px': '0',
      '1px': 'px',
      '2px': '0.5',
      '4px': '1',
      '6px': '1.5',
      '8px': '2',
      '10px': '2.5',
      '12px': '3',
      '14px': '3.5',
      '16px': '4',
      '20px': '5',
      '24px': '6',
      '28px': '7',
      '32px': '8',
      '36px': '9',
      '40px': '10',
      '44px': '11',
      '48px': '12',
      '56px': '14',
      '64px': '16',
      '80px': '20',
      '96px': '24',
      '112px': '28',
      '128px': '32',
      '144px': '36',
      '160px': '40',
      '176px': '44',
      '192px': '48',
      '208px': '52',
      '224px': '56',
      '240px': '60',
      '256px': '64',
      '288px': '72',
      '320px': '80',
      '384px': '96'
    };
    
    return SPACING_PROPERTIES.includes(prop) && pixelToSpacing[val];
  },
  convert: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    const pixelToSpacing: Record<string, string> = {
      '0px': '0',
      '1px': 'px',
      '2px': '0.5',
      '4px': '1',
      '6px': '1.5',
      '8px': '2',
      '10px': '2.5',
      '12px': '3',
      '14px': '3.5',
      '16px': '4',
      '20px': '5',
      '24px': '6',
      '28px': '7',
      '32px': '8',
      '36px': '9',
      '40px': '10',
      '44px': '11',
      '48px': '12',
      '56px': '14',
      '64px': '16',
      '80px': '20',
      '96px': '24',
      '112px': '28',
      '128px': '32',
      '144px': '36',
      '160px': '40',
      '176px': '44',
      '192px': '48',
      '208px': '52',
      '224px': '56',
      '240px': '60',
      '256px': '64',
      '288px': '72',
      '320px': '80',
      '384px': '96'
    };
    
    const spacingClass = pixelToSpacing[val];
    
    const propertyClassMap: Record<string, string> = {
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
      'top': 'top',
      'right': 'right',
      'bottom': 'bottom',
      'left': 'left',
      'width': 'w',
      'height': 'h',
      'min-width': 'min-w',
      'min-height': 'min-h',
      'max-width': 'max-w',
      'max-height': 'max-h',
      'gap': 'gap',
      'row-gap': 'gap-y',
      'column-gap': 'gap-x'
    };
    
    const classPrefix = propertyClassMap[prop];
    if (!classPrefix || !spacingClass) return null;
    
    return spacingClass === 'px' ? `${classPrefix}-px` : `${classPrefix}-${spacingClass}`;
  }
},

// Spacing - rem/em values
{
  test: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    return SPACING_PROPERTIES.includes(prop) && /^\d*\.?\d+(rem|em)$/.test(val);
  },
  convert: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.trim();
    
    const propertyClassMap: Record<string, string> = {
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
      'top': 'top',
      'right': 'right',
      'bottom': 'bottom',
      'left': 'left',
      'width': 'w',
      'height': 'h',
      'min-width': 'min-w',
      'min-height': 'min-h',
      'max-width': 'max-w',
      'max-height': 'max-h',
      'gap': 'gap',
      'row-gap': 'gap-y',
      'column-gap': 'gap-x'
    };
    
    const classPrefix = propertyClassMap[prop];
    if (!classPrefix) return null;
    
    return `${classPrefix}-[${val}]`;
  }
}
];

// Helper function to normalize CSS values
function normalizeValue(value: string): string[] {
  const normalized = value.toLowerCase().trim();
  const variations: string[] = [normalized];
  
  // Remove common units for additional matching
  const withoutUnits = normalized.replace(/px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax/gi, '');
  if (withoutUnits !== normalized && withoutUnits) {
    variations.push(withoutUnits);
  }
  
  // Handle spacing (spaces to commas and hyphens)
  if (normalized.includes(' ')) {
    variations.push(normalized.replace(/\s+/g, ','));
    variations.push(normalized.replace(/\s+/g, '-'));
  }
  
  // Handle colors - remove # prefix
  if (normalized.startsWith('#')) {
    variations.push(normalized.substring(1));
  }
  
  return [...new Set(variations)];
}

// Helper function to create map key
function createMapKey(property: string, value: string): string {
  return `${property.toLowerCase().trim()}: ${value}`;
}

// Main conversion function with dynamic pattern matching
function tryPatternMatch(property: string, value: string): string | null {
  for (const matcher of PATTERN_MATCHERS) {
    if (matcher.test(property, value)) {
      return matcher.convert(property, value);
    }
  }
  return null;
}

// Helper function to find similar properties or values
function findSimilarItems(target: string, items: string[], maxSuggestions = 3): string[] {
  return items
    .filter(item => {
      const lowerItem = item.toLowerCase();
      const lowerTarget = target.toLowerCase();
      return lowerItem.includes(lowerTarget) || 
             lowerTarget.includes(lowerItem) ||
             lowerItem.split('').some(char => lowerTarget.includes(char));
    })
    .slice(0, maxSuggestions);
}

// Helper function to extract available properties from the map
function getAvailableProperties(): string[] {
  const staticProperties = [...new Set(
    Object.keys(tailwindMap)
      .map(key => key.split(':')[0].trim())
  )];
  
  // Add dynamic properties
  const dynamicProperties = [...SPACING_PROPERTIES, ...GRID_PROPERTIES, ...ASPECT_RATIO_PROPERTIES];
  
  return [...new Set([...staticProperties, ...dynamicProperties])];
}

// Helper function to get available values for a specific property
function getAvailableValues(property: string): string[] {
  const normalizedProperty = property.toLowerCase().trim();
  
  // Get static values from the map
  const staticValues = Object.keys(tailwindMap)
    .filter(key => key.startsWith(`${normalizedProperty}:`))
    .map(key => key.split(':')[1].trim())
    .slice(0, 5);
  
  // Add dynamic values for spacing properties
  if (SPACING_PROPERTIES.includes(normalizedProperty)) {
    const spacingValues = Object.keys(SPACING_SCALE).slice(0, 5);
    return [...new Set([...staticValues, ...spacingValues])];
  }
  
  return staticValues;
}

export function convertCSSToTailwind(rules: CSSRule[]): ConversionResult[] {
  return rules.map(rule => {
    const tailwindClasses: string[] = [];
    const unconvertible: Array<{ property: string; value: string; reason: string }> = [];

    rule.declarations.forEach(({ property, value }) => {
      const normalizedProperty = property.toLowerCase().trim();
      const valueVariations = normalizeValue(value);
      
      let tailwindClass: string | undefined;
      
      // First, try static map lookup
      for (const variation of valueVariations) {
        const mapKey = createMapKey(normalizedProperty, variation);
        tailwindClass = tailwindMap[mapKey];
        if (tailwindClass) break;
      }
      
      // If no static match, try dynamic pattern matching
      if (!tailwindClass) {
        tailwindClass = tryPatternMatch(property, value) || undefined;
      }
      
      // If still no match, try arbitrary value format
      if (!tailwindClass) {
        if (SPACING_PROPERTIES.includes(normalizedProperty)) {
          const propertyClassMap: Record<string, string> = {
            'top': 'top',
            'right': 'right',
            'bottom': 'bottom',
            'left': 'left',
            'width': 'w',
            'height': 'h'
          };
          
          const classPrefix = propertyClassMap[normalizedProperty];
          if (classPrefix) {
            tailwindClass = `${classPrefix}-[${value}]`;
          }
        } else if (GRID_PROPERTIES.includes(normalizedProperty)) {
          // Handle grid properties with arbitrary values
          const gridPropertyMap: Record<string, string> = {
            'grid-template-columns': 'grid-cols',
            'grid-template-rows': 'grid-rows',
            'grid-column': 'col',
            'grid-row': 'row'
          };
          
          const classPrefix = gridPropertyMap[normalizedProperty];
          if (classPrefix) {
            const cleanValue = value.trim().replace(/\s+/g, '_');
            tailwindClass = `${classPrefix}-[${cleanValue}]`;
          }
        }
      }
      
      if (tailwindClass) {
        tailwindClasses.push(tailwindClass);
      } else {
        // Failed to convert - provide helpful error message
        const availableValues = getAvailableValues(normalizedProperty);
        const availableProperties = getAvailableProperties();
        
        let reason: string;
        
        if (availableValues.length > 0) {
          const similarValues = findSimilarItems(value.toLowerCase().trim(), availableValues);
          
          if (similarValues.length > 0) {
            reason = `Value "${value}" not supported. Try: ${similarValues.join(', ')}`;
          } else {
            const exampleValues = availableValues.slice(0, 3);
            reason = `Value "${value}" not supported. Available values: ${exampleValues.join(', ')}${availableValues.length > 3 ? '...' : ''}`;
          }
        } else {
          const similarProperties = findSimilarItems(normalizedProperty, availableProperties);
          
          if (similarProperties.length > 0) {
            reason = `Property "${property}" not supported. Try: ${similarProperties.join(', ')}`;
          } else {
            reason = `Property "${property}" not supported by this converter`;
          }
        }
        
        unconvertible.push({
          property,
          value,
          reason
        });
      }
    });

    return {
      selector: rule.selector,
      tailwindClasses: [...new Set(tailwindClasses)],
      unconvertible
    };
  });
}

// Export utilities
export const converterUtils = {
  normalizeValue,
  createMapKey,
  findSimilarItems,
  getAvailableProperties,
  getAvailableValues,
  tryPatternMatch,
  SPACING_SCALE,
  SPACING_PROPERTIES,
  GRID_PROPERTIES,
  ASPECT_RATIO_PROPERTIES,
  ASPECT_RATIO_PATTERNS,
  GRID_PATTERNS,
  GRID_ROWS_PATTERNS,
  PATTERN_MATCHERS,
  analyzeGridTemplate,
  parseAspectRatio,
  aspectRatioToFraction
};