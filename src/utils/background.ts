// src/conversion/matchers/background.ts

interface BackgroundComponents {
    color?: string;
    image?: string;
    position?: string;
    size?: string;
    repeat?: string;
    attachment?: string;
    origin?: string;
    clip?: string;
  }
  
  // ========================================================================
  // The COMPLETE class implementation must be here
  // ========================================================================
  class BackgroundPatternMatcher {
    private colorPatterns = [
      /#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})/,
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/,
      /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/,
      /^(transparent|currentColor|inherit|initial|unset|revert|black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|indigo|violet|coral|salmon|khaki|plum|orchid|tan|beige|azure|ivory|lavender|crimson|fuchsia|aqua)$/i
    ];
  
    private imagePatterns = [
      /url\(['"]?[^'"]*['"]?\)/,
      /linear-gradient\([^)]+\)/,
      /radial-gradient\([^)]+\)/,
      /conic-gradient\([^)]+\)/,
      /repeating-linear-gradient\([^)]+\)/,
      /repeating-radial-gradient\([^)]+\)/
    ];
  
    private positionKeywords = [
      'left', 'right', 'top', 'bottom', 'center',
      'left top', 'left center', 'left bottom',
      'right top', 'right center', 'right bottom',
      'center top', 'center center', 'center bottom'
    ];
  
    private repeatKeywords = [
      'repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round'
    ];
  
    private attachmentKeywords = ['scroll', 'fixed', 'local'];
    private originKeywords = ['border-box', 'padding-box', 'content-box'];
    private clipKeywords = ['border-box', 'padding-box', 'content-box', 'text'];
  
    parseBackgroundShorthand(value: string): BackgroundComponents {
      const components: BackgroundComponents = {};
      const tokens = this.tokenizeBackground(value);
      
      for (const token of tokens) {
        if (this.isColor(token)) {
          components.color = token;
        } else if (this.isImage(token)) {
          components.image = token;
        } else if (this.isRepeat(token)) {
          components.repeat = token;
        } else if (this.isAttachment(token)) {
          components.attachment = token;
        } else if (this.isOriginOrClip(token)) {
          if (!components.origin) {
            components.origin = token;
          } else {
            components.clip = token;
          }
        } else if (this.isPosition(token)) {
          components.position = token;
        } else if (this.isSize(token)) {
          components.size = token;
        }
      }
  
      return components;
    }
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
  
      if (prop === 'background-color') {
          const colorClass = this.convertBackgroundColor(value);
          if (colorClass) classes.push(colorClass);
      } else if (prop === 'background') {
          const components = this.parseBackgroundShorthand(value);
          
          if (components.color) {
              const colorClass = this.convertBackgroundColor(components.color);
              if (colorClass) classes.push(colorClass);
          }
          if (components.image) {
              const imageClass = this.convertBackgroundImage(components.image);
              if (imageClass) classes.push(imageClass);
          }
          if (components.position) {
              const positionClass = this.convertBackgroundPosition(components.position);
              if (positionClass) classes.push(positionClass);
          }
          if (components.size) {
              const sizeClass = this.convertBackgroundSize(components.size);
              if (sizeClass) classes.push(sizeClass);
          }
          if (components.repeat) {
              const repeatClass = this.convertBackgroundRepeat(components.repeat);
              if (repeatClass) classes.push(repeatClass);
          }
          if (components.attachment) {
              const attachmentClass = this.convertBackgroundAttachment(components.attachment);
              if (attachmentClass) classes.push(attachmentClass);
          }
      }
  
      return classes;
    }
  
    private tokenizeBackground(value: string): string[] {
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
  
    private isColor(token: string): boolean {
      return this.colorPatterns.some(pattern => pattern.test(token));
    }
  
    private isImage(token: string): boolean {
      return this.imagePatterns.some(pattern => pattern.test(token));
    }
  
    private isPosition(token: string): boolean {
      if (this.positionKeywords.includes(token.toLowerCase())) return true;
      return /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|cm|mm|in|pt|pc|ex|ch|vmin|vmax)$/.test(token);
    }
  
    private isSize(token: string): boolean {
      const sizeKeywords = ['auto', 'cover', 'contain'];
      if (sizeKeywords.includes(token.toLowerCase())) return true;
      return /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|cm|mm|in|pt|pc|ex|ch|vmin|vmax)$/.test(token);
    }
  
    private isRepeat(token: string): boolean {
      return this.repeatKeywords.includes(token.toLowerCase());
    }
  
    private isAttachment(token: string): boolean {
      return this.attachmentKeywords.includes(token.toLowerCase());
    }
  
    private isOriginOrClip(token: string): boolean {
      return [...this.originKeywords, ...this.clipKeywords].includes(token.toLowerCase());
    }
  
    private convertBackgroundColor(color: string): string | null {
      const colorMap: Record<string, string> = {
          'transparent': 'bg-transparent', 'currentColor': 'bg-current',
          'black': 'bg-black', 'white': 'bg-white', '#000': 'bg-black',
          '#000000': 'bg-black', '#fff': 'bg-white', '#ffffff': 'bg-white',
          'red': 'bg-red-500', 'green': 'bg-green-500', 'blue': 'bg-blue-500',
          'yellow': 'bg-yellow-500', 'orange': 'bg-orange-500',
          'purple': 'bg-purple-500', 'pink': 'bg-pink-500', 'gray': 'bg-gray-500',
      };
      const lowerColor = color.toLowerCase();
      if (colorMap[lowerColor]) return colorMap[lowerColor];
      if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
          return `bg-[${color}]`;
      }
      return null;
    }
  
    private convertBackgroundImage(image: string): string | null {
      if (image.startsWith('url(') || image.includes('gradient')) {
          return `bg-[image:${image}]`;
      }
      return null;
    }
  
    private convertBackgroundPosition(position: string): string | null {
      const positionMap: Record<string, string> = {
          'left': 'bg-left', 'right': 'bg-right', 'top': 'bg-top',
          'bottom': 'bg-bottom', 'center': 'bg-center', 'left top': 'bg-left-top',
          'left center': 'bg-left', 'left bottom': 'bg-left-bottom',
          'right top': 'bg-right-top', 'right center': 'bg-right',
          'right bottom': 'bg-right-bottom', 'center top': 'bg-top',
          'center center': 'bg-center', 'center bottom': 'bg-bottom'
      };
      const lowerPosition = position.toLowerCase();
      if (positionMap[lowerPosition]) return positionMap[lowerPosition];
      return `bg-[position:${position}]`;
    }
  
    private convertBackgroundSize(size: string): string | null {
      const sizeMap: Record<string, string> = {
          'auto': 'bg-auto', 'cover': 'bg-cover', 'contain': 'bg-contain'
      };
      const lowerSize = size.toLowerCase();
      if (sizeMap[lowerSize]) return sizeMap[lowerSize];
      return `bg-[size:${size}]`;
    }
  
    private convertBackgroundRepeat(repeat: string): string | null {
      const repeatMap: Record<string, string> = {
          'repeat': 'bg-repeat', 'repeat-x': 'bg-repeat-x',
          'repeat-y': 'bg-repeat-y', 'no-repeat': 'bg-no-repeat',
          'space': 'bg-repeat-space', 'round': 'bg-repeat-round'
      };
      return repeatMap[repeat.toLowerCase()] || null;
    }
  
    private convertBackgroundAttachment(attachment: string): string | null {
      const attachmentMap: Record<string, string> = {
          'fixed': 'bg-fixed', 'local': 'bg-local', 'scroll': 'bg-scroll'
      };
      return attachmentMap[attachment.toLowerCase()] || null;
    }
  }
  
  // ========================================================================
  // The Adapter Logic
  // ========================================================================
  
  const backgroundConverter = new BackgroundPatternMatcher();
  
  export const backgroundPatternMatcher = {
    test: (property: string): boolean => {
      return property.toLowerCase().trim().startsWith('background');
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = backgroundConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
  };
