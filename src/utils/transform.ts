/**
 * Transform utility for converting CSS transform values to Tailwind classes
 */

export interface TransformMatcher {
  match: (property: string, value: string) => boolean;
}

// Transform function patterns
const TRANSFORM_PATTERNS = {
  // Translate
  translateX: /^translateX\(([^)]+)\)$/i,
  translateY: /^translateY\(([^)]+)\)$/i,
  translate: /^translate\(([^,]+)(?:,\s*([^)]+))?\)$/i,
  translate3d: /^translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)$/i,
  
  // Scale
  scaleX: /^scaleX\(([^)]+)\)$/i,
  scaleY: /^scaleY\(([^)]+)\)$/i,
  scale: /^scale\(([^,]+)(?:,\s*([^)]+))?\)$/i,
  scale3d: /^scale3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)$/i,
  
  // Rotate
  rotate: /^rotate\(([^)]+)\)$/i,
  rotateX: /^rotateX\(([^)]+)\)$/i,
  rotateY: /^rotateY\(([^)]+)\)$/i,
  rotateZ: /^rotateZ\(([^)]+)\)$/i,
  rotate3d: /^rotate3d\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)$/i,
  
  // Skew
  skewX: /^skewX\(([^)]+)\)$/i,
  skewY: /^skewY\(([^)]+)\)$/i,
  skew: /^skew\(([^,]+)(?:,\s*([^)]+))?\)$/i,
};

// Tailwind spacing scale for transforms
const TRANSFORM_SPACING_SCALE: Record<string, string> = {
  '0': '0',
  '1px': 'px',
  '2px': '0.5',
  '4px': '1',
  '6px': '1.5',
  '8px': '2',
  '10px': '2.5',
  '12px': '3',
  '16px': '4',
  '20px': '5',
  '24px': '6',
  '32px': '8',
  '40px': '10',
  '48px': '12',
  '64px': '16',
  '80px': '20',
  '96px': '24',
  '128px': '32',
  '160px': '40',
  '192px': '48',
  '224px': '56',
  '256px': '64',
  '288px': '72',
  '320px': '80',
  '384px': '96',
};

// Scale values for scale transforms
const SCALE_VALUES: Record<string, string> = {
  '0': '0',
  '0.5': '50',
  '0.75': '75',
  '0.9': '90',
  '0.95': '95',
  '1': '100',
  '1.05': '105',
  '1.1': '110',
  '1.25': '125',
  '1.5': '150',
};

export const transformMatcher: TransformMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    return prop === 'transform' && (
      val === 'none' ||
      Object.values(TRANSFORM_PATTERNS).some(pattern => pattern.test(val)) ||
      val.includes('translate') ||
      val.includes('scale') ||
      val.includes('rotate') ||
      val.includes('skew')
    );
  }
};

function convertTranslateValue(value: string): string {
  const val = value.toLowerCase().trim();
  
  if (val === '0' || val === '0px') {
    return '0';
  }
  
  // Check spacing scale
  if (TRANSFORM_SPACING_SCALE[val]) {
    return TRANSFORM_SPACING_SCALE[val];
  }
  
  // Handle percentage
  if (val.endsWith('%')) {
    const percent = val.replace('%', '');
    if (percent === '50') return '1/2';
    if (percent === '100') return 'full';
    return `[${val}]`;
  }
  
  // Handle other units
  return `[${value}]`;
}

function convertScaleValue(value: string): string {
  const val = value.toLowerCase().trim();
  
  if (SCALE_VALUES[val]) {
    return SCALE_VALUES[val];
  }
  
  // Handle percentage
  if (val.endsWith('%')) {
    const percent = parseInt(val.replace('%', ''));
    return percent.toString();
  }
  
  return `[${value}]`;
}

function convertRotateValue(value: string): string {
  const val = value.toLowerCase().trim();
  
  // Common rotation values
  const rotateValues: Record<string, string> = {
    '0deg': '0',
    '1deg': '1',
    '2deg': '2',
    '3deg': '3',
    '6deg': '6',
    '12deg': '12',
    '45deg': '45',
    '90deg': '90',
    '180deg': '180',
    '-180deg': '-180',
    '-90deg': '-90',
    '-45deg': '-45',
    '-12deg': '-12',
    '-6deg': '-6',
    '-3deg': '-3',
    '-2deg': '-2',
    '-1deg': '-1',
  };
  
  if (rotateValues[val]) {
    return rotateValues[val];
  }
  
  return `[${value}]`;
}

export function convertTransform(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const val = value.toLowerCase().trim();
  
  if (prop !== 'transform') {
    return null;
  }
  
  if (val === 'none') {
    return 'transform-none';
  }
  
  const classes: string[] = [];
  
  // Parse multiple transform functions
  const functions = val.match(/\w+\([^)]*\)/g) || [];
  
  for (const func of functions) {
    // TranslateX
    let match = TRANSFORM_PATTERNS.translateX.exec(func);
    if (match) {
      const translateVal = convertTranslateValue(match[1]);
      classes.push(`translate-x-${translateVal}`);
      continue;
    }
    
    // TranslateY
    match = TRANSFORM_PATTERNS.translateY.exec(func);
    if (match) {
      const translateVal = convertTranslateValue(match[1]);
      classes.push(`translate-y-${translateVal}`);
      continue;
    }
    
    // Translate (2D)
    match = TRANSFORM_PATTERNS.translate.exec(func);
    if (match) {
      const xVal = convertTranslateValue(match[1]);
      const yVal = match[2] ? convertTranslateValue(match[2]) : xVal;
      classes.push(`translate-x-${xVal}`);
      if (yVal !== xVal || !match[2]) {
        classes.push(`translate-y-${yVal}`);
      }
      continue;
    }
    
    // ScaleX
    match = TRANSFORM_PATTERNS.scaleX.exec(func);
    if (match) {
      const scaleVal = convertScaleValue(match[1]);
      classes.push(`scale-x-${scaleVal}`);
      continue;
    }
    
    // ScaleY
    match = TRANSFORM_PATTERNS.scaleY.exec(func);
    if (match) {
      const scaleVal = convertScaleValue(match[1]);
      classes.push(`scale-y-${scaleVal}`);
      continue;
    }
    
    // Scale (uniform)
    match = TRANSFORM_PATTERNS.scale.exec(func);
    if (match) {
      const scaleVal = convertScaleValue(match[1]);
      const yVal = match[2] ? convertScaleValue(match[2]) : scaleVal;
      
      if (yVal === scaleVal) {
        classes.push(`scale-${scaleVal}`);
      } else {
        classes.push(`scale-x-${scaleVal}`);
        classes.push(`scale-y-${yVal}`);
      }
      continue;
    }
    
    // Rotate
    match = TRANSFORM_PATTERNS.rotate.exec(func);
    if (match) {
      const rotateVal = convertRotateValue(match[1]);
      classes.push(`rotate-${rotateVal}`);
      continue;
    }
    
    // SkewX
    match = TRANSFORM_PATTERNS.skewX.exec(func);
    if (match) {
      const skewVal = convertRotateValue(match[1]); // Use same conversion as rotate for degrees
      classes.push(`skew-x-${skewVal}`);
      continue;
    }
    
    // SkewY
    match = TRANSFORM_PATTERNS.skewY.exec(func);
    if (match) {
      const skewVal = convertRotateValue(match[1]);
      classes.push(`skew-y-${skewVal}`);
      continue;
    }
    
    // If no pattern matches, use arbitrary value
    classes.push(`transform-[${func}]`);
  }
  
  return classes.length > 0 ? classes.join(' ') : `transform-[${value}]`;
}

export const transformPatternMatcher = {
  test: transformMatcher.match,
  convert: convertTransform
};
