export const TRANSITION_PROPERTY_MAP: Record<string, string> = {
    'all': 'transition-all',
    'none': 'transition-none',
    'color': 'transition-colors',
    'background-color': 'transition-colors',
    'border-color': 'transition-colors',
    'text-decoration-color': 'transition-colors',
    'opacity': 'transition-opacity',
    'shadow': 'transition-shadow',
    'box-shadow': 'transition-shadow',
    'transform': 'transition-transform',
  };
  
  export const EASING_FUNCTION_MAP: Record<string, string> = {
    'ease': 'ease-in-out', // Tailwind's default ease is ease-in-out
    'linear': 'ease-linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
  };
  
  export const DURATION_AND_DELAY_MAP: Record<string, string> = {
    '75': '75',
    '100': '100',
    '150': '150',
    '200': '200',
    '300': '300',
    '500': '500',
    '700': '700',
    '1000': '1000',
  };
  
  
  // Define spacing scale (Tailwind's default spacing)
  export const SPACING_SCALE = {
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
  export const SPACING_PROPERTIES = [
    'top', 'right', 'bottom', 'left',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'gap', 'row-gap', 'column-gap', 'grid-gap', 'grid-row-gap', 'grid-column-gap'
  ];
  
  // Grid properties
  export const GRID_PROPERTIES = [
    'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
    'grid-column', 'grid-row', 'grid-column-start', 'grid-column-end',
    'grid-row-start', 'grid-row-end', 'grid-auto-columns', 'grid-auto-rows',
    'grid-auto-flow', 'justify-items', 'align-items', 'place-items',
    'justify-content', 'align-content', 'place-content'
  ];
  
  // Aspect ratio properties
  export const ASPECT_RATIO_PROPERTIES = ['aspect-ratio'];
  
  // Fraction scale for percentages
  export const FRACTION_SCALE = {
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
  export const ASPECT_RATIO_PATTERNS = {
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