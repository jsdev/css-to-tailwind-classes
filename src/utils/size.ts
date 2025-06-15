// src/conversion/matchers/size.ts

// ========================================================================
// Shared size utility for width, height, and combined size properties
// ========================================================================
class SizeUtility {
    private sizePatterns = [
      /^\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/,
      /^\d+(\.\d+)?$/,
      /^(auto|max-content|min-content|fit-content|inherit|initial|unset|revert)$/i,
      /^calc\(.+\)$/,
      /^var\(.+\)$/,
      /^clamp\(.+\)$/,
      /^min\(.+\)$/,
      /^max\(.+\)$/
    ];
  
    // Common size mappings to Tailwind utilities
    private sizeMap: Record<string, string> = {
      // Auto and content sizing
      'auto': 'auto',
      'max-content': 'max',
      'min-content': 'min',
      'fit-content': 'fit',
      
      // Full sizes
      '100%': 'full',
      '100vh': 'screen', // for height
      '100vw': 'screen', // for width
      
      // Common fractional sizes
      '50%': '1/2',
      '33.333333%': '1/3',
      '66.666667%': '2/3',
      '25%': '1/4',
      '75%': '3/4',
      '20%': '1/5',
      '40%': '2/5',
      '60%': '3/5',
      '80%': '4/5',
      '16.666667%': '1/6',
      '83.333333%': '5/6',
      '8.333333%': '1/12',
      '41.666667%': '5/12',
      '58.333333%': '7/12',
      '91.666667%': '11/12',
      
      // Common pixel values to Tailwind spacing scale
      '0px': '0',
      '1px': 'px',
      '4px': '1',
      '8px': '2',
      '12px': '3',
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
      '384px': '96',
      
      // Common rem values
      '0rem': '0',
      '0.25rem': '1',
      '0.5rem': '2',
      '0.75rem': '3',
      '1rem': '4',
      '1.25rem': '5',
      '1.5rem': '6',
      '1.75rem': '7',
      '2rem': '8',
      '2.25rem': '9',
      '2.5rem': '10',
      '2.75rem': '11',
      '3rem': '12',
      '3.5rem': '14',
      '4rem': '16',
      '5rem': '20',
      '6rem': '24',
      '7rem': '28',
      '8rem': '32',
      '9rem': '36',
      '10rem': '40',
      '11rem': '44',
      '12rem': '48',
      '13rem': '52',
      '14rem': '56',
      '15rem': '60',
      '16rem': '64',
      '18rem': '72',
      '20rem': '80',
      '24rem': '96',
    };
  
    // Viewport-specific mappings
    private viewportMap: Record<string, { width: string; height: string }> = {
      '100vw': { width: 'screen', height: 'screen' },
      '100vh': { width: 'screen', height: 'screen' },
      '50vw': { width: '1/2', height: '1/2' },
      '50vh': { width: '1/2', height: '1/2' },
      '25vw': { width: '1/4', height: '1/4' },
      '25vh': { width: '1/4', height: '1/4' },
      '75vw': { width: '3/4', height: '3/4' },
      '75vh': { width: '3/4', height: '3/4' },
    };
  
    isValidSize(size: string): boolean {
      return this.sizePatterns.some(pattern => pattern.test(size));
    }
  
    convertSize(size: string, type: 'width' | 'height' | 'size'): string | null {
      const trimmedSize = size.trim().toLowerCase();
  
      // Handle special keywords
      if (['inherit', 'initial', 'unset', 'revert'].includes(trimmedSize)) {
        const prefix = type === 'width' ? 'w' : type === 'height' ? 'h' : 'size';
        return `${prefix}-[${size}]`;
      }
  
      // Handle viewport units with context awareness
      if (this.viewportMap[trimmedSize]) {
        const mapping = this.viewportMap[trimmedSize];
        const prefix = type === 'width' ? 'w' : type === 'height' ? 'h' : 'size';
        
        if (type === 'width') {
          return `w-${mapping.width}`;
        } else if (type === 'height') {
          return `h-${mapping.height}`;
        } else {
          // For size, use the appropriate mapping
          return `size-${mapping.width}`;
        }
      }
  
      // Handle common size mappings
      if (this.sizeMap[trimmedSize]) {
        const prefix = type === 'width' ? 'w' : type === 'height' ? 'h' : 'size';
        return `${prefix}-${this.sizeMap[trimmedSize]}`;
      }
  
      // Handle arbitrary values for complex expressions
      if (this.isValidSize(size)) {
        const prefix = type === 'width' ? 'w' : type === 'height' ? 'h' : 'size';
        return `${prefix}-[${size}]`;
      }
  
      return null;
    }
  
    // Normalize size values for comparison (convert similar formats to consistent format)
    normalizeSize(size: string): string {
      const trimmed = size.trim().toLowerCase();
      
      // Convert unitless numbers to px for comparison
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        return `${trimmed}px`;
      }
      
      return trimmed;
    }
  
    // Check if two size values are equivalent
    areSizesEqual(size1: string, size2: string): boolean {
      const normalized1 = this.normalizeSize(size1);
      const normalized2 = this.normalizeSize(size2);
      
      return normalized1 === normalized2;
    }
  }
  
  // ========================================================================
  // Individual size property matchers
  // ========================================================================
  class WidthPatternMatcher {
    private sizeUtility = new SizeUtility();
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
      
      if (prop === 'width') {
        const widthClass = this.sizeUtility.convertSize(value.trim(), 'width');
        if (widthClass) {
          classes.push(widthClass);
        }
      }
  
      return classes;
    }
  }
  
  class HeightPatternMatcher {
    private sizeUtility = new SizeUtility();
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
      
      if (prop === 'height') {
        const heightClass = this.sizeUtility.convertSize(value.trim(), 'height');
        if (heightClass) {
          classes.push(heightClass);
        }
      }
  
      return classes;
    }
  }
  
  // ========================================================================
  // Combined size pattern matcher with optimization
  // ========================================================================
  class CombinedSizePatternMatcher {
    private sizeUtility = new SizeUtility();
    private pendingWidth: { property: string; value: string } | null = null;
    private pendingHeight: { property: string; value: string } | null = null;
  
    // Process multiple properties and optimize when width/height are the same
    convertMultipleProperties(properties: Array<{ property: string; value: string }>): string[] {
      const classes: string[] = [];
      let width: string | null = null;
      let height: string | null = null;
      let widthValue: string | null = null;
      let heightValue: string | null = null;
  
      // First pass: collect width and height values
      for (const { property, value } of properties) {
        const prop = property.toLowerCase().trim();
        const val = value.trim();
  
        if (prop === 'width') {
          width = this.sizeUtility.convertSize(val, 'width');
          widthValue = val;
        } else if (prop === 'height') {
          height = this.sizeUtility.convertSize(val, 'height');
          heightValue = val;
        }
      }
  
      // Second pass: optimize if width and height are the same
      if (width && height && widthValue && heightValue) {
        // Check if the values are equivalent
        if (this.sizeUtility.areSizesEqual(widthValue, heightValue)) {
          // Use size-* utility instead of separate w-* and h-*
          const sizeClass = this.sizeUtility.convertSize(widthValue, 'size');
          if (sizeClass) {
            classes.push(sizeClass);
            return classes;
          }
        }
      }
  
      // If not optimizable, add individual classes
      if (width) classes.push(width);
      if (height) classes.push(height);
  
      return classes;
    }
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
      
      if (prop === 'width') {
        const widthClass = this.sizeUtility.convertSize(value.trim(), 'width');
        if (widthClass) {
          classes.push(widthClass);
        }
      } else if (prop === 'height') {
        const heightClass = this.sizeUtility.convertSize(value.trim(), 'height');
        if (heightClass) {
          classes.push(heightClass);
        }
      }
  
      return classes;
    }
  }
  
  // ========================================================================
  // Individual size property matchers (extended for min/max width/height)
  // ========================================================================
  class MinWidthPatternMatcher {
    private sizeUtility = new SizeUtility();
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      if (property.toLowerCase().trim() === 'min-width') {
        const minWClass = this.sizeUtility.convertSize(value.trim(), 'width');
        if (minWClass) {
          classes.push('min-' + minWClass);
        }
      }
      return classes;
    }
  }
  
  class MinHeightPatternMatcher {
    private sizeUtility = new SizeUtility();
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      if (property.toLowerCase().trim() === 'min-height') {
        const minHClass = this.sizeUtility.convertSize(value.trim(), 'height');
        if (minHClass) {
          classes.push('min-' + minHClass);
        }
      }
      return classes;
    }
  }
  
  class MaxWidthPatternMatcher {
    private sizeUtility = new SizeUtility();
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      if (property.toLowerCase().trim() === 'max-width') {
        const maxWClass = this.sizeUtility.convertSize(value.trim(), 'width');
        if (maxWClass) {
          classes.push('max-' + maxWClass);
        }
      }
      return classes;
    }
  }
  
  class MaxHeightPatternMatcher {
    private sizeUtility = new SizeUtility();
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      if (property.toLowerCase().trim() === 'max-height') {
        const maxHClass = this.sizeUtility.convertSize(value.trim(), 'height');
        if (maxHClass) {
          classes.push('max-' + maxHClass);
        }
      }
      return classes;
    }
  }
  
  // ========================================================================
  // Export pattern matchers
  // ========================================================================
  
  const widthConverter = new WidthPatternMatcher();
  const heightConverter = new HeightPatternMatcher();
  const combinedSizeConverter = new CombinedSizePatternMatcher();
  
  export const widthPatternMatcher = {
    test: (property: string): boolean => {
      const prop = property.toLowerCase().trim();
      return prop === 'width';
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = widthConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
  };
  
  export const heightPatternMatcher = {
    test: (property: string): boolean => {
      const prop = property.toLowerCase().trim();
      return prop === 'height';
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = heightConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
  };
  
  // Combined matcher that can optimize width/height pairs
  export const sizePatternMatcher = {
    test: (property: string): boolean => {
      const prop = property.toLowerCase().trim();
      return prop === 'width' || prop === 'height';
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = combinedSizeConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
    // Special method for optimizing multiple properties at once
    convertMultiple: (properties: Array<{ property: string; value: string }>): string[] => {
      return combinedSizeConverter.convertMultipleProperties(properties);
    },
  };
  
  export const minWidthPatternMatcher = {
    test: (property: string): boolean => property.toLowerCase().trim() === 'min-width',
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = new MinWidthPatternMatcher().convertToTailwind(property, value);
      return tailwindClasses.length > 0 ? tailwindClasses.join(' ') : null;
    },
  };
  
  export const minHeightPatternMatcher = {
    test: (property: string): boolean => property.toLowerCase().trim() === 'min-height',
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = new MinHeightPatternMatcher().convertToTailwind(property, value);
      return tailwindClasses.length > 0 ? tailwindClasses.join(' ') : null;
    },
  };
  
  export const maxWidthPatternMatcher = {
    test: (property: string): boolean => property.toLowerCase().trim() === 'max-width',
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = new MaxWidthPatternMatcher().convertToTailwind(property, value);
      return tailwindClasses.length > 0 ? tailwindClasses.join(' ') : null;
    },
  };
  
  export const maxHeightPatternMatcher = {
    test: (property: string): boolean => property.toLowerCase().trim() === 'max-height',
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = new MaxHeightPatternMatcher().convertToTailwind(property, value);
      return tailwindClasses.length > 0 ? tailwindClasses.join(' ') : null;
    },
  };
  
  // Utility class export for advanced usage
  export { SizeUtility };