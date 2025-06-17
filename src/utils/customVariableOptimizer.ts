/**
 * Custom Variable Optimizer
 * Optimizes CSS custom variables for specific Tailwind properties
 * Converts [var(--custom)] to (custom) format for supported properties
 */

// Comprehensive list of CSS properties that support the (<custom-property>) syntax
// This list is auto-generated from customVarSet.txt for accuracy and maintainability
const CUSTOM_VARIABLE_SUPPORTED_PROPERTIES = new Set([
  '--tw-gradient-from',
  '--tw-gradient-to',
  '--tw-gradient-via',
  '--tw-inset-ring-shadow',
  '--tw-ring-shadow',
  'animation',
  'aspect-ratio',
  'backdrop-filter',
  'background-color',
  'background-image',
  'background-position',
  'background-size',
  'border-block-color',
  'border-bottom-color',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-color',
  'border-end-end-radius',
  'border-end-start-radius',
  'border-inline-color',
  'border-inline-end-color',
  'border-inline-start-color',
  'border-left-color',
  'border-radius',
  'border-right-color',
  'border-spacing',
  'border-spacing-x',
  'border-spacing-y',
  'border-start-end-radius',
  'border-start-start-radius',
  'border-top-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'bottom',
  'box-shadow',
  'color',
  'column-gap',
  'content',
  'cursor',
  'fill',
  'filter',
  'flex',
  'flex-basis',
  'flex-grow',
  'flex-shrink',
  'font-stretch',
  'font-weight',
  'gap',
  'grid-auto-columns',
  'grid-auto-rows',
  'grid-column-end',
  'grid-column-start',
  'grid-column',
  'grid-row-end',
  'grid-row-start',
  'grid-row',
  'grid-template-columns',
  'grid-template-rows',
  'height',
  'inset',
  'inset-block',
  'inset-inline',
  'inset-inline-end',
  'inset-inline-start',
  'left',
  'letter-spacing',
  'list-style-image',
  'list-style-type',
  'margin-block',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'opacity',
  'order',
  'outline-color',
  'outline-offset',
  'padding',
  'padding-block',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'perspective',
  'perspective-origin',
  'rotate',
  'scale',
  'scroll-margin',
  'scroll-margin-block',
  'scroll-margin-bottom',
  'scroll-margin-inline',
  'scroll-margin-inline-end',
  'scroll-margin-inline-start',
  'scroll-margin-left',
  'scroll-margin-right',
  'scroll-margin-top',
  'scroll-padding',
  'scroll-padding-block',
  'scroll-padding-bottom',
  'scroll-padding-inline',
  'scroll-padding-inline-end',
  'scroll-padding-inline-start',
  'scroll-padding-left',
  'scroll-padding-right',
  'scroll-padding-top',
  'stroke',
  'text-decoration-color',
  'text-indent',
  'text-shadow',
  'text-underline-offset',
  'top',
  'transform',
  'transform-origin',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  'translate',
  'vertical-align',
  'z-index',
  
  // Additional properties for overflow line-clamp
  'overflow'
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
 * Example: "var(--my-spacing)" -> "--my-spacing"
 */
export function extractCustomVariableName(varDeclaration: string): string {
  const match = varDeclaration.match(/var\((--[\w-]+)\)/);
  return match ? match[1] : '';
}

/**
 * Optimizes a Tailwind class that contains custom variables
 * Converts from bracket notation to parentheses notation, preserving leading --
 * Example: "p-[var(--spacing)]" -> "p-(--spacing)"
 */
export function optimizeCustomVariableClass(tailwindClass: string): string {
  return tailwindClass.replace(/\[var\((--[\w-]+)\)\]/g, '($1)');
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
