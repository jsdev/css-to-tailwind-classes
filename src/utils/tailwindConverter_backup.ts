import { ConversionResult, CSSRule } from '../types'
import tailwindMap from '../tailwindMap'
import { backgroundPatternMatcher } from './background'
import { transitionPatternMatcher } from './transition'
import { textPatternMatcher } from './text'
import { fontPatternMatcher } from './font'
import { borderPatternMatcher } from './border'
import { formColorPatternMatcher } from './color'
import { sizePatternMatcher } from './size'
import {
  ASPECT_RATIO_PROPERTIES,
  ASPECT_RATIO_PATTERNS,
  FRACTION_SCALE,
  GRID_PROPERTIES,
  SPACING_PROPERTIES,
  SPACING_SCALE,
  GRID_PATTERNS,
  GRID_ROWS_PATTERNS,
} from './constants'
import {
  paddingShorthandMatcher,
  marginShorthandMatcher,
  basicSpacingMatcher,
  negativeSpacingMatcher,
  percentageSpacingMatcher,
  pixelSpacingMatcher,
  autoSpacingMatcher,
  pixelToScaleMatcher,
  remEmSpacingMatcher
} from './spacing'
import {
  gridTemplateColumnsMatcher,
  gridRowsMatcher,
  gridTemplateColumnsFixedMatcher,
  gridRowsFixedMatcher,
  gridGapMatcher,
  gridColumnGapMatcher,
  gridRowGapMatcher,
  gridSpanMatcher,
  gridStartEndMatcher
} from './grid'
import { aspectRatioMatcher, customAspectRatioMatcher, fallbackAspectRatioMatcher, convertAspectRatio } from './aspectRatio';
import { hexColorMatcher, rgbColorMatcher, hslColorMatcher, namedColorMatcher, cssVariableColorMatcher, convertColor } from './color';
import { borderRadiusMatcher, borderRadiusShorthandMatcher, convertBorderRadius } from './borderRadius';

// Import consolidated modules
const shadowPatternMatcher = new (require('./shadow').default)();
const borderPatternMatcher = new (require('./border').default)();

// Helper to wrap class-based matchers
function wrapClassMatcher(matcher, property?: string) {
  return {
    test: (prop: string, val: string) => matcher.test ? matcher.test(prop, val) : property ? prop === property : true,
    convert: (prop: string, val: string) => {
      const result = matcher.convertToTailwind ? matcher.convertToTailwind(prop, val) : matcher.convert(prop, val);
      return Array.isArray(result) ? result.join(' ') : result;
    }
  };
}

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

// Helper to wrap spacing matchers to fit PATTERN_MATCHERS interface
function wrapSpacingMatcher(matcher, convertFn) {
  return {
    test: matcher.match,
    convert: convertFn || (() => null)
  };
}

// Conversion logic for spacing matchers
function spacingConvert(property, value) {
  const prop = property.toLowerCase().trim();
  let val = value.toLowerCase().trim();
  const propertyClassMap = {
    'top': 'top',
    'right': 'right',
    'bottom': 'bottom',
    'left': 'left',
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
    'width': 'w',
    'height': 'h',
    'min-width': 'min-w',
    'min-height': 'min-h',
    'max-width': 'max-w',
    'max-height': 'max-h',
    'gap': 'gap',
    'row-gap': 'gap-y',
    'column-gap': 'gap-x',
    'grid-gap': 'gap',
    'grid-row-gap': 'gap-y',
    'grid-column-gap': 'gap-x',
  };
  const prefix = propertyClassMap[prop];
  if (!prefix) return null;
  // Handle negative values
  if (/^-/.test(val)) {
    val = val.replace(/^-/, '');
    if (val.endsWith('px')) val = val.replace('px', '');
    if (SPACING_SCALE[val]) return `-${prefix}-${SPACING_SCALE[val]}`;
    if (val === '1') return `-${prefix}-px`;
    return null;
  }
  // Handle auto
  if (val === 'auto') {
    return `${prefix}-auto`;
  }
  // Handle px values
  if (val.endsWith('px')) {
    const num = val.replace('px', '');
    if (SPACING_SCALE[num]) return `${prefix}-${SPACING_SCALE[num]}`;
    if (num === '1') return `${prefix}-px`;
    // If not in scale, use arbitrary value
    return `${prefix}-[${num}px]`;
  }
  // Handle scale
  if (SPACING_SCALE[val]) {
    return `${prefix}-${SPACING_SCALE[val]}`;
  }
  // Handle percent as fraction
  if (/%$/.test(val)) {
    const percent = parseFloat(val.replace('%', '')) / 100;
    if (FRACTION_SCALE[percent.toString()]) {
      return `${prefix}-${FRACTION_SCALE[percent.toString()]}`;
    }
    // If not in fraction scale, use arbitrary value
    return `${prefix}-[${val}]`;
  }
  // Handle rem/em
  if (/^(\d+(\.\d+)?(rem|em))$/.test(val)) {
    return `${prefix}-[${val}]`;
  }
  return `${prefix}-[${val}]`;
}

// Conversion logic for shorthand spacing (padding/margin with multiple values)
function shorthandSpacingConvert(property, value) {
  const prop = property.toLowerCase().trim();
  const parts = value.trim().split(/\s+/);
  
  // Helper to convert a single value to Tailwind scale
  function convertValue(val) {
    val = val.toLowerCase().trim();
    if (val.endsWith('px')) {
      const num = val.replace('px', '');
      if (SPACING_SCALE[num]) return SPACING_SCALE[num];
      if (num === '1') return 'px';
      return `[${num}px]`;
    }
    if (SPACING_SCALE[val]) return SPACING_SCALE[val];
    return `[${val}]`;
  }

  if (parts.length === 2) {
    // Two values: vertical horizontal (e.g., "8px 16px")
    const vertical = convertValue(parts[0]);
    const horizontal = convertValue(parts[1]);
    
    const prefix = prop === 'padding' ? 'p' : 'm';
    
    if (vertical === horizontal) {
      // Same values, use shorthand (e.g., p-2)
      return vertical === 'px' ? `${prefix}-px` : `${prefix}-${vertical}`;
    } else {
      // Different values, use directional (e.g., py-2 px-4)
      const verticalClass = vertical === 'px' ? `${prefix}y-px` : `${prefix}y-${vertical}`;
      const horizontalClass = horizontal === 'px' ? `${prefix}x-px` : `${prefix}x-${horizontal}`;
      return `${verticalClass} ${horizontalClass}`;
    }
  }
  
  if (parts.length === 4) {
    // Four values: top right bottom left
    const top = convertValue(parts[0]);
    const right = convertValue(parts[1]);
    const bottom = convertValue(parts[2]);
    const left = convertValue(parts[3]);
    
    const prefix = prop === 'padding' ? 'p' : 'm';
    const classes = [];
    
    if (top !== '0') classes.push(top === 'px' ? `${prefix}t-px` : `${prefix}t-${top}`);
    if (right !== '0') classes.push(right === 'px' ? `${prefix}r-px` : `${prefix}r-${right}`);
    if (bottom !== '0') classes.push(bottom === 'px' ? `${prefix}b-px` : `${prefix}b-${bottom}`);
    if (left !== '0') classes.push(left === 'px' ? `${prefix}l-px` : `${prefix}l-${left}`);
    
    return classes.join(' ');
  }
  
  if (parts.length === 3) {
    // Three values: top horizontal bottom
    const top = convertValue(parts[0]);
    const horizontal = convertValue(parts[1]);
    const bottom = convertValue(parts[2]);
    
    const prefix = prop === 'padding' ? 'p' : 'm';
    const classes = [];
    
    if (top !== '0') classes.push(top === 'px' ? `${prefix}t-px` : `${prefix}t-${top}`);
    if (horizontal !== '0') classes.push(horizontal === 'px' ? `${prefix}x-px` : `${prefix}x-${horizontal}`);
    if (bottom !== '0') classes.push(bottom === 'px' ? `${prefix}b-px` : `${prefix}b-${bottom}`);
    
    return classes.join(' ');
  }
  
  return null;
}

// Dynamic pattern matching functions
const PATTERN_MATCHERS = [
  backgroundPatternMatcher,
  transitionPatternMatcher,
  textPatternMatcher,
  fontPatternMatcher,
  borderPatternMatcher,
  formColorPatternMatcher,
  shadowPatternMatcher,
  sizePatternMatcher,
  wrapSpacingMatcher(paddingShorthandMatcher, shorthandSpacingConvert),
  wrapSpacingMatcher(marginShorthandMatcher, shorthandSpacingConvert),
  wrapSpacingMatcher(basicSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(negativeSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(percentageSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(pixelSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(autoSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(pixelToScaleMatcher, spacingConvert),
  wrapSpacingMatcher(remEmSpacingMatcher, spacingConvert)
];

// Dynamic pattern matching functions with optimized execution order
const PATTERN_MATCHERS = [
  // 1. SHORTHAND MATCHERS FIRST (most specific)
  wrapSpacingMatcher(paddingShorthandMatcher, shorthandSpacingConvert),
  wrapSpacingMatcher(marginShorthandMatcher, shorthandSpacingConvert),
  { test: borderRadiusShorthandMatcher.match, convert: convertBorderRadius },
  
  // 2. SPECIALIZED MATCHERS (specific properties)
  backgroundPatternMatcher,
  transitionPatternMatcher,
  textPatternMatcher,
  fontPatternMatcher,
  wrapClassMatcher(shadowPatternMatcher),
  wrapClassMatcher(borderPatternMatcher),
  
  // 3. COLOR MATCHERS (specific to general)
  { test: hexColorMatcher.match, convert: convertColor },
  { test: rgbColorMatcher.match, convert: convertColor },
  { test: hslColorMatcher.match, convert: convertColor },
  { test: namedColorMatcher.match, convert: convertColor },
  { test: cssVariableColorMatcher.match, convert: convertColor },
  
  // 4. BORDER & RADIUS MATCHERS
  { test: borderRadiusMatcher.match, convert: convertBorderRadius },
  formColorPatternMatcher,
  
  // 5. ASPECT RATIO MATCHERS
  { test: aspectRatioMatcher.match, convert: convertAspectRatio },
  { test: customAspectRatioMatcher.match, convert: convertAspectRatio },
  
  // 6. SPACING MATCHERS (general)
  wrapSpacingMatcher(basicSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(negativeSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(percentageSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(pixelSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(autoSpacingMatcher, spacingConvert),
  wrapSpacingMatcher(pixelToScaleMatcher, spacingConvert),
  wrapSpacingMatcher(remEmSpacingMatcher, spacingConvert),
  
  // 7. GRID MATCHERS
  wrapSpacingMatcher(gridGapMatcher, spacingConvert),
  wrapSpacingMatcher(gridColumnGapMatcher, spacingConvert),
  wrapSpacingMatcher(gridRowGapMatcher, spacingConvert),
  { test: gridTemplateColumnsMatcher.match, convert: (prop, val) => GRID_PATTERNS[val.toLowerCase().trim()] },
  { test: gridRowsMatcher.match, convert: (prop, val) => GRID_ROWS_PATTERNS[val.toLowerCase().trim()] },
  { test: gridSpanMatcher.match, convert: convertGridSpan },
  { test: gridStartEndMatcher.match, convert: convertGridStartEnd }
];

// Helper functions for grid conversion
function convertGridSpan(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const match = value.toLowerCase().trim().match(/^span\s+(\d+)$/);
  if (match) {
    const span = match[1];
    return prop === 'grid-column' ? `col-span-${span}` : `row-span-${span}`;
  }
  return null;
}

function convertGridStartEnd(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const val = value.toLowerCase().trim();
  
  if (val === 'auto') {
    if (prop === 'grid-column-start') return 'col-start-auto';
    if (prop === 'grid-column-end') return 'col-end-auto';
    if (prop === 'grid-row-start') return 'row-start-auto';
    if (prop === 'grid-row-end') return 'row-end-auto';
  }
  
  if (/^\d+$/.test(val)) {
    if (prop === 'grid-column-start') return `col-start-${val}`;
    if (prop === 'grid-column-end') return `col-end-${val}`;
    if (prop === 'grid-row-start') return `row-start-${val}`;
    if (prop === 'grid-row-end') return `row-end-${val}`;
  }
  
  return null;
}

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

    // ====================================================================
    // START: New logic for size optimization
    // ====================================================================

    // 1. Separate size-related properties from the rest
    const sizeDeclarations = rule.declarations.filter(({ property }) => 
      sizePatternMatcher.test(property)
    );
    
    const remainingDeclarations = rule.declarations.filter(({ property }) => 
      !sizePatternMatcher.test(property)
    );

    // 2. If we found any size properties, process them together for optimization
    if (sizeDeclarations.length > 0) {
      const sizeClasses = sizePatternMatcher.convertMultiple(sizeDeclarations);
      tailwindClasses.push(...sizeClasses);
    }
    
    // ====================================================================
    // END: New logic for size optimization
    // ====================================================================

    // 3. Process the rest of the declarations individually (this is your original loop)
    remainingDeclarations.forEach(({ property, value }) => { // <-- Note: Looping over `remainingDeclarations` now
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
        // IMPORTANT: We must ensure sizePatternMatcher is not run again here.
        // We can filter the matchers list, but it's simpler to just check the property.
        if (!sizePatternMatcher.test(property)) {
            tailwindClass = tryPatternMatch(property, value) || undefined;
        }
      }
      
      // ... (The rest of your logic for arbitrary values and unconvertible properties remains the same)
      if (!tailwindClass) {
        // This arbitrary value fallback should also not include width/height
        // as they are now handled by sizePatternMatcher exclusively.
        // Your existing fallbacks are mostly for other properties, which is fine.
        if (SPACING_PROPERTIES.includes(normalizedProperty) && !['width', 'height'].includes(normalizedProperty)) {
            const propertyClassMap: Record<string, string> = {
                'top': 'top', 'right': 'right', 'bottom': 'bottom', 'left': 'left',
            };
            const classPrefix = propertyClassMap[normalizedProperty];
            if (classPrefix) {
                tailwindClass = `${classPrefix}-[${value}]`;
            }
        } else if (GRID_PROPERTIES.includes(normalizedProperty)) {
            const gridPropertyMap: Record<string, string> = {
                'grid-template-columns': 'grid-cols', 'grid-template-rows': 'grid-rows',
                'grid-column': 'col', 'grid-row': 'row'
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
        // ... (your unconvertible logic remains the same)
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
        unconvertible.push({ property, value, reason });
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