/**
 * Validation utilities for pseudo-class and pseudo-element combinations in Tailwind CSS
 */

// Pseudo-elements that can have state variants applied
const STATEFUL_PSEUDO_ELEMENTS = new Set([
  'before',
  'after',
  'placeholder',
  'file'
]);

// Pseudo-elements that cannot have state variants
const NON_STATEFUL_PSEUDO_ELEMENTS = new Set([
  'first-line',
  'first-letter',
  'selection',
  'marker',
  'backdrop'
]);

// State variants that can be applied to pseudo-elements
const VALID_PSEUDO_ELEMENT_STATES = new Set([
  'hover',
  'focus',
  'active',
  'disabled',
  'group-hover',
  'group-focus'
]);

// Complex pseudo-classes that should not be combined with certain states
const COMPLEX_PSEUDO_CLASSES = new Set([
  'has',
  'not',
  'nth-child',
  'nth-of-type'
]);

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  suggestion?: string;
}

/**
 * Validates if a combination of pseudo-classes and pseudo-elements is valid in Tailwind
 */
export function validatePseudoCombination(
  pseudoClasses: string[],
  pseudoElements: string[]
): ValidationResult {
  // Check if we have both pseudo-elements and pseudo-classes
  if (pseudoElements.length > 0 && pseudoClasses.length > 0) {
    // Only certain pseudo-elements can have state variants
    for (const element of pseudoElements) {
      if (NON_STATEFUL_PSEUDO_ELEMENTS.has(element)) {
        return {
          isValid: false,
          reason: `Pseudo-element ::${element} cannot have state variants applied`,
          suggestion: `Move state variants to the base element or remove ::${element}`
        };
      }
      
      if (!STATEFUL_PSEUDO_ELEMENTS.has(element)) {
        // Check if it's an arbitrary pseudo-element
        if (!element.startsWith('[&::')) {
          return {
            isValid: false,
            reason: `Pseudo-element ::${element} cannot be combined with state variants`,
            suggestion: `Use only ::before, ::after, ::placeholder, or ::file with state variants`
          };
        }
      }
    }
    
    // Check if state variants are valid for pseudo-elements
    for (const pseudoClass of pseudoClasses) {
      // Skip arbitrary pseudo-classes
      if (pseudoClass.startsWith('[&:')) continue;
      
      if (!VALID_PSEUDO_ELEMENT_STATES.has(pseudoClass)) {
        return {
          isValid: false,
          reason: `State variant :${pseudoClass} cannot be applied to pseudo-elements`,
          suggestion: `Use only hover, focus, active, or disabled states with pseudo-elements`
        };
      }
    }
  }
  
  // Check for multiple pseudo-elements (not allowed)
  if (pseudoElements.length > 1) {
    return {
      isValid: false,
      reason: 'Multiple pseudo-elements cannot be combined',
      suggestion: 'Use only one pseudo-element per selector'
    };
  }
  
  // Check for complex pseudo-classes with :not()
  const hasNot = pseudoClasses.some(pc => pc.startsWith('not-['));
  const hasComplex = pseudoClasses.some(pc => 
    COMPLEX_PSEUDO_CLASSES.has(pc) || pc.includes('[&:')
  );
  
  if (hasNot && hasComplex && pseudoClasses.length > 2) {
    return {
      isValid: false,
      reason: 'Complex :not() combinations with multiple pseudo-classes may not work as expected',
      suggestion: 'Simplify the selector or use separate rules'
    };
  }
  
  return { isValid: true };
}

/**
 * Suggests fixes for invalid pseudo combinations
 */
export function suggestPseudoFix(
  pseudoClasses: string[],
  pseudoElements: string[]
): string[] {
  const suggestions: string[] = [];
  
  const validation = validatePseudoCombination(pseudoClasses, pseudoElements);
  if (validation.isValid) return suggestions;
  
  if (validation.suggestion) {
    suggestions.push(validation.suggestion);
  }
  
  // Additional specific suggestions
  if (pseudoElements.length > 0 && pseudoClasses.length > 0) {
    const validStates = pseudoClasses.filter(pc => 
      VALID_PSEUDO_ELEMENT_STATES.has(pc) || pc.startsWith('[&:')
    );
    
    if (validStates.length < pseudoClasses.length) {
      suggestions.push(
        `Try using only these states with pseudo-elements: ${validStates.join(', ')}`
      );
    }
  }
  
  return suggestions;
}

/**
 * Gets the order priority for pseudo-classes (lower number = higher priority)
 */
export function getPseudoOrder(pseudo: string): number {
  const orderMap: Record<string, number> = {
    // Responsive first
    'sm': 1, 'md': 2, 'lg': 3, 'xl': 4, '2xl': 5,
    
    // Dark mode
    'dark': 10, 'light': 11,
    
    // Motion preferences
    'motion-safe': 15, 'motion-reduce': 16,
    
    // State variants
    'first': 20, 'last': 21, 'odd': 22, 'even': 23,
    'hover': 30, 'focus': 31, 'active': 32, 'visited': 33,
    'disabled': 40, 'enabled': 41, 'checked': 42,
    
    // Pseudo-elements (should be last)
    'before': 100, 'after': 101, 'placeholder': 102,
    'file': 103, 'marker': 104, 'selection': 105
  };
  
  return orderMap[pseudo] || 50; // Default middle priority
}

/**
 * Sorts pseudo-classes/elements in the correct Tailwind order
 */
export function sortPseudos(pseudos: string[]): string[] {
  return [...pseudos].sort((a, b) => getPseudoOrder(a) - getPseudoOrder(b));
}
