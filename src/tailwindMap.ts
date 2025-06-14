// Comprehensive mapping of CSS properties and values to Tailwind classes
export interface TailwindMapping {
  [property: string]: {
    [value: string]: string;
  } | ((value: string) => string | null);
}

export const tailwindMap: TailwindMapping = {
  // Display
  'display': {
    'block': 'block',
    'contents': 'contents',
    'inline-block': 'inline-block',
    'inline': 'inline',
    'inline-flex': 'inline-flex',
    'inline-grid': 'inline-grid',
    'inline-table': 'inline-table',
    'flex': 'flex',
    'flow-root': 'flow-root',
    'grid': 'grid',
    'table': 'table',
    'table-caption': 'table-caption',
    'table-column': 'table-column',
    'table-column-group': 'table-column-group',
    'table-footer-group': 'table-footer-group',
    'table-header-group': 'table-header-group',
    'table-row-group': 'table-row-group',
    'table-cell': 'table-cell',
    'table-row': 'table-row',
    'list-item': 'list-item',
    'none': 'hidden'
  },

  // Position
  'position': {
    'static': 'static',
    'fixed': 'fixed',
    'absolute': 'absolute',
    'relative': 'relative',
    'sticky': 'sticky'
  },

  // Positioning - Top
  'top': (value: string) => {
    if (value === '0' || value === '0px') return 'top-0';
    if (value === 'auto') return 'top-auto';
    const numValue = parseFloat(value);
    if (value.endsWith('px')) {
      if (numValue % 4 === 0) return `top-${numValue / 4}`;
    }
    if (value.endsWith('%')) {
      const percentMap: Record<string, string> = {
        '50%': 'top-1/2',
        '100%': 'top-full'
      };
      return percentMap[value] || null;
    }
    return null;
  },

  // Positioning - Right
  'right': (value: string) => {
    if (value === '0' || value === '0px') return 'right-0';
    if (value === 'auto') return 'right-auto';
    const numValue = parseFloat(value);
    if (value.endsWith('px')) {
      if (numValue % 4 === 0) return `right-${numValue / 4}`;
    }
    if (value.endsWith('%')) {
      const percentMap: Record<string, string> = {
        '50%': 'right-1/2',
        '100%': 'right-full'
      };
      return percentMap[value] || null;
    }
    return null;
  },

  // Positioning - Bottom
  'bottom': (value: string) => {
    if (value === '0' || value === '0px') return 'bottom-0';
    if (value === 'auto') return 'bottom-auto';
    const numValue = parseFloat(value);
    if (value.endsWith('px')) {
      if (numValue % 4 === 0) return `bottom-${numValue / 4}`;
    }
    if (value.endsWith('%')) {
      const percentMap: Record<string, string> = {
        '50%': 'bottom-1/2',
        '100%': 'bottom-full'
      };
      return percentMap[value] || null;
    }
    return null;
  },

  // Positioning - Left
  'left': (value: string) => {
    if (value === '0' || value === '0px') return 'left-0';
    if (value === 'auto') return 'left-auto';
    const numValue = parseFloat(value);
    if (value.endsWith('px')) {
      if (numValue % 4 === 0) return `left-${numValue / 4}`;
    }
    if (value.endsWith('%')) {
      const percentMap: Record<string, string> = {
        '50%': 'left-1/2',
        '100%': 'left-full'
      };
      return percentMap[value] || null;
    }
    return null;
  },

  // Flexbox
  'justify-content': {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    'center': 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  },

  'align-items': {
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    'center': 'items-center',
    'baseline': 'items-baseline',
    'stretch': 'items-stretch'
  },

  'flex-direction': {
    'row': 'flex-row',
    'row-reverse': 'flex-row-reverse',
    'column': 'flex-col',
    'column-reverse': 'flex-col-reverse'
  },

  'flex-wrap': {
    'nowrap': 'flex-nowrap',
    'wrap': 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  },

  // Grid
  'grid-template-columns': (value: string) => {
    if (value === 'none') return 'grid-cols-none';
    
    // Check for repeat patterns
    const repeatMatch = value.match(/repeat\((\d+),\s*1fr\)/);
    if (repeatMatch) {
      const count = parseInt(repeatMatch[1]);
      if (count <= 12) return `grid-cols-${count}`;
    }
    
    // Check for simple fr patterns
    const frPattern = /^(1fr\s*)+$/;
    if (frPattern.test(value)) {
      const count = value.split('1fr').length - 1;
      if (count <= 12) return `grid-cols-${count}`;
    }
    
    // Check for specific pixel values
    if (value === '200px 200px') return 'grid-cols-2';
    
    return null;
  },

  'grid-template-rows': (value: string) => {
    if (value === 'none') return 'grid-rows-none';
    
    const repeatMatch = value.match(/repeat\((\d+),\s*1fr\)/);
    if (repeatMatch) {
      const count = parseInt(repeatMatch[1]);
      if (count <= 6) return `grid-rows-${count}`;
    }
    
    const frPattern = /^(1fr\s*)+$/;
    if (frPattern.test(value)) {
      const count = value.split('1fr').length - 1;
      if (count <= 6) return `grid-rows-${count}`;
    }
    
    return null;
  },

  'gap': (value: string) => {
    const numValue = parseFloat(value);
    if (value.endsWith('px') && numValue % 4 === 0) {
      return `gap-${numValue / 4}`;
    }
    return null;
  },

  // Spacing
  'margin': (value: string) => {
    if (value === '0' || value === '0px') return 'm-0';
    if (value === 'auto') return 'm-auto';
    const numValue = parseFloat(value);
    if (value.endsWith('px') && numValue % 4 === 0) {
      return `m-${numValue / 4}`;
    }
    return null;
  },

  'padding': (value: string) => {
    if (value === '0' || value === '0px') return 'p-0';
    const numValue = parseFloat(value);
    if (value.endsWith('px') && numValue % 4 === 0) {
      return `p-${numValue / 4}`;
    }
    return null;
  },

  // Width/Height
  'width': (value: string) => {
    const widthMap: Record<string, string> = {
      'auto': 'w-auto',
      '100%': 'w-full',
      '50%': 'w-1/2',
      '33.333333%': 'w-1/3',
      '25%': 'w-1/4',
      '20%': 'w-1/5',
      '16.666667%': 'w-1/6'
    };
    
    if (widthMap[value]) return widthMap[value];
    
    const numValue = parseFloat(value);
    if (value.endsWith('px') && numValue % 4 === 0) {
      return `w-${numValue / 4}`;
    }
    return null;
  },

  'height': (value: string) => {
    const heightMap: Record<string, string> = {
      'auto': 'h-auto',
      '100%': 'h-full',
      '100vh': 'h-screen',
      '50%': 'h-1/2',
      '33.333333%': 'h-1/3',
      '25%': 'h-1/4'
    };
    
    if (heightMap[value]) return heightMap[value];
    
    const numValue = parseFloat(value);
    if (value.endsWith('px') && numValue % 4 === 0) {
      return `h-${numValue / 4}`;
    }
    return null;
  },

  // Colors
  'color': {
    '#000': 'text-black',
    '#000000': 'text-black',
    'black': 'text-black',
    '#fff': 'text-white',
    '#ffffff': 'text-white',
    'white': 'text-white',
    'transparent': 'text-transparent'
  },

  'background-color': {
    '#000': 'bg-black',
    '#000000': 'bg-black',
    'black': 'bg-black',
    '#fff': 'bg-white',
    '#ffffff': 'bg-white',
    'white': 'bg-white',
    'transparent': 'bg-transparent'
  },

  // Typography
  'font-size': {
    '12px': 'text-xs',
    '14px': 'text-sm',
    '16px': 'text-base',
    '18px': 'text-lg',
    '20px': 'text-xl',
    '24px': 'text-2xl',
    '30px': 'text-3xl',
    '36px': 'text-4xl',
    '48px': 'text-5xl',
    '60px': 'text-6xl'
  },

  'font-weight': {
    '100': 'font-thin',
    '200': 'font-extralight',
    '300': 'font-light',
    '400': 'font-normal',
    'normal': 'font-normal',
    '500': 'font-medium',
    '600': 'font-semibold',
    '700': 'font-bold',
    'bold': 'font-bold',
    '800': 'font-extrabold',
    '900': 'font-black'
  },

  'text-align': {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify',
    'start': 'text-start',
    'end': 'text-end'
  },

  'line-height': {
    '1': 'leading-none',
    '1.25': 'leading-tight',
    '1.375': 'leading-snug',
    '1.5': 'leading-normal',
    '1.625': 'leading-relaxed',
    '2': 'leading-loose'
  },

  'letter-spacing': {
    '-0.05em': 'tracking-tighter',
    '-0.025em': 'tracking-tight',
    '0': 'tracking-normal',
    '0.025em': 'tracking-wide',
    '0.05em': 'tracking-wider',
    '0.1em': 'tracking-widest'
  },

  'text-decoration': {
    'underline': 'underline',
    'overline': 'overline',
    'line-through': 'line-through',
    'none': 'no-underline'
  },

  // Font Family
  'font-family': (value: string) => {
    const fontFamilyMap: Record<string, string> = {
      'sans-serif': 'font-sans',
      'serif': 'font-serif',
      'monospace': 'font-mono'
    };
    return fontFamilyMap[value] || null;
  },

  // Word Break
  'word-break': {
    'normal': 'break-normal',
    'break-all': 'break-all',
    'keep-all': 'break-keep'
  },

  // Object Fit
  'object-fit': {
    'contain': 'object-contain',
    'cover': 'object-cover',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  }
};