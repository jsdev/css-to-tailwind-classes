// src/conversion/matchers/text.ts

interface TextComponents {
    color?: string;
    decoration?: string;
    decorationColor?: string;
    decorationStyle?: string;
    decorationThickness?: string;
    underlineOffset?: string;
    transform?: string;
    align?: string;
    indent?: string;
    overflow?: string;
    whitespace?: string;
    wordBreak?: string;
    hyphens?: string;
    writingMode?: string;
    textOrientation?: string;
  }
  
  // ========================================================================
  // The COMPLETE class implementation must be here
  // ========================================================================
  class TextPatternMatcher {
    private colorPatterns = [
      /#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})/,
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/,
      /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/,
      /^(transparent|currentColor|inherit|initial|unset|revert|black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|indigo|violet|coral|salmon|khaki|plum|orchid|tan|beige|azure|ivory|lavender|crimson|fuchsia|aqua)$/i
    ];
  
    private decorationKeywords = [
      'underline', 'overline', 'line-through', 'none'
    ];
  
    private decorationStyleKeywords = [
      'solid', 'double', 'dotted', 'dashed', 'wavy'
    ];
  
    private transformKeywords = [
      'uppercase', 'lowercase', 'capitalize', 'none'
    ];
  
    private alignKeywords = [
      'left', 'right', 'center', 'justify', 'start', 'end'
    ];
  
    private overflowKeywords = [
      'clip', 'ellipsis'
    ];
  
    private whitespaceKeywords = [
      'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'
    ];
  
    private wordBreakKeywords = [
      'normal', 'break-all', 'keep-all', 'break-word'
    ];
  
    private hyphensKeywords = ['none', 'manual', 'auto'];
  
    private writingModeKeywords = [
      'horizontal-tb', 'vertical-rl', 'vertical-lr'
    ];
  
    private textOrientationKeywords = [
      'mixed', 'upright', 'sideways-right', 'sideways', 'use-glyph-orientation'
    ];
  
    convertToTailwind(property: string, value: string): string[] {
      const classes: string[] = [];
      const prop = property.toLowerCase().trim();
  
      switch (prop) {
        case 'color':
          const colorClass = this.convertTextColor(value);
          if (colorClass) classes.push(colorClass);
          break;
  
        case 'text-decoration':
          const decorationClass = this.convertTextDecoration(value);
          if (decorationClass) classes.push(decorationClass);
          break;
  
        case 'text-decoration-line':
          const decorationLineClass = this.convertTextDecorationLine(value);
          if (decorationLineClass) classes.push(decorationLineClass);
          break;
  
        case 'text-decoration-color':
          const decorationColorClass = this.convertTextDecorationColor(value);
          if (decorationColorClass) classes.push(decorationColorClass);
          break;
  
        case 'text-decoration-style':
          const decorationStyleClass = this.convertTextDecorationStyle(value);
          if (decorationStyleClass) classes.push(decorationStyleClass);
          break;
  
        case 'text-decoration-thickness':
          const decorationThicknessClass = this.convertTextDecorationThickness(value);
          if (decorationThicknessClass) classes.push(decorationThicknessClass);
          break;
  
        case 'text-underline-offset':
          const underlineOffsetClass = this.convertTextUnderlineOffset(value);
          if (underlineOffsetClass) classes.push(underlineOffsetClass);
          break;
  
        case 'text-transform':
          const transformClass = this.convertTextTransform(value);
          if (transformClass) classes.push(transformClass);
          break;
  
        case 'text-align':
          const alignClass = this.convertTextAlign(value);
          if (alignClass) classes.push(alignClass);
          break;
  
        case 'text-indent':
          const indentClass = this.convertTextIndent(value);
          if (indentClass) classes.push(indentClass);
          break;
  
        case 'text-overflow':
          const overflowClass = this.convertTextOverflow(value);
          if (overflowClass) classes.push(overflowClass);
          break;
  
        case 'white-space':
          const whitespaceClass = this.convertWhitespace(value);
          if (whitespaceClass) classes.push(whitespaceClass);
          break;
  
        case 'word-break':
          const wordBreakClass = this.convertWordBreak(value);
          if (wordBreakClass) classes.push(wordBreakClass);
          break;
  
        case 'hyphens':
          const hyphensClass = this.convertHyphens(value);
          if (hyphensClass) classes.push(hyphensClass);
          break;
  
        case 'writing-mode':
          const writingModeClass = this.convertWritingMode(value);
          if (writingModeClass) classes.push(writingModeClass);
          break;
  
        case 'text-orientation':
          const textOrientationClass = this.convertTextOrientation(value);
          if (textOrientationClass) classes.push(textOrientationClass);
          break;
      }
  
      return classes;
    }
  
    private isColor(token: string): boolean {
      return this.colorPatterns.some(pattern => pattern.test(token));
    }
  
    private convertTextColor(color: string): string | null {
      const colorMap: Record<string, string> = {
        // Basic colors
        'transparent': 'text-transparent',
        'currentColor': 'text-current',
        'black': 'text-black',
        'white': 'text-white',
        
        // Hex shortcuts
        '#000': 'text-black',
        '#000000': 'text-black',
        '#fff': 'text-white',
        '#ffffff': 'text-white',
        
        // Named colors mapped to closest Tailwind equivalents
        'red': 'text-red-500',
        'green': 'text-green-500',
        'blue': 'text-blue-500',
        'yellow': 'text-yellow-500',
        'orange': 'text-orange-500',
        'purple': 'text-purple-500',
        'pink': 'text-pink-500',
        'gray': 'text-gray-500',
        'grey': 'text-gray-500',
        'brown': 'text-amber-700',
        'cyan': 'text-cyan-500',
        'magenta': 'text-fuchsia-500',
        'lime': 'text-lime-500',
        'navy': 'text-blue-900',
        'teal': 'text-teal-500',
        'olive': 'text-yellow-600',
        'maroon': 'text-red-800',
        'silver': 'text-gray-400',
        'gold': 'text-yellow-400',
        'indigo': 'text-indigo-500',
        'violet': 'text-violet-500',
        'coral': 'text-orange-400',
        'salmon': 'text-orange-300',
        'khaki': 'text-yellow-300',
        'plum': 'text-purple-400',
        'orchid': 'text-purple-300',
        'tan': 'text-yellow-600',
        'beige': 'text-yellow-100',
        'azure': 'text-blue-100',
        'ivory': 'text-yellow-50',
        'lavender': 'text-purple-200',
        'crimson': 'text-red-600',
        'fuchsia': 'text-fuchsia-500',
        'aqua': 'text-cyan-500'
      };
  
      const lowerColor = color.toLowerCase();
      
      // Check for direct color mapping
      if (colorMap[lowerColor]) {
        return colorMap[lowerColor];
      }
  
      // Handle hex colors, rgb, hsl with arbitrary values
      if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
        return `text-[${color}]`;
      }
  
      return null;
    }
  
    private convertTextDecoration(decoration: string): string | null {
      // Handle shorthand text-decoration property
      const tokens = decoration.toLowerCase().split(/\s+/);
      const classes: string[] = [];
  
      for (const token of tokens) {
        if (this.decorationKeywords.includes(token)) {
          const decorationClass = this.convertTextDecorationLine(token);
          if (decorationClass) classes.push(decorationClass);
        } else if (this.decorationStyleKeywords.includes(token)) {
          const styleClass = this.convertTextDecorationStyle(token);
          if (styleClass) classes.push(styleClass);
        } else if (this.isColor(token)) {
          const colorClass = this.convertTextDecorationColor(token);
          if (colorClass) classes.push(colorClass);
        }
      }
  
      return classes.length > 0 ? classes.join(' ') : null;
    }
  
    private convertTextDecorationLine(line: string): string | null {
      const decorationMap: Record<string, string> = {
        'underline': 'underline',
        'overline': 'overline',
        'line-through': 'line-through',
        'none': 'no-underline'
      };
      return decorationMap[line.toLowerCase()] || null;
    }
  
    private convertTextDecorationColor(color: string): string | null {
      const colorMap: Record<string, string> = {
        'transparent': 'decoration-transparent',
        'currentColor': 'decoration-current',
        'black': 'decoration-black',
        'white': 'decoration-white',
        '#000': 'decoration-black',
        '#000000': 'decoration-black',
        '#fff': 'decoration-white',
        '#ffffff': 'decoration-white',
        'red': 'decoration-red-500',
        'green': 'decoration-green-500',
        'blue': 'decoration-blue-500',
        'yellow': 'decoration-yellow-500',
        'orange': 'decoration-orange-500',
        'purple': 'decoration-purple-500',
        'pink': 'decoration-pink-500',
        'gray': 'decoration-gray-500',
        'grey': 'decoration-gray-500'
      };
  
      const lowerColor = color.toLowerCase();
      if (colorMap[lowerColor]) {
        return colorMap[lowerColor];
      }
  
      if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
        return `decoration-[${color}]`;
      }
  
      return null;
    }
  
    private convertTextDecorationStyle(style: string): string | null {
      const styleMap: Record<string, string> = {
        'solid': 'decoration-solid',
        'double': 'decoration-double',
        'dotted': 'decoration-dotted',
        'dashed': 'decoration-dashed',
        'wavy': 'decoration-wavy'
      };
      return styleMap[style.toLowerCase()] || null;
    }
  
    private convertTextDecorationThickness(thickness: string): string | null {
      const thicknessMap: Record<string, string> = {
        'auto': 'decoration-auto',
        'from-font': 'decoration-from-font',
        '0': 'decoration-0',
        '1px': 'decoration-1',
        '2px': 'decoration-2',
        '4px': 'decoration-4',
        '8px': 'decoration-8'
      };
  
      if (thicknessMap[thickness.toLowerCase()]) {
        return thicknessMap[thickness.toLowerCase()];
      }
  
      return `decoration-[${thickness}]`;
    }
  
    private convertTextUnderlineOffset(offset: string): string | null {
      const offsetMap: Record<string, string> = {
        'auto': 'underline-offset-auto',
        '0': 'underline-offset-0',
        '1px': 'underline-offset-1',
        '2px': 'underline-offset-2',
        '4px': 'underline-offset-4',
        '8px': 'underline-offset-8'
      };
  
      if (offsetMap[offset.toLowerCase()]) {
        return offsetMap[offset.toLowerCase()];
      }
  
      return `underline-offset-[${offset}]`;
    }
  
    private convertTextTransform(transform: string): string | null {
      const transformMap: Record<string, string> = {
        'uppercase': 'uppercase',
        'lowercase': 'lowercase',
        'capitalize': 'capitalize',
        'none': 'normal-case'
      };
      return transformMap[transform.toLowerCase()] || null;
    }
  
    private convertTextAlign(align: string): string | null {
      const alignMap: Record<string, string> = {
        'left': 'text-left',
        'right': 'text-right',
        'center': 'text-center',
        'justify': 'text-justify',
        'start': 'text-start',
        'end': 'text-end'
      };
      return alignMap[align.toLowerCase()] || null;
    }
  
    private convertTextIndent(indent: string): string | null {
      const indentMap: Record<string, string> = {
        '0': 'indent-0',
        '0px': 'indent-0',
        '0.5rem': 'indent-2',
        '1rem': 'indent-4',
        '1.5rem': 'indent-6',
        '2rem': 'indent-8',
        '2.5rem': 'indent-10',
        '3rem': 'indent-12'
      };
  
      if (indentMap[indent.toLowerCase()]) {
        return indentMap[indent.toLowerCase()];
      }
  
      return `indent-[${indent}]`;
    }
  
    private convertTextOverflow(overflow: string): string | null {
      const overflowMap: Record<string, string> = {
        'clip': 'text-clip',
        'ellipsis': 'text-ellipsis'
      };
      return overflowMap[overflow.toLowerCase()] || null;
    }
  
    private convertWhitespace(whitespace: string): string | null {
      const whitespaceMap: Record<string, string> = {
        'normal': 'whitespace-normal',
        'nowrap': 'whitespace-nowrap',
        'pre': 'whitespace-pre',
        'pre-line': 'whitespace-pre-line',
        'pre-wrap': 'whitespace-pre-wrap',
        'break-spaces': 'whitespace-break-spaces'
      };
      return whitespaceMap[whitespace.toLowerCase()] || null;
    }
  
    private convertWordBreak(wordBreak: string): string | null {
      const wordBreakMap: Record<string, string> = {
        'normal': 'break-normal',
        'break-all': 'break-all',
        'keep-all': 'break-keep',
        'break-word': 'break-words'
      };
      return wordBreakMap[wordBreak.toLowerCase()] || null;
    }
  
    private convertHyphens(hyphens: string): string | null {
      const hyphensMap: Record<string, string> = {
        'none': 'hyphens-none',
        'manual': 'hyphens-manual',
        'auto': 'hyphens-auto'
      };
      return hyphensMap[hyphens.toLowerCase()] || null;
    }
  
    private convertWritingMode(mode: string): string | null {
      const writingModeMap: Record<string, string> = {
        'horizontal-tb': 'writing-mode-horizontal-tb',
        'vertical-rl': 'writing-mode-vertical-rl',
        'vertical-lr': 'writing-mode-vertical-lr'
      };
      // Note: Tailwind doesn't have built-in writing-mode utilities by default
      // These would need to be added via plugin or arbitrary values
      return `[writing-mode:${mode}]`;
    }
  
    private convertTextOrientation(orientation: string): string | null {
      // Note: Tailwind doesn't have built-in text-orientation utilities by default
      return `[text-orientation:${orientation}]`;
    }
  }
  
  // ========================================================================
  // The Adapter Logic
  // ========================================================================
  
  const textConverter = new TextPatternMatcher();
  
  export const textPatternMatcher = {
    test: (property: string): boolean => {
      const prop = property.toLowerCase().trim();
      return prop === 'color' || 
             prop.startsWith('text-') || 
             prop === 'white-space' ||
             prop === 'word-break' ||
             prop === 'hyphens' ||
             prop === 'writing-mode';
    },
    convert: (property: string, value: string): string | null => {
      const tailwindClasses = textConverter.convertToTailwind(property, value);
      if (tailwindClasses.length > 0) {
        return tailwindClasses.join(' ');
      }
      return null;
    },
  };