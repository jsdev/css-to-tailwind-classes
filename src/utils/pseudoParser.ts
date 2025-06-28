import { PseudoInfo } from '../types';
import { validatePseudoCombination, sortPseudos } from './pseudoValidation';

// Tailwind CSS pseudo-class mappings
const PSEUDO_CLASS_MAP: Record<string, string> = {
  // Interactive states
  'hover': 'hover',
  'focus': 'focus',
  'focus-within': 'focus-within',
  'focus-visible': 'focus-visible',
  'active': 'active',
  'visited': 'visited',
  'target': 'target',
  
  // Form states
  'disabled': 'disabled',
  'enabled': 'enabled',
  'checked': 'checked',
  'indeterminate': 'indeterminate',
  'default': 'default',
  'required': 'required',
  'valid': 'valid',
  'invalid': 'invalid',
  'in-range': 'in-range',
  'out-of-range': 'out-of-range',
  'placeholder-shown': 'placeholder-shown',
  'autofill': 'autofill',
  'read-only': 'read-only',
  
  // Structural
  'first-child': 'first',
  'last-child': 'last',
  'only-child': 'only',
  'first-of-type': 'first-of-type',
  'last-of-type': 'last-of-type',
  'only-of-type': 'only-of-type',
  'empty': 'empty',
  
  // Content states
  'open': 'open',
  
  // Media states
  'portrait': 'portrait',
  'landscape': 'landscape',
  'motion-safe': 'motion-safe',
  'motion-reduce': 'motion-reduce',
  'dark': 'dark',
  'light': 'light',
  'contrast-more': 'contrast-more',
  'contrast-less': 'contrast-less',
  'forced-colors': 'forced-colors',
  'print': 'print',
  'rtl': 'rtl',
  'ltr': 'ltr'
};

// Tailwind CSS pseudo-element mappings
const PSEUDO_ELEMENT_MAP: Record<string, string> = {
  'before': 'before',
  'after': 'after',
  'first-line': 'first-line',
  'first-letter': 'first-letter',
  'selection': 'selection',
  'file-selector-button': 'file',
  'placeholder': 'placeholder',
  'marker': 'marker',
  'backdrop': 'backdrop'
};

/**
 * Parses nth-child/nth-of-type selectors and converts them to Tailwind equivalents
 */
function parseNthSelector(nthExpr: string): string | null {
  const expr = nthExpr.trim().toLowerCase();
  
  // Common patterns
  if (expr === 'odd') return 'odd';
  if (expr === 'even') return 'even';
  
  // Simple number (nth-child(3))
  const numberMatch = expr.match(/^(\d+)$/);
  if (numberMatch) {
    const n = parseInt(numberMatch[1]);
    return `[&:nth-child(${n})]`;
  }
  
  // Complex expressions (2n+1, 3n, etc.)
  const complexMatch = expr.match(/^(\d*)n([+-]\d+)?$/);
  if (complexMatch) {
    return `[&:nth-child(${expr})]`;
  }
  
  return `[&:nth-child(${expr})]`;
}

/**
 * Parses :has() selectors for Tailwind
 */
function parseHasSelector(hasContent: string): string {
  // For :has() selectors, we use arbitrary value syntax
  return `has-[${hasContent.trim()}]`;
}

/**
 * Parses :not() selectors for Tailwind
 */
function parseNotSelector(notContent: string): string {
  // Parse what's inside :not()
  const pseudoInfo = parsePseudoFromSelector(notContent);
  
  if (pseudoInfo.classes.length > 0) {
    // If it contains pseudo-classes, combine them
    return `not-[${pseudoInfo.classes.join(':')}]`;
  } else if (notContent.startsWith('.')) {
    // Class selector
    return `not-[${notContent}]`;
  } else if (notContent.startsWith('#')) {
    // ID selector
    return `not-[${notContent}]`;
  } else if (notContent.match(/^[a-zA-Z]+$/)) {
    // Element selector
    return `not-[${notContent}]`;
  } else {
    // Complex selector
    return `not-[${notContent}]`;
  }
}

/**
 * Extracts pseudo-classes and pseudo-elements from a CSS selector
 */
export function parsePseudoFromSelector(selector: string): PseudoInfo {
  const pseudoClasses: string[] = [];
  const pseudoElements: string[] = [];
  
  // Remove the base selector part to focus on pseudo-selectors
  let workingSelector = selector;
  
  // Handle ::pseudo-elements (double colon)
  const doubleColonRegex = /::([a-zA-Z-]+)(?:\([^)]*\))?/g;
  let match;
  
  while ((match = doubleColonRegex.exec(selector)) !== null) {
    const pseudoElement = match[1];
    const tailwindPseudo = PSEUDO_ELEMENT_MAP[pseudoElement];
    
    if (tailwindPseudo) {
      pseudoElements.push(tailwindPseudo);
    } else {
      // Use arbitrary value for unsupported pseudo-elements
      pseudoElements.push(`[&::${pseudoElement}]`);
    }
    
    // Remove this pseudo-element from working selector
    workingSelector = workingSelector.replace(match[0], '');
  }
  
  // Handle :pseudo-classes (single colon)
  const singleColonRegex = /:([a-zA-Z-]+)(?:\(([^)]*)\))?/g;
  
  while ((match = singleColonRegex.exec(workingSelector)) !== null) {
    const pseudoClass = match[1];
    const pseudoArgs = match[2];
    
    // Handle special function pseudo-classes
    if (pseudoClass === 'nth-child' || pseudoClass === 'nth-of-type') {
      if (pseudoArgs) {
        const nthClass = parseNthSelector(pseudoArgs);
        if (nthClass) {
          pseudoClasses.push(nthClass);
        }
      }
    } else if (pseudoClass === 'has') {
      if (pseudoArgs) {
        pseudoClasses.push(parseHasSelector(pseudoArgs));
      }
    } else if (pseudoClass === 'not') {
      if (pseudoArgs) {
        pseudoClasses.push(parseNotSelector(pseudoArgs));
      }
    } else {
      // Regular pseudo-class
      const tailwindPseudo = PSEUDO_CLASS_MAP[pseudoClass];
      
      if (tailwindPseudo) {
        pseudoClasses.push(tailwindPseudo);
      } else {
        // Use arbitrary value for unsupported pseudo-classes
        pseudoClasses.push(`[&:${pseudoClass}${pseudoArgs ? `(${pseudoArgs})` : ''}]`);
      }
    }
  }
  
  return {
    classes: pseudoClasses,
    elements: pseudoElements
  };
}

/**
 * Extracts the base selector (without pseudo-classes/elements)
 */
export function getBaseSelector(selector: string): string {
  // Remove all pseudo-classes and pseudo-elements
  return selector
    .replace(/::?[a-zA-Z-]+(?:\([^)]*\))?/g, '')
    .trim();
}

/**
 * Applies pseudo-classes and pseudo-elements to Tailwind classes with validation
 */
export function applyPseudoToClasses(
  classes: string[], 
  pseudoInfo: PseudoInfo
): { classes: string[]; warnings?: string[] } {
  if (pseudoInfo.classes.length === 0 && pseudoInfo.elements.length === 0) {
    return { classes };
  }
  
  // Validate the pseudo combination
  const validation = validatePseudoCombination(pseudoInfo.classes, pseudoInfo.elements);
  const warnings: string[] = [];
  
  if (!validation.isValid) {
    warnings.push(`Invalid pseudo combination: ${validation.reason}`);
    if (validation.suggestion) {
      warnings.push(`Suggestion: ${validation.suggestion}`);
    }
    // Return original classes if invalid
    return { classes, warnings };
  }
  
  // Sort pseudos in correct Tailwind order
  const sortedPseudos = sortPseudos([...pseudoInfo.elements, ...pseudoInfo.classes]);
  
  const finalClasses = classes.map(className => {
    // Build the pseudo prefix
    const pseudoPrefix = sortedPseudos.join(':');
    return `${pseudoPrefix}:${className}`;
  });
  
  return { classes: finalClasses, warnings: warnings.length > 0 ? warnings : undefined };
}

/**
 * Formats pseudo-classes and pseudo-elements for display
 */
export function formatPseudoForDisplay(pseudoInfo: PseudoInfo): string {
  const allPseudos = [...pseudoInfo.elements, ...pseudoInfo.classes];
  
  if (allPseudos.length === 0) return '';
  
  return allPseudos
    .map(pseudo => {
      // Handle arbitrary values (keep them as-is)
      if (pseudo.startsWith('[&:') || pseudo.startsWith('[&::')) {
        return pseudo;
      }
      // Handle other special cases
      if (pseudo.startsWith('has-[') || pseudo.startsWith('not-[')) {
        return pseudo;
      }
      // Regular pseudo-classes/elements
      return pseudo;
    })
    .join(':');
}
