/**
 * Custom Variable Optimizer
 * Optimizes CSS custom variables for specific Tailwind properties
 * Converts [var(--custom)] to (custom) format for supported properties
 */

// Comprehensive list of CSS properties that support the (<custom-property>) syntax
// Based on analysis of tailwindMap.ts entries with <custom-property> pattern
const CUSTOM_VARIABLE_SUPPORTED_PROPERTIES = new Set([
  // Animation
  'animation',
  
  // Aspect ratio
  'aspect-ratio',
  
  // Backdrop filters
  'backdrop-filter',
  
  // Background
  'background-color',
  'background-image',
  'background-position',
  'background-size',
  '--tw-gradient-from',
  '--tw-gradient-via',
  '--tw-gradient-to',
  
  // Border
  'border-color',
  'border-inline-color',
  'border-block-color',
  'border-inline-start-color',
  'border-inline-end-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  
  // Border radius
  'border-radius',
  'border-start-start-radius',
  'border-start-end-radius',
  'border-end-end-radius',
  'border-end-start-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  
  // Border spacing
  'border-spacing',
  
  // Box shadow
  'box-shadow',
  '--tw-ring-shadow',
  '--tw-inset-ring-shadow',
  
  // Color
  'color',
  
  // Content
  'content',
  
  // Cursor
  'cursor',
  
  // Fill
  'fill',
  
  // Filter
  'filter',
  
  // Flex
  'flex',
  'flex-basis',
  'flex-grow',
  'flex-shrink',
  
  // Font
  'font-stretch',
  'font-weight',
  
  // Gap
  'gap',
  'column-gap',
  'row-gap',
  
  // Grid
  'grid-auto-columns',
  'grid-auto-rows',
  'grid-column',
  'grid-column-start',
  'grid-column-end',
  'grid-row',
  'grid-row-start',
  'grid-row-end',
  'grid-template-columns',
  'grid-template-rows',
  
  // Height & Width
  'height',
  'width',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  
  // Letter spacing
  'letter-spacing',
  
  // List
  'list-style-image',
  'list-style-type',
  
  // Margin
  'margin',
  'margin-inline',
  'margin-block',
  'margin-inline-start',
  'margin-inline-end',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  
  // Mask
  'mask-image',
  'mask-position',
  'mask-size',
  
  // Object position
  'object-position',
  
  // Opacity
  'opacity',
  
  // Order
  'order',
  
  // Outline
  'outline-color',
  'outline-offset',
  
  // Padding
  'padding',
  'padding-inline',
  'padding-block',
  'padding-inline-start',
  'padding-inline-end',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  
  // Perspective
  'perspective',
  'perspective-origin',
  
  // Rotate
  'rotate',
  
  // Scale
  'scale',
  
  // Scroll margin
  'scroll-margin',
  'scroll-margin-inline',
  'scroll-margin-block',
  'scroll-margin-inline-start',
  'scroll-margin-inline-end',
  'scroll-margin-top',
  'scroll-margin-right',
  'scroll-margin-bottom',
  'scroll-margin-left',
  
  // Scroll padding
  'scroll-padding',
  'scroll-padding-inline',
  'scroll-padding-block',
  'scroll-padding-inline-start',
  'scroll-padding-inline-end',
  'scroll-padding-top',
  'scroll-padding-right',
  'scroll-padding-bottom',
  'scroll-padding-left',
  
  // Stroke
  'stroke',
  
  // Text
  'text-decoration-color',
  'text-indent',
  'text-shadow',
  'text-underline-offset',
  
  // Positioning
  'inset',
  'inset-inline',
  'inset-block',
  'inset-inline-start',
  'inset-inline-end',
  'top',
  'right',
  'bottom',
  'left',
  
  // Transform
  'transform',
  'transform-origin',
  
  // Transition
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  
  // Translate
  'translate',
  
  // Vertical align
  'vertical-align',
  
  // Z-index and other properties may be added as needed
]);

// Properties that should NOT be optimized (exceptions)
// These are properties where bracket notation should be preserved
const CUSTOM_VARIABLE_OPTIMIZATION_EXCEPTIONS = new Set([
  // Add properties here that should keep bracket notation
  // Currently empty as most properties support parentheses
]);

/**
 * Checks if a CSS property supports custom variable optimization
 * @param property - The CSS property name
 * @returns true if the property supports (custom-property) syntax
 */
export function isCustomVariableOptimizable(property: string): boolean {
  const normalizedProperty = property.toLowerCase().trim();
  
  // Check if it's in the exceptions list
  if (CUSTOM_VARIABLE_OPTIMIZATION_EXCEPTIONS.has(normalizedProperty)) {
    return false;
  }
  
  // Check if it's in the supported properties list
  return CUSTOM_VARIABLE_SUPPORTED_PROPERTIES.has(normalizedProperty);
}

/**
 * Detects if a Tailwind class contains a custom variable in bracket notation
 * Example: "p-[var(--spacing)]" -> true
 */
export function hasCustomVariableInBrackets(tailwindClass: string): boolean {
  return /\[var\(--[\w-]+\)\]/.test(tailwindClass);
}

/**
 * Extracts the custom variable name from a var() declaration
 * Example: "var(--my-spacing)" -> "my-spacing"
 */
export function extractCustomVariableName(varDeclaration: string): string {
  const match = varDeclaration.match(/var\(--?([\w-]+)\)/);
  return match ? match[1] : '';
}

/**
 * Optimizes a Tailwind class that contains custom variables
 * Converts from bracket notation to parentheses notation
 * Example: "p-[var(--spacing)]" -> "p-(spacing)"
 */
export function optimizeCustomVariableClass(tailwindClass: string): string {
  return tailwindClass.replace(/\[var\(--?([\w-]+)\)\]/g, '($1)');
}

/**
 * Main optimization function for custom variables
 * @param property - The CSS property name
 * @param tailwindClass - The generated Tailwind class
 * @returns Optimized Tailwind class or the original if no optimization is needed
 */
export function optimizeCustomVariable(property: string, tailwindClass: string): string {
  // Check if this property supports custom variable optimization
  if (!isCustomVariableOptimizable(property)) {
    return tailwindClass;
  }

  // Check if the class contains custom variables in bracket notation
  if (!hasCustomVariableInBrackets(tailwindClass)) {
    return tailwindClass;
  }

  // Apply the optimization
  return optimizeCustomVariableClass(tailwindClass);
}

/**
 * Batch optimization for multiple Tailwind classes
 * @param property - The CSS property name
 * @param tailwindClasses - Array of generated Tailwind classes
 * @returns Array of optimized Tailwind classes
 */
export function optimizeCustomVariables(property: string, tailwindClasses: string[]): string[] {
  return tailwindClasses.map(cls => optimizeCustomVariable(property, cls));
}

// Export the constants for potential use elsewhere
export { CUSTOM_VARIABLE_SUPPORTED_PROPERTIES, CUSTOM_VARIABLE_OPTIMIZATION_EXCEPTIONS };

/**
 * Detects if a Tailwind class contains a custom variable in bracket notation
 * Example: "p-[var(--spacing)]" -> true
 */
export function hasCustomVariableInBrackets(tailwindClass: string): boolean {
  return /\[var\(--[\w-]+\)\]/.test(tailwindClass);
}

/**
 * Extracts the custom variable name from a var() declaration
 * Example: "var(--my-spacing)" -> "my-spacing"
 */
export function extractCustomVariableName(varDeclaration: string): string {
  const match = varDeclaration.match(/var\(--?([\w-]+)\)/);
  return match ? match[1] : '';
}

/**
 * Optimizes a Tailwind class that contains custom variables
 * Converts from bracket notation to parentheses notation
 * Example: "p-[var(--spacing)]" -> "p-(spacing)"
 */
export function optimizeCustomVariableClass(tailwindClass: string): string {
  return tailwindClass.replace(/\[var\(--?([\w-]+)\)\]/g, '($1)');
}

/**
 * Main optimization function for custom variables
 * @param property - The CSS property name
 * @param tailwindClass - The generated Tailwind class
 * @returns Optimized Tailwind class or the original if no optimization is needed
 */
export function optimizeCustomVariable(property: string, tailwindClass: string): string {
  // Check if this property supports custom variable optimization
  if (!isCustomVariableOptimizable(property)) {
    return tailwindClass;
  }

  // Check if the class contains custom variables in bracket notation
  if (!hasCustomVariableInBrackets(tailwindClass)) {
    return tailwindClass;
  }

  // Apply the optimization
  return optimizeCustomVariableClass(tailwindClass);
}

/**
 * Batch optimization for multiple Tailwind classes
 * @param property - The CSS property name
 * @param tailwindClasses - Array of generated Tailwind classes
 * @returns Array of optimized Tailwind classes
 */
export function optimizeCustomVariables(property: string, tailwindClasses: string[]): string[] {
  return tailwindClasses.map(cls => optimizeCustomVariable(property, cls));
}
