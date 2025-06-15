// aspectRatio.ts
// Utility matchers for aspect-ratio CSS to Tailwind conversion
import { ASPECT_RATIO_PATTERNS } from './constants';

// Matcher for common aspect ratios (e.g., "16/9", "4:3", "1", "auto")
export const aspectRatioMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    return prop === 'aspect-ratio' && !!ASPECT_RATIO_PATTERNS[val];
  }
};

// Matcher for custom aspect ratios that need parsing (e.g., "1.777", "16 / 9")
export const customAspectRatioMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    if (prop !== 'aspect-ratio') return false;
    
    const val = value.toLowerCase().trim();
    // Don't match if it's already in the patterns
    if (ASPECT_RATIO_PATTERNS[val]) return false;
    
    // Match fraction format or decimal format
    return /^(\d+(?:\.\d+)?)\s*[\/\:]\s*(\d+(?:\.\d+)?)$/.test(val) || 
           /^(\d+(?:\.\d+)?)$/.test(val);
  }
};

// Matcher for any aspect-ratio value (fallback)
export const fallbackAspectRatioMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    return prop === 'aspect-ratio';
  }
};

/**
 * Parse aspect ratio value into width and height components
 * @param value - Aspect ratio value (e.g., "16/9", "1.777", "16:9")
 * @returns Object with width and height or null if invalid
 */
export function parseAspectRatio(value: string): { width: number, height: number } | null {
  const normalized = value.toLowerCase().trim();
  
  // Handle "auto"
  if (normalized === 'auto') {
    return null;
  }
  
  // Handle fraction format (e.g., "16 / 9", "16/9", "16:9")
  const fractionMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*[\/\:]\s*(\d+(?:\.\d+)?)$/);
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

/**
 * Convert aspect ratio to simplified fraction string
 * @param width - Width component
 * @param height - Height component
 * @returns Simplified fraction string (e.g., "16/9")
 */
export function aspectRatioToFraction(width: number, height: number): string {
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

/**
 * Convert aspect ratio to Tailwind class
 * @param property - CSS property name
 * @param value - Aspect ratio value
 * @returns Tailwind aspect ratio class or null
 */
export function convertAspectRatio(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  if (prop !== 'aspect-ratio') return null;
  
  const val = value.toLowerCase().trim();
  
  // Check for common patterns first
  if (ASPECT_RATIO_PATTERNS[val]) {
    return ASPECT_RATIO_PATTERNS[val];
  }
  
  // Parse custom ratio
  const parsed = parseAspectRatio(value);
  if (!parsed) {
    // Final fallback - use the value as-is in arbitrary syntax
    const cleanValue = value.trim().replace(/\s+/g, '');
    return `aspect-[${cleanValue}]`;
  }
  
  const { width, height } = parsed;
  
  // Check if it's a common ratio using decimal
  const decimal = width / height;
  const decimalStr = decimal.toString();
  const roundedDecimal = Math.round(decimal * 100) / 100;
  
  // Try to match against known patterns using decimal
  for (const [pattern, className] of Object.entries(ASPECT_RATIO_PATTERNS)) {
    if (pattern === decimalStr || pattern === roundedDecimal.toString()) {
      return className;
    }
  }
  
  // For custom ratios, create fraction notation
  if (height === 1) {
    // If height is 1, it's already a decimal ratio
    return `aspect-[${width}]`;
  } else {
    // Convert to simplified fraction
    const fraction = aspectRatioToFraction(width, height);
    return `aspect-[${fraction}]`;
  }
}
