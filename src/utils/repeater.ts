// repeater.ts
// Utility functions for detecting and optimizing repeated values

import { getRepeaterThreshold, isRepeaterOptimizationEnabled } from './settings';

export interface RepeaterPattern {
  value: string;
  count: number;
  property: string;
  optimized: string;
}

/**
 * Detect repeated values in CSS declarations
 * @param declarations Array of CSS declarations
 * @returns Array of detected repeater patterns
 */
export function detectRepeaterPatterns(declarations: Array<{ property: string; value: string }>): RepeaterPattern[] {
  if (!isRepeaterOptimizationEnabled()) {
    return [];
  }

  const threshold = getRepeaterThreshold();
  const patterns: RepeaterPattern[] = [];
  
  // Group by property type
  const gridTemplateColumns = declarations.filter(d => d.property === 'grid-template-columns');
  const gridTemplateRows = declarations.filter(d => d.property === 'grid-template-rows');
  
  // Analyze grid template columns
  for (const decl of gridTemplateColumns) {
    const pattern = analyzeRepeatedValues(decl.value, threshold);
    if (pattern) {
      patterns.push({
        value: pattern.value,
        count: pattern.count,
        property: decl.property,
        optimized: `repeat(${pattern.count}, ${pattern.value})`
      });
    }
  }
  
  // Analyze grid template rows
  for (const decl of gridTemplateRows) {
    const pattern = analyzeRepeatedValues(decl.value, threshold);
    if (pattern) {
      patterns.push({
        value: pattern.value,
        count: pattern.count,
        property: decl.property,
        optimized: `repeat(${pattern.count}, ${pattern.value})`
      });
    }
  }
  
  return patterns;
}

/**
 * Analyze a CSS value for repeated patterns
 * @param value CSS value to analyze
 * @param threshold Minimum number of repetitions
 * @returns Detected pattern or null
 */
export function analyzeRepeatedValues(value: string, threshold: number): { value: string; count: number } | null {
  const parts = value.trim().split(/\s+/);
  
  if (parts.length < threshold) {
    return null;
  }
  
  // Check if all parts are the same
  const firstPart = parts[0];
  if (parts.every(part => part === firstPart)) {
    return {
      value: firstPart,
      count: parts.length
    };
  }
  
  // Check for patterns like "200px 200px 200px" (all same)
  const uniqueParts = [...new Set(parts)];
  if (uniqueParts.length === 1) {
    return {
      value: uniqueParts[0],
      count: parts.length
    };
  }
  
  // Check for repeating patterns like "200px 100px 200px 100px"
  for (let patternLength = 2; patternLength <= Math.floor(parts.length / 2); patternLength++) {
    const pattern = parts.slice(0, patternLength);
    let isRepeating = true;
    
    for (let i = patternLength; i < parts.length; i += patternLength) {
      const currentChunk = parts.slice(i, i + patternLength);
      if (currentChunk.length !== patternLength || !arraysEqual(pattern, currentChunk)) {
        isRepeating = false;
        break;
      }
    }
    
    if (isRepeating && parts.length >= threshold * patternLength) {
      return {
        value: pattern.join(' '),
        count: Math.floor(parts.length / patternLength)
      };
    }
  }
  
  return null;
}

/**
 * Convert CSS value to optimized repeater syntax
 * @param property CSS property name
 * @param value CSS value
 * @returns Optimized value or original value
 */
export function optimizeRepeaterValue(property: string, value: string): string {
  if (!isRepeaterOptimizationEnabled()) {
    return value;
  }

  const threshold = getRepeaterThreshold();
  const pattern = analyzeRepeatedValues(value, threshold);
  
  if (pattern) {
    // For grid properties, use CSS repeat() function
    if (property === 'grid-template-columns' || property === 'grid-template-rows') {
      return `repeat(${pattern.count}, ${pattern.value})`;
    }
  }
  
  return value;
}

/**
 * Convert repeated pattern to Tailwind class
 * @param property CSS property
 * @param pattern Detected repeater pattern
 * @returns Tailwind class or null
 */
export function convertRepeaterToTailwind(property: string, pattern: RepeaterPattern): string | null {
  if (property === 'grid-template-columns') {
    // Check if it's a simple fr pattern
    if (pattern.value === '1fr' && pattern.count <= 12) {
      return `grid-cols-${pattern.count}`;
    }
    
    // Use arbitrary value with repeat
    return `grid-cols-[repeat(${pattern.count},${pattern.value.replace(/\s+/g, '_')})]`;
  }
  
  if (property === 'grid-template-rows') {
    // Check if it's a simple fr pattern
    if (pattern.value === '1fr' && pattern.count <= 6) {
      return `grid-rows-${pattern.count}`;
    }
    
    // Use arbitrary value with repeat
    return `grid-rows-[repeat(${pattern.count},${pattern.value.replace(/\s+/g, '_')})]`;
  }
  
  return null;
}

/**
 * Helper function to check if two arrays are equal
 */
function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

/**
 * Get optimization suggestions for CSS
 * @param declarations CSS declarations
 * @returns Array of optimization suggestions
 */
export function getOptimizationSuggestions(declarations: Array<{ property: string; value: string }>): string[] {
  const suggestions: string[] = [];
  const patterns = detectRepeaterPatterns(declarations);
  
  for (const pattern of patterns) {
    const tailwindClass = convertRepeaterToTailwind(pattern.property, pattern);
    if (tailwindClass) {
      suggestions.push(
        `${pattern.property}: ${pattern.value.repeat(pattern.count).replace(new RegExp(pattern.value, 'g'), pattern.value + ' ').trim()} → ${tailwindClass}`
      );
    }
  }
  
  return suggestions;
}
