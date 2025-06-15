// grid.ts
// Utility matchers for grid-related CSS to Tailwind conversion
import { GRID_PATTERNS, GRID_ROWS_PATTERNS } from './constants';

// Matcher for grid-template-columns (equal columns with fr units)
export const gridTemplateColumnsMatcher = {
  match: (property: string, value: string) => {
    return property === 'grid-template-columns' && !!GRID_PATTERNS[value.toLowerCase().trim()];
  }
};

// Matcher for grid-template-rows (equal rows with fr units)
export const gridRowsMatcher = {
  match: (property: string, value: string) => {
    return property === 'grid-template-rows' && !!GRID_ROWS_PATTERNS[value.toLowerCase().trim()];
  }
};

// Matcher for grid-template-columns with fixed sizes (e.g., "200px 200px 200px")
export const gridTemplateColumnsFixedMatcher = {
  match: (property: string, value: string) => {
    if (property !== 'grid-template-columns') return false;
    const parts = value.trim().split(/\s+/);
    return parts.length > 1 && parts.every(p => p === parts[0]);
  }
};

// Matcher for grid-template-rows with fixed sizes
export const gridRowsFixedMatcher = {
  match: (property: string, value: string) => {
    if (property !== 'grid-template-rows') return false;
    const parts = value.trim().split(/\s+/);
    return parts.length > 1 && parts.every(p => p === parts[0]);
  }
};

// Matcher for grid gap
export const gridGapMatcher = {
  match: (property: string, value: string) => {
    return ['gap', 'grid-gap'].includes(property);
  }
};

// Matcher for grid column gap
export const gridColumnGapMatcher = {
  match: (property: string, value: string) => {
    return ['column-gap', 'grid-column-gap'].includes(property);
  }
};

// Matcher for grid row gap
export const gridRowGapMatcher = {
  match: (property: string, value: string) => {
    return ['row-gap', 'grid-row-gap'].includes(property);
  }
};

// Matcher for grid column/row span
export const gridSpanMatcher = {
  match: (property: string, value: string) => {
    return (property === 'grid-column' || property === 'grid-row') && /^span\s+\d+$/.test(value.trim());
  }
};

// Matcher for grid column/row start/end
export const gridStartEndMatcher = {
  match: (property: string, value: string) => {
    return (
      ['grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end'].includes(property) &&
      (/^\d+$/.test(value.trim()) || value.trim() === 'auto')
    );
  }
};

/**
 * Processes grid-related CSS properties and returns corresponding Tailwind classes.
 * @param property The CSS property name.  
 * @param value The CSS property value.
 * @returns An array of Tailwind classes.
 */
export function processGrid(property: string, value: string): string[] {
  const normalizedValue = value.trim();
  
  switch (property) {
    case 'grid-template-rows':
      // Check for standard patterns first
      const rowPattern = GRID_ROWS_PATTERNS[normalizedValue.toLowerCase()];
      if (rowPattern) {
        return [rowPattern];
      }
      
      // Check for repeating patterns like "200px 200px 200px"
      const rowParts = normalizedValue.split(/\s+/);
      if (rowParts.length > 1 && rowParts.every(part => part === rowParts[0])) {
        const cleanValue = normalizedValue.replace(/\s+/g, '_');
        return [`grid-rows-[${cleanValue}]`];
      }
      
      // Fallback to arbitrary value
      const cleanRowValue = normalizedValue.replace(/\s+/g, '_');
      return [`grid-rows-[${cleanRowValue}]`];
      
    case 'grid-row-start':
      if (normalizedValue === 'auto') {
        return ['row-start-auto'];
      }
      if (/^\d+$/.test(normalizedValue)) {
        return [`row-start-${normalizedValue}`];
      }
      return [`row-start-[${normalizedValue}]`];
      
    case 'grid-row-end':
      if (normalizedValue === 'auto') {
        return ['row-end-auto'];
      }
      if (/^\d+$/.test(normalizedValue)) {
        return [`row-end-${normalizedValue}`];
      }
      return [`row-end-[${normalizedValue}]`];
      
    case 'grid-template-columns':
      // Check for standard patterns first
      const colPattern = GRID_PATTERNS[normalizedValue.toLowerCase()];
      if (colPattern) {
        return [colPattern];
      }
      
      // Check for repeating patterns like "200px 200px 200px"
      const colParts = normalizedValue.split(/\s+/);
      if (colParts.length > 1 && colParts.every(part => part === colParts[0])) {
        const cleanValue = normalizedValue.replace(/\s+/g, '_');
        return [`grid-cols-[${cleanValue}]`];
      }
      
      // Fallback to arbitrary value
      const cleanColValue = normalizedValue.replace(/\s+/g, '_');
      return [`grid-cols-[${cleanColValue}]`];
      
    case 'grid-column-start':
      if (normalizedValue === 'auto') {
        return ['col-start-auto'];
      }
      if (/^\d+$/.test(normalizedValue)) {
        return [`col-start-${normalizedValue}`];
      }
      return [`col-start-[${normalizedValue}]`];
      
    case 'grid-column-end':
      if (normalizedValue === 'auto') {
        return ['col-end-auto'];
      }
      if (/^\d+$/.test(normalizedValue)) {
        return [`col-end-${normalizedValue}`];
      }
      return [`col-end-[${normalizedValue}]`];
      
    default:
      return [];
  }
}
