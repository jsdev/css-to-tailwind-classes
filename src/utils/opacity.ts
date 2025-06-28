/**
 * Opacity utility for converting CSS opacity values to Tailwind classes
 */

export interface OpacityMatcher {
  match: (property: string, value: string) => boolean;
}

// Opacity scale mapping (Tailwind uses 0-100 scale)
const OPACITY_SCALE: Record<string, string> = {
  '0': '0',
  '0.05': '5',
  '0.1': '10',
  '0.15': '15',
  '0.2': '20',
  '0.25': '25',
  '0.3': '30',
  '0.35': '35',
  '0.4': '40',
  '0.45': '45',
  '0.5': '50',
  '0.55': '55',
  '0.6': '60',
  '0.65': '65',
  '0.7': '70',
  '0.75': '75',
  '0.8': '80',
  '0.85': '85',
  '0.9': '90',
  '0.95': '95',
  '1': '100',
};

// Also handle percentage values
const OPACITY_PERCENTAGE_SCALE: Record<string, string> = {
  '0%': '0',
  '5%': '5',
  '10%': '10',
  '15%': '15',
  '20%': '20',
  '25%': '25',
  '30%': '30',
  '35%': '35',
  '40%': '40',
  '45%': '45',
  '50%': '50',
  '55%': '55',
  '60%': '60',
  '65%': '65',
  '70%': '70',
  '75%': '75',
  '80%': '80',
  '85%': '85',
  '90%': '90',
  '95%': '95',
  '100%': '100',
};

export const opacityMatcher: OpacityMatcher = {
  match: (property: string, value: string) => {
    const prop = property.toLowerCase().trim();
    const val = value.toLowerCase().trim();
    
    return prop === 'opacity' && (
      OPACITY_SCALE[val] !== undefined ||
      OPACITY_PERCENTAGE_SCALE[val] !== undefined ||
      /^0?\.\d+$/.test(val) ||  // decimal like 0.5, .5
      /^\d+%$/.test(val)        // percentage like 50%
    );
  }
};

export function convertOpacity(property: string, value: string): string | null {
  const prop = property.toLowerCase().trim();
  const val = value.toLowerCase().trim();
  
  if (prop !== 'opacity') {
    return null;
  }
  
  // Check exact matches first
  if (OPACITY_SCALE[val]) {
    return `opacity-${OPACITY_SCALE[val]}`;
  }
  
  if (OPACITY_PERCENTAGE_SCALE[val]) {
    return `opacity-${OPACITY_PERCENTAGE_SCALE[val]}`;
  }
  
  // Handle decimal values
  if (/^0?\.\d+$/.test(val)) {
    const decimal = parseFloat(val);
    if (decimal >= 0 && decimal <= 1) {
      // Convert to percentage and round to nearest 5
      const percentage = Math.round(decimal * 100);
      const roundedPercentage = Math.round(percentage / 5) * 5;
      
      if (roundedPercentage <= 100) {
        return `opacity-${roundedPercentage}`;
      }
    }
  }
  
  // Handle percentage values
  if (/^\d+%$/.test(val)) {
    const percentage = parseInt(val.replace('%', ''));
    if (percentage >= 0 && percentage <= 100) {
      // Round to nearest 5
      const roundedPercentage = Math.round(percentage / 5) * 5;
      return `opacity-${roundedPercentage}`;
    }
  }
  
  // Fallback to arbitrary value
  return `opacity-[${value}]`;
}

export const opacityPatternMatcher = {
  test: opacityMatcher.match,
  convert: convertOpacity
};
