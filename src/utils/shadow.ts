// src/conversion/matchers/shadow.ts

interface ShadowComponents {
    inset?: boolean;
    offsetX: string;
    offsetY: string;
    blurRadius?: string;
    spreadRadius?: string;
    color?: string;
  }
  
  interface ParsedShadow {
    shadows: ShadowComponents[];
  }
  
  // ========================================================================
  // The COMPLETE class implementation must be here
  // ========================================================================
  class ShadowPatternMatcher {
    private colorPatterns = [
      /#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})/,
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/,
      /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/,
      /^(transparent|currentColor|inherit|initial|unset|revert|black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|indigo|violet|coral|salmon|khaki|plum|orchid|tan|beige|azure|ivory|lavender|crimson|fuchsia|aqua)$/i
    ];
  
    // Tailwind's built-in shadow definitions for matching
    private tailwindShadows = [
      {
        name: 'shadow-sm',
        definition: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        components: { offsetX: '0', offsetY: '1px', blurRadius: '2px', spreadRadius: '0', color: 'rgba(0, 0, 0, 0.05)' }
      },
      {
        name: 'shadow',
        definition: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        components: { offsetX: '0', offsetY: '1px', blurRadius: '3px', spreadRadius: '0', color: 'rgba(0, 0, 0, 0.1)' }
      },
      {
        name: 'shadow-md',
        definition: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        components: { offsetX: '0', offsetY: '4px', blurRadius: '6px', spreadRadius: '-1px', color: 'rgba(0, 0, 0, 0.1)' }
      },
      {
        name: 'shadow-lg',
        definition: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        components: { offsetX: '0', offsetY: '10px', blurRadius: '15px', spreadRadius: '-3px', color: 'rgba(0, 0, 0, 0.1)' }
      },
      {
        name: 'shadow-xl',
        definition: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        components: { offsetX: '0', offsetY: '20px', blurRadius: '25px', spreadRadius: '-5px', color: 'rgba(0, 0, 0, 0.1)' }
      },
      {
        name: 'shadow-2xl',
        definition: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        components: { offsetX: '0', offsetY: '25px', blurRadius: '50px', spreadRadius: '-12px', color: 'rgba(0, 0, 0, 0.25)' }
      },
      {
        name: 'shadow-inner',
        definition: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        components: { inset: true, offsetX: '0', offsetY: '2px', blurRadius: '4px', spreadRadius: '0', color: 'rgba(0, 0, 0, 0.05)' }
      }
    ];
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
      
      if (prop === 'box-shadow') {
        if (value.toLowerCase().trim() === 'none') {
          classes.push('shadow-none');
          return classes;
        }
  
        // Try to match against built-in Tailwind shadows first
        const matchedShadow = this.matchTailwindShadow(value);
        if (matchedShadow) {
          classes.push(matchedShadow);
          return classes;
        }
  
        // Parse and convert custom shadows
        const parsed = this.parseBoxShadow(value);
        if (parsed.shadows.length === 1) {
          const shadow = parsed.shadows[0];
          
          // Try to find the closest Tailwind shadow
          const closestMatch = this.findClosestTailwindShadow(shadow);
          if (closestMatch) {
            classes.push(closestMatch);
            return classes;
          }
        }
  
        // Fall back to arbitrary value with optimized format
        const optimizedShadow = this.optimizeShadowValue(value);
        classes.push(`shadow-[${optimizedShadow}]`);
      }
      else if (prop === 'text-shadow') {
        // Handle text-shadow (not built into Tailwind by default)
        const optimizedShadow = this.optimizeShadowValue(value);
        classes.push(`[text-shadow:${optimizedShadow}]`);
      }
  
      return classes;
    }
  
    private parseBoxShadow(value: string): ParsedShadow {
      const shadows: ShadowComponents[] = [];
      
      // Split multiple shadows by comma (but not commas inside functions)
      const shadowStrings = this.splitShadows(value);
      
      for (const shadowStr of shadowStrings) {
        const shadow = this.parseSingleShadow(shadowStr.trim());
        if (shadow) {
          shadows.push(shadow);
        }
      }
  
      return { shadows };
    }
  
    private splitShadows(value: string): string[] {
      const shadows: string[] = [];
      let current = '';
      let depth = 0;
      let inQuotes = false;
      let quoteChar = '';
  
      for (let i = 0; i < value.length; i++) {
        const char = value[i];
        
        if ((char === '"' || char === "'") && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
        } else if (char === '(' && !inQuotes) {
          depth++;
        } else if (char === ')' && !inQuotes) {
          depth--;
        } else if (char === ',' && depth === 0 && !inQuotes) {
          shadows.push(current.trim());
          current = '';
          continue;
        }
        
        current += char;
      }
      
      if (current.trim()) {
        shadows.push(current.trim());
      }
      
      return shadows;
    }
  
    private parseSingleShadow(shadowStr: string): ShadowComponents | null {
      const tokens = this.tokenizeShadow(shadowStr);
      if (tokens.length < 2) return null;
  
      const shadow: ShadowComponents = {
        offsetX: '0',
        offsetY: '0'
      };
  
      let tokenIndex = 0;
  
      // Check for inset
      if (tokens[tokenIndex]?.toLowerCase() === 'inset') {
        shadow.inset = true;
        tokenIndex++;
      }
  
      // Parse numeric values (offset-x, offset-y, blur-radius, spread-radius)
      const numericTokens: string[] = [];
      while (tokenIndex < tokens.length && this.isLengthValue(tokens[tokenIndex])) {
        numericTokens.push(tokens[tokenIndex]);
        tokenIndex++;
      }
  
      // Assign numeric values
      if (numericTokens.length >= 2) {
        shadow.offsetX = numericTokens[0];
        shadow.offsetY = numericTokens[1];
        
        if (numericTokens.length >= 3) {
          shadow.blurRadius = numericTokens[2];
        }
        
        if (numericTokens.length >= 4) {
          shadow.spreadRadius = numericTokens[3];
        }
      }
  
      // Parse color (remaining tokens)
      const colorTokens = tokens.slice(tokenIndex);
      if (colorTokens.length > 0) {
        shadow.color = colorTokens.join(' ');
      }
  
      return shadow;
    }
  
    private tokenizeShadow(value: string): string[] {
      const tokens: string[] = [];
      let current = '';
      let inParens = 0;
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
        } else if (char === '(' && !inQuotes) {
          inParens++;
          current += char;
        } else if (char === ')' && !inQuotes) {
          inParens--;
          current += char;
        } else if (char === ' ' && inParens === 0 && !inQuotes) {
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
  
    private isLengthValue(token: string): boolean {
      return /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|cm|mm|in|pt|pc|ex|ch|vmin|vmax)?$/.test(token);
    }
  
    private isColor(token: string): boolean {
      return this.colorPatterns.some(pattern => pattern.test(token));
    }
  
    private matchTailwindShadow(value: string): string | null {
      const normalizedValue = this.normalizeShadowValue(value);
      
      for (const shadow of this.tailwindShadows) {
        const normalizedTailwind = this.normalizeShadowValue(shadow.definition);
        if (normalizedValue === normalizedTailwind) {
          return shadow.name;
        }
      }
  
      return null;
    }
  
    private findClosestTailwindShadow(shadow: ShadowComponents): string | null {
      // Handle inset shadows
      if (shadow.inset) {
        return 'shadow-inner';
      }
  
      // Simple heuristic matching based on blur radius and offset
      const offsetY = this.parsePixelValue(shadow.offsetY);
      const blurRadius = shadow.blurRadius ? this.parsePixelValue(shadow.blurRadius) : 0;
      
      // Match based on primary characteristics
      if (offsetY <= 1 && blurRadius <= 3) {
        return 'shadow-sm';
      } else if (offsetY <= 2 && blurRadius <= 4) {
        return 'shadow';
      } else if (offsetY <= 6 && blurRadius <= 8) {
        return 'shadow-md';
      } else if (offsetY <= 12 && blurRadius <= 20) {
        return 'shadow-lg';
      } else if (offsetY <= 25 && blurRadius <= 35) {
        return 'shadow-xl';
      } else if (offsetY > 25 || blurRadius > 35) {
        return 'shadow-2xl';
      }
  
      return null;
    }
  
    private parsePixelValue(value: string): number {
      const match = value.match(/^(-?\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    }
  
    private normalizeShadowValue(value: string): string {
      return value
        .replace(/\s+/g, ' ')
        .replace(/rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\s*\)/g, 'rgba($1, $2, $3, $4)')
        .replace(/\s*,\s*/g, ', ')
        .trim()
        .toLowerCase();
    }
  
    private optimizeShadowValue(value: string): string {
      // Clean up the shadow value for arbitrary usage
      return value
        .replace(/\s+/g, '_')
        .replace(/,/g, ',_');
    }
  }
  
  // ========================================================================
  // The Adapter Logic
  // ========================================================================
  
  const shadowConverter = new ShadowPatternMatcher();
  
  export const shadowPatternMatcher = {
    test: (property: string): boolean => {
      const prop = property.toLowerCase().trim();
      return prop === 'box-shadow' || prop === 'text-shadow';
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = shadowConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
  };