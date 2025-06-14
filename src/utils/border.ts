// src/conversion/matchers/border.ts

interface BorderComponents {
    width?: string;
    style?: string;
    color?: string;
  }
  
  interface BorderRadiusComponents {
    topLeft?: string;
    topRight?: string;
    bottomRight?: string;
    bottomLeft?: string;
  }
  
  // ========================================================================
  // The COMPLETE class implementation must be here
  // ========================================================================
  class BorderPatternMatcher {
    private colorPatterns = [
      /#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})/,
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/,
      /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/,
      /^(transparent|currentColor|inherit|initial|unset|revert|black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|indigo|violet|coral|salmon|khaki|plum|orchid|tan|beige|azure|ivory|lavender|crimson|fuchsia|aqua)$/i
    ];
  
    private borderStyleKeywords = [
      'none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 
      'groove', 'ridge', 'inset', 'outset'
    ];
  
    private outlineStyleKeywords = [
      'none', 'auto', 'dotted', 'dashed', 'solid', 'double', 
      'groove', 'ridge', 'inset', 'outset'
    ];
  
    private borderWidthKeywords = ['thin', 'medium', 'thick'];
  
    private borderSides = ['top', 'right', 'bottom', 'left'];
  
    parseBorderShorthand(value: string): BorderComponents {
      const components: BorderComponents = {};
      const tokens = this.tokenizeBorder(value);
      
      for (const token of tokens) {
        if (this.isBorderWidth(token)) {
          components.width = token;
        } else if (this.isBorderStyle(token)) {
          components.style = token;
        } else if (this.isColor(token)) {
          components.color = token;
        }
      }
  
      return components;
    }
  
    parseBorderRadius(value: string): BorderRadiusComponents {
      const values = value.trim().split(/\s+/);
      const components: BorderRadiusComponents = {};
  
      // CSS border-radius follows: top-left, top-right, bottom-right, bottom-left
      // With 1 value: all corners
      // With 2 values: top-left/bottom-right, top-right/bottom-left
      // With 3 values: top-left, top-right/bottom-left, bottom-right
      // With 4 values: top-left, top-right, bottom-right, bottom-left
  
      switch (values.length) {
        case 1:
          components.topLeft = components.topRight = components.bottomRight = components.bottomLeft = values[0];
          break;
        case 2:
          components.topLeft = components.bottomRight = values[0];
          components.topRight = components.bottomLeft = values[1];
          break;
        case 3:
          components.topLeft = values[0];
          components.topRight = components.bottomLeft = values[1];
          components.bottomRight = values[2];
          break;
        case 4:
          components.topLeft = values[0];
          components.topRight = values[1];
          components.bottomRight = values[2];
          components.bottomLeft = values[3];
          break;
      }
  
      return components;
    }
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
  
      // Border shorthand
      if (prop === 'border') {
        const components = this.parseBorderShorthand(value);
        
        if (components.width) {
          const widthClass = this.convertBorderWidth(components.width);
          if (widthClass) classes.push(widthClass);
        }
        if (components.style) {
          const styleClass = this.convertBorderStyle(components.style);
          if (styleClass) classes.push(styleClass);
        }
        if (components.color) {
          const colorClass = this.convertBorderColor(components.color);
          if (colorClass) classes.push(colorClass);
        }
      }
      
      // Individual border properties
      else if (prop === 'border-width') {
        const widthClass = this.convertBorderWidth(value);
        if (widthClass) classes.push(widthClass);
      }
      else if (prop === 'border-style') {
        const styleClass = this.convertBorderStyle(value);
        if (styleClass) classes.push(styleClass);
      }
      else if (prop === 'border-color') {
        const colorClass = this.convertBorderColor(value);
        if (colorClass) classes.push(colorClass);
      }
  
      // Directional borders
      else if (this.isDirectionalBorder(prop)) {
        const direction = this.extractBorderDirection(prop);
        const subProperty = this.extractBorderSubProperty(prop);
        
        if (subProperty === 'width') {
          const widthClass = this.convertDirectionalBorderWidth(direction, value);
          if (widthClass) classes.push(widthClass);
        } else if (subProperty === 'style') {
          const styleClass = this.convertDirectionalBorderStyle(direction, value);
          if (styleClass) classes.push(styleClass);
        } else if (subProperty === 'color') {
          const colorClass = this.convertDirectionalBorderColor(direction, value);
          if (colorClass) classes.push(colorClass);
        } else {
          // Shorthand like border-top
          const components = this.parseBorderShorthand(value);
          if (components.width) {
            const widthClass = this.convertDirectionalBorderWidth(direction, components.width);
            if (widthClass) classes.push(widthClass);
          }
          if (components.style) {
            const styleClass = this.convertDirectionalBorderStyle(direction, components.style);
            if (styleClass) classes.push(styleClass);
          }
          if (components.color) {
            const colorClass = this.convertDirectionalBorderColor(direction, components.color);
            if (colorClass) classes.push(colorClass);
          }
        }
      }
  
      // Border radius
      else if (prop === 'border-radius') {
        const radiusClass = this.convertBorderRadius(value);
        if (radiusClass) classes.push(radiusClass);
      }
      else if (this.isCornerRadius(prop)) {
        const corner = this.extractCorner(prop);
        const radiusClass = this.convertCornerRadius(corner, value);
        if (radiusClass) classes.push(radiusClass);
      }
  
      // Outline properties
      else if (prop === 'outline') {
        const components = this.parseOutlineShorthand(value);
        if (components.width) {
          const widthClass = this.convertOutlineWidth(components.width);
          if (widthClass) classes.push(widthClass);
        }
        if (components.style) {
          const styleClass = this.convertOutlineStyle(components.style);
          if (styleClass) classes.push(styleClass);
        }
        if (components.color) {
          const colorClass = this.convertOutlineColor(components.color);
          if (colorClass) classes.push(colorClass);
        }
      }
      else if (prop === 'outline-width') {
        const widthClass = this.convertOutlineWidth(value);
        if (widthClass) classes.push(widthClass);
      }
      else if (prop === 'outline-style') {
        const styleClass = this.convertOutlineStyle(value);
        if (styleClass) classes.push(styleClass);
      }
      else if (prop === 'outline-color') {
        const colorClass = this.convertOutlineColor(value);
        if (colorClass) classes.push(colorClass);
      }
      else if (prop === 'outline-offset') {
        const offsetClass = this.convertOutlineOffset(value);
        if (offsetClass) classes.push(offsetClass);
      }
  
      return classes;
    }
  
    private tokenizeBorder(value: string): string[] {
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
  
    private isBorderWidth(token: string): boolean {
      if (this.borderWidthKeywords.includes(token.toLowerCase())) return true;
      return /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|cm|mm|in|pt|pc|ex|ch|vmin|vmax)$/.test(token);
    }
  
    private isBorderStyle(token: string): boolean {
      return this.borderStyleKeywords.includes(token.toLowerCase());
    }
  
    private isColor(token: string): boolean {
      return this.colorPatterns.some(pattern => pattern.test(token));
    }
  
    private isDirectionalBorder(prop: string): boolean {
      return this.borderSides.some(side => prop.includes(`border-${side}`));
    }
  
    private extractBorderDirection(prop: string): string {
      for (const side of this.borderSides) {
        if (prop.includes(`border-${side}`)) {
          return side;
        }
      }
      return '';
    }
  
    private extractBorderSubProperty(prop: string): string {
      if (prop.includes('-width')) return 'width';
      if (prop.includes('-style')) return 'style';
      if (prop.includes('-color')) return 'color';
      return 'shorthand';
    }
  
    private isCornerRadius(prop: string): boolean {
      return prop.includes('border-') && prop.includes('-radius');
    }
  
    private extractCorner(prop: string): string {
      if (prop.includes('top-left')) return 'tl';
      if (prop.includes('top-right')) return 'tr';
      if (prop.includes('bottom-right')) return 'br';
      if (prop.includes('bottom-left')) return 'bl';
      return '';
    }
  
    private convertBorderWidth(width: string): string | null {
      const widthMap: Record<string, string> = {
        '0': 'border-0',
        '0px': 'border-0',
        'thin': 'border',
        'medium': 'border-2',
        'thick': 'border-4',
        '1px': 'border',
        '2px': 'border-2',
        '4px': 'border-4',
        '8px': 'border-8'
      };
  
      if (widthMap[width.toLowerCase()]) {
        return widthMap[width.toLowerCase()];
      }
  
      return `border-[${width}]`;
    }
  
    private convertBorderStyle(style: string): string | null {
      const styleMap: Record<string, string> = {
        'none': 'border-none',
        'solid': 'border-solid',
        'dashed': 'border-dashed',
        'dotted': 'border-dotted',
        'double': 'border-double',
        'hidden': 'border-none'
      };
  
      if (styleMap[style.toLowerCase()]) {
        return styleMap[style.toLowerCase()];
      }
  
      return `border-[${style}]`;
    }
  
    private convertBorderColor(color: string): string | null {
      const colorMap: Record<string, string> = {
        'transparent': 'border-transparent',
        'currentColor': 'border-current',
        'black': 'border-black',
        'white': 'border-white',
        '#000': 'border-black',
        '#000000': 'border-black',
        '#fff': 'border-white',
        '#ffffff': 'border-white',
        'red': 'border-red-500',
        'green': 'border-green-500',
        'blue': 'border-blue-500',
        'yellow': 'border-yellow-500',
        'orange': 'border-orange-500',
        'purple': 'border-purple-500',
        'pink': 'border-pink-500',
        'gray': 'border-gray-500',
        'grey': 'border-gray-500'
      };
  
      const lowerColor = color.toLowerCase();
      if (colorMap[lowerColor]) {
        return colorMap[lowerColor];
      }
  
      if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
        return `border-[${color}]`;
      }
  
      return null;
    }
  
    private convertDirectionalBorderWidth(direction: string, width: string): string | null {
      const directionMap: Record<string, string> = {
        'top': 't',
        'right': 'r',
        'bottom': 'b',
        'left': 'l'
      };
  
      const widthMap: Record<string, string> = {
        '0': '0',
        '0px': '0',
        'thin': '',
        'medium': '2',
        'thick': '4',
        '1px': '',
        '2px': '2',
        '4px': '4',
        '8px': '8'
      };
  
      const dir = directionMap[direction];
      const widthSuffix = widthMap[width.toLowerCase()];
  
      if (dir && widthSuffix !== undefined) {
        return widthSuffix ? `border-${dir}-${widthSuffix}` : `border-${dir}`;
      }
  
      return `border-${dir}-[${width}]`;
    }
  
    private convertDirectionalBorderStyle(direction: string, style: string): string | null {
      // Tailwind doesn't have directional border styles, use arbitrary values
      return `[border-${direction}-style:${style}]`;
    }
  
    private convertDirectionalBorderColor(direction: string, color: string): string | null {
      const directionMap: Record<string, string> = {
        'top': 't',
        'right': 'r',
        'bottom': 'b',
        'left': 'l'
      };
  
      const colorMap: Record<string, string> = {
        'transparent': 'transparent',
        'currentColor': 'current',
        'black': 'black',
        'white': 'white',
        '#000': 'black',
        '#000000': 'black',
        '#fff': 'white',
        '#ffffff': 'white',
        'red': 'red-500',
        'green': 'green-500',
        'blue': 'blue-500'
      };
  
      const dir = directionMap[direction];
      const colorClass = colorMap[color.toLowerCase()];
  
      if (dir && colorClass) {
        return `border-${dir}-${colorClass}`;
      }
  
      if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
        return `border-${dir}-[${color}]`;
      }
  
      return null;
    }
  
    private convertBorderRadius(radius: string): string | null {
      const radiusMap: Record<string, string> = {
        '0': 'rounded-none',
        '0px': 'rounded-none',
        '2px': 'rounded-sm',
        '4px': 'rounded',
        '6px': 'rounded-md',
        '8px': 'rounded-lg',
        '12px': 'rounded-xl',
        '16px': 'rounded-2xl',
        '24px': 'rounded-3xl',
        '50%': 'rounded-full',
        '9999px': 'rounded-full'
      };
  
      // Handle uniform radius
      if (radiusMap[radius.toLowerCase()]) {
        return radiusMap[radius.toLowerCase()];
      }
  
      // Handle multiple values
      const components = this.parseBorderRadius(radius);
      if (this.areAllCornersSame(components)) {
        return `rounded-[${components.topLeft}]`;
      }
  
      // For different corner values, use arbitrary values
      return `rounded-[${radius}]`;
    }
  
    private convertCornerRadius(corner: string, radius: string): string | null {
      const radiusMap: Record<string, string> = {
        '0': 'none',
        '0px': 'none',
        '2px': 'sm',
        '4px': '',
        '6px': 'md',
        '8px': 'lg',
        '12px': 'xl',
        '16px': '2xl',
        '24px': '3xl'
      };
  
      const radiusSuffix = radiusMap[radius.toLowerCase()];
      
      if (radiusSuffix !== undefined) {
        return radiusSuffix ? `rounded-${corner}-${radiusSuffix}` : `rounded-${corner}`;
      }
  
      return `rounded-${corner}-[${radius}]`;
    }
  
    private parseOutlineShorthand(value: string): BorderComponents {
      // Outline shorthand is similar to border
      return this.parseBorderShorthand(value);
    }
  
    private convertOutlineWidth(width: string): string | null {
      const widthMap: Record<string, string> = {
        '0': 'outline-0',
        '0px': 'outline-0',
        'thin': 'outline-1',
        'medium': 'outline-2',
        'thick': 'outline-4',
        '1px': 'outline-1',
        '2px': 'outline-2',
        '4px': 'outline-4',
        '8px': 'outline-8'
      };
  
      if (widthMap[width.toLowerCase()]) {
        return widthMap[width.toLowerCase()];
      }
  
      return `outline-[${width}]`;
    }
  
    private convertOutlineStyle(style: string): string | null {
      const styleMap: Record<string, string> = {
        'none': 'outline-none',
        'solid': 'outline',
        'dashed': 'outline-dashed',
        'dotted': 'outline-dotted',
        'double': 'outline-double'
      };
  
      if (styleMap[style.toLowerCase()]) {
        return styleMap[style.toLowerCase()];
      }
  
      return `[outline-style:${style}]`;
    }
  
    private convertOutlineColor(color: string): string | null {
      const colorMap: Record<string, string> = {
        'transparent': 'outline-transparent',
        'currentColor': 'outline-current',
        'black': 'outline-black',
        'white': 'outline-white',
        '#000': 'outline-black',
        '#000000': 'outline-black',
        '#fff': 'outline-white',
        '#ffffff': 'outline-white'
      };
  
      const lowerColor = color.toLowerCase();
      if (colorMap[lowerColor]) {
        return colorMap[lowerColor];
      }
  
      if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
        return `outline-[${color}]`;
      }
  
      return null;
    }
  
    private convertOutlineOffset(offset: string): string | null {
      const offsetMap: Record<string, string> = {
        '0': 'outline-offset-0',
        '0px': 'outline-offset-0',
        '1px': 'outline-offset-1',
        '2px': 'outline-offset-2',
        '4px': 'outline-offset-4',
        '8px': 'outline-offset-8'
      };
  
      if (offsetMap[offset.toLowerCase()]) {
        return offsetMap[offset.toLowerCase()];
      }
  
      return `outline-offset-[${offset}]`;
    }
  
    private areAllCornersSame(components: BorderRadiusComponents): boolean {
      const { topLeft, topRight, bottomRight, bottomLeft } = components;
      return topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;
    }
  }
  
  // ========================================================================
  // The Adapter Logic
  // ========================================================================
  
  const borderConverter = new BorderPatternMatcher();
  
  export const borderPatternMatcher = {
    test: (property: string): boolean => {
      const prop = property.toLowerCase().trim();
      return prop.startsWith('border') || prop.startsWith('outline');
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = borderConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
  };