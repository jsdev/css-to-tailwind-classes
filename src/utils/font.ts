// src/conversion/matchers/font.ts

interface FontComponents {
    family?: string;
    size?: string;
    weight?: string;
    style?: string;
    variant?: string;
    stretch?: string;
    lineHeight?: string;
    letterSpacing?: string;
    wordSpacing?: string;
  }
  
  // ========================================================================
  // The COMPLETE class implementation must be here
  // ========================================================================
  class FontPatternMatcher {
    private fontFamilyGeneric = [
      'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'
    ];
  
    private fontStyleKeywords = [
      'normal', 'italic', 'oblique'
    ];
  
    private fontVariantKeywords = [
      'normal', 'small-caps', 'all-small-caps', 'petite-caps', 'all-petite-caps',
      'unicase', 'titling-caps'
    ];
  
    private fontStretchKeywords = [
      'normal', 'ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed',
      'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'
    ];
  
    private fontWeightKeywords = [
      'normal', 'bold', 'bolder', 'lighter',
      '100', '200', '300', '400', '500', '600', '700', '800', '900'
    ];
  
    parseFontShorthand(value: string): FontComponents {
      const components: FontComponents = {};
      const tokens = this.tokenizeFont(value);
      
      // Font shorthand parsing is complex due to order requirements
      // Format: [font-style] [font-variant] [font-weight] [font-size]/[line-height] [font-family]
      
      let familyStartIndex = -1;
      let sizeIndex = -1;
      
      // Find font-size (required) - look for size values or size/line-height
      for (let i = 0; i < tokens.length; i++) {
        if (this.isFontSize(tokens[i]) || tokens[i].includes('/')) {
          sizeIndex = i;
          break;
        }
      }
      
      if (sizeIndex === -1) {
        // No valid font-size found, try to parse individual components
        return this.parseIndividualComponents(tokens);
      }
      
      // Parse size and line-height
      const sizeToken = tokens[sizeIndex];
      if (sizeToken.includes('/')) {
        const [size, lineHeight] = sizeToken.split('/');
        components.size = size.trim();
        components.lineHeight = lineHeight.trim();
      } else {
        components.size = sizeToken;
      }
      
      // Font family comes after size
      familyStartIndex = sizeIndex + 1;
      if (familyStartIndex < tokens.length) {
        components.family = tokens.slice(familyStartIndex).join(' ');
      }
      
      // Parse style, variant, weight before size
      for (let i = 0; i < sizeIndex; i++) {
        const token = tokens[i];
        if (this.isFontStyle(token)) {
          components.style = token;
        } else if (this.isFontVariant(token)) {
          components.variant = token;
        } else if (this.isFontWeight(token)) {
          components.weight = token;
        }
      }
      
      return components;
    }
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
  
      switch (prop) {
        case 'font-family':
          const familyClass = this.convertFontFamily(value);
          if (familyClass) classes.push(familyClass);
          break;
  
        case 'font-size':
          const sizeClass = this.convertFontSize(value);
          if (sizeClass) classes.push(sizeClass);
          break;
  
        case 'font-weight':
          const weightClass = this.convertFontWeight(value);
          if (weightClass) classes.push(weightClass);
          break;
  
        case 'font-style':
          const styleClass = this.convertFontStyle(value);
          if (styleClass) classes.push(styleClass);
          break;
  
        case 'font-variant':
          const variantClass = this.convertFontVariant(value);
          if (variantClass) classes.push(variantClass);
          break;
  
        case 'font-stretch':
          const stretchClass = this.convertFontStretch(value);
          if (stretchClass) classes.push(stretchClass);
          break;
  
        case 'line-height':
          const lineHeightClass = this.convertLineHeight(value);
          if (lineHeightClass) classes.push(lineHeightClass);
          break;
  
        case 'letter-spacing':
          const letterSpacingClass = this.convertLetterSpacing(value);
          if (letterSpacingClass) classes.push(letterSpacingClass);
          break;
  
        case 'word-spacing':
          const wordSpacingClass = this.convertWordSpacing(value);
          if (wordSpacingClass) classes.push(wordSpacingClass);
          break;
  
        case 'font':
          const components = this.parseFontShorthand(value);
          
          if (components.family) {
            const familyClass = this.convertFontFamily(components.family);
            if (familyClass) classes.push(familyClass);
          }
          if (components.size) {
            const sizeClass = this.convertFontSize(components.size);
            if (sizeClass) classes.push(sizeClass);
          }
          if (components.weight) {
            const weightClass = this.convertFontWeight(components.weight);
            if (weightClass) classes.push(weightClass);
          }
          if (components.style) {
            const styleClass = this.convertFontStyle(components.style);
            if (styleClass) classes.push(styleClass);
          }
          if (components.variant) {
            const variantClass = this.convertFontVariant(components.variant);
            if (variantClass) classes.push(variantClass);
          }
          if (components.lineHeight) {
            const lineHeightClass = this.convertLineHeight(components.lineHeight);
            if (lineHeightClass) classes.push(lineHeightClass);
          }
          break;
      }
  
      return classes;
    }
  
    private tokenizeFont(value: string): string[] {
      const tokens: string[] = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';
  
      for (let i = 0; i < value.length; i++) {
        const char = value[i];
        
        if ((char === '"' || char === "'") && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
          current += char;
        } else if (char === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
          current += char;
        } else if (char === ' ' && !inQuotes) {
          if (current.trim()) {
            tokens.push(current.trim());
            current = '';
          }
        } else if (char === ',' && !inQuotes) {
          if (current.trim()) {
            tokens.push(current.trim());
            current = '';
          }
        } else {
          current += char;
        }
      }
      
      if (current.trim()) {
        tokens.push(current.trim());
      }
      
      return tokens;
    }
  
    private parseIndividualComponents(tokens: string[]): FontComponents {
      const components: FontComponents = {};
      
      for (const token of tokens) {
        if (this.isFontStyle(token)) {
          components.style = token;
        } else if (this.isFontVariant(token)) {
          components.variant = token;
        } else if (this.isFontWeight(token)) {
          components.weight = token;
        } else if (this.isFontSize(token)) {
          components.size = token;
        } else {
          // Assume remaining tokens are font family
          if (!components.family) {
            components.family = token;
          } else {
            components.family += ' ' + token;
          }
        }
      }
      
      return components;
    }
  
    private isFontSize(token: string): boolean {
      // Check for size keywords
      const sizeKeywords = [
        'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large',
        'xxx-large', 'smaller', 'larger'
      ];
      
      if (sizeKeywords.includes(token.toLowerCase())) return true;
      
      // Check for size values
      return /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|cm|mm|in|pt|pc|ex|ch|vmin|vmax)$/.test(token);
    }
  
    private isFontStyle(token: string): boolean {
      return this.fontStyleKeywords.includes(token.toLowerCase());
    }
  
    private isFontVariant(token: string): boolean {
      return this.fontVariantKeywords.includes(token.toLowerCase());
    }
  
    private isFontWeight(token: string): boolean {
      return this.fontWeightKeywords.includes(token.toLowerCase());
    }
  
    private convertFontFamily(family: string): string | null {
      // Remove quotes and normalize
      const cleanFamily = family.replace(/['"]/g, '').toLowerCase().trim();
      
      const familyMap: Record<string, string> = {
        // Generic families
        'serif': 'font-serif',
        'sans-serif': 'font-sans',
        'monospace': 'font-mono',
        
        // Common font stacks
        'arial': 'font-sans',
        'helvetica': 'font-sans',
        'times': 'font-serif',
        'times new roman': 'font-serif',
        'courier': 'font-mono',
        'courier new': 'font-mono',
        'georgia': 'font-serif',
        'verdana': 'font-sans',
        'trebuchet ms': 'font-sans',
        'comic sans ms': 'font-sans',
        'impact': 'font-sans',
        'lucida console': 'font-mono',
        'tahoma': 'font-sans',
        'palatino': 'font-serif',
        'garamond': 'font-serif',
        'bookman': 'font-serif',
        'avant garde': 'font-sans',
        'helvetica neue': 'font-sans',
        'system-ui': 'font-sans',
      };
  
      // Check for direct mapping
      if (familyMap[cleanFamily]) {
        return familyMap[cleanFamily];
      }
  
      // Check if it contains a known generic family
      for (const [key, value] of Object.entries(familyMap)) {
        if (cleanFamily.includes(key)) {
          return value;
        }
      }
  
      // Use arbitrary value for custom fonts
      return `font-[${family.replace(/['"]/g, '')}]`;
    }
  
    private convertFontSize(size: string): string | null {
      const sizeMap: Record<string, string> = {
        // Absolute size keywords
        'xx-small': 'text-xs',
        'x-small': 'text-xs',
        'small': 'text-sm',
        'medium': 'text-base',
        'large': 'text-lg',
        'x-large': 'text-xl',
        'xx-large': 'text-2xl',
        'xxx-large': 'text-3xl',
        
        // Common pixel sizes
        '10px': 'text-xs',
        '12px': 'text-xs',
        '14px': 'text-sm',
        '16px': 'text-base',
        '18px': 'text-lg',
        '20px': 'text-xl',
        '24px': 'text-2xl',
        '30px': 'text-3xl',
        '36px': 'text-4xl',
        '48px': 'text-5xl',
        '60px': 'text-6xl',
        '72px': 'text-7xl',
        '96px': 'text-8xl',
        '128px': 'text-9xl',
        
        // Common rem sizes
        '0.75rem': 'text-xs',
        '0.875rem': 'text-sm',
        '1rem': 'text-base',
        '1.125rem': 'text-lg',
        '1.25rem': 'text-xl',
        '1.5rem': 'text-2xl',
        '1.875rem': 'text-3xl',
        '2.25rem': 'text-4xl',
        '3rem': 'text-5xl',
        '3.75rem': 'text-6xl',
        '4.5rem': 'text-7xl',
        '6rem': 'text-8xl',
        '8rem': 'text-9xl'
      };
  
      const lowerSize = size.toLowerCase();
      if (sizeMap[lowerSize]) {
        return sizeMap[lowerSize];
      }
  
      return `text-[${size}]`;
    }
  
    private convertFontWeight(weight: string): string | null {
      const weightMap: Record<string, string> = {
        'normal': 'font-normal',
        'bold': 'font-bold',
        'bolder': 'font-bold', // Approximation
        'lighter': 'font-light', // Approximation
        '100': 'font-thin',
        '200': 'font-extralight',
        '300': 'font-light',
        '400': 'font-normal',
        '500': 'font-medium',
        '600': 'font-semibold',
        '700': 'font-bold',
        '800': 'font-extrabold',
        '900': 'font-black'
      };
  
      return weightMap[weight.toLowerCase()] || `font-[${weight}]`;
    }
  
    private convertFontStyle(style: string): string | null {
      const styleMap: Record<string, string> = {
        'normal': 'not-italic',
        'italic': 'italic',
        'oblique': 'italic' // Closest approximation
      };
  
      return styleMap[style.toLowerCase()] || null;
    }
  
    private convertFontVariant(variant: string): string | null {
      // Tailwind has limited font-variant support
      const variantMap: Record<string, string> = {
        'normal': 'normal-nums',
        'small-caps': 'font-variant-small-caps', // Would need plugin
      };
  
      // Most font-variant values need arbitrary values or plugins
      if (variantMap[variant.toLowerCase()]) {
        return variantMap[variant.toLowerCase()];
      }
  
      return `[font-variant:${variant}]`;
    }
  
    private convertFontStretch(stretch: string): string | null {
      // Tailwind doesn't have built-in font-stretch utilities
      return `[font-stretch:${stretch}]`;
    }
  
    private convertLineHeight(lineHeight: string): string | null {
      const lineHeightMap: Record<string, string> = {
        'normal': 'leading-normal',
        '1': 'leading-none',
        '1.25': 'leading-tight',
        '1.375': 'leading-snug',
        '1.5': 'leading-normal',
        '1.625': 'leading-relaxed',
        '2': 'leading-loose',
        
        // Pixel values
        '12px': 'leading-3',
        '16px': 'leading-4',
        '20px': 'leading-5',
        '24px': 'leading-6',
        '28px': 'leading-7',
        '32px': 'leading-8',
        '36px': 'leading-9',
        '40px': 'leading-10',
        
        // Rem values
        '0.75rem': 'leading-3',
        '1rem': 'leading-4',
        '1.25rem': 'leading-5',
        '1.5rem': 'leading-6',
        '1.75rem': 'leading-7',
        '2rem': 'leading-8',
        '2.25rem': 'leading-9',
        '2.5rem': 'leading-10'
      };
  
      if (lineHeightMap[lineHeight.toLowerCase()]) {
        return lineHeightMap[lineHeight.toLowerCase()];
      }
  
      return `leading-[${lineHeight}]`;
    }
  
    private convertLetterSpacing(spacing: string): string | null {
      const spacingMap: Record<string, string> = {
        'normal': 'tracking-normal',
        '-0.05em': 'tracking-tighter',
        '-0.025em': 'tracking-tight',
        '0': 'tracking-normal',
        '0.025em': 'tracking-wide',
        '0.05em': 'tracking-wider',
        '0.1em': 'tracking-widest',
        
        // Pixel values
        '-0.8px': 'tracking-tighter',
        '-0.4px': 'tracking-tight',
        '0px': 'tracking-normal',
        '0.4px': 'tracking-wide',
        '0.8px': 'tracking-wider',
        '1.6px': 'tracking-widest'
      };
  
      if (spacingMap[spacing.toLowerCase()]) {
        return spacingMap[spacing.toLowerCase()];
      }
  
      return `tracking-[${spacing}]`;
    }
  
    private convertWordSpacing(spacing: string): string | null {
      // Tailwind doesn't have built-in word-spacing utilities
      return `[word-spacing:${spacing}]`;
    }
  }
  
  // ========================================================================
  // The Adapter Logic
  // ========================================================================
  
  const fontConverter = new FontPatternMatcher();
  
  export const fontPatternMatcher = {
    test: (property: string): boolean => {
      const prop = property.toLowerCase().trim();
      return prop === 'font' || 
             prop.startsWith('font-') || 
             prop === 'line-height' ||
             prop === 'letter-spacing' ||
             prop === 'word-spacing';
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = fontConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
  };
  